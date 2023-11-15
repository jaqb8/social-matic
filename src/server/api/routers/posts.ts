import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { Client } from "@upstash/qstash";
import { Redis } from "@upstash/redis";
import { PlatformEnum } from "@/lib/types";
import { env } from "@/env.mjs";

// Create a new ratelimiter with a sliding window of 3 requests per minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

const qstashClient = new Client({
  token: env.QSTASH_TOKEN,
});
const QSTASH_URL = {
  [PlatformEnum.enum.TWITTER]:
    "https://social-matic.vercel.app/api/post-twitter",
  [PlatformEnum.enum.LINKEDIN]:
    "https://social-matic.vercel.app/api/post-linkedin",
};

export const postsRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.post.findMany({
      take: 100,
      orderBy: [
        {
          postDate: "asc",
        },
      ],
      where: {
        authorId: ctx.currentUserId,
      },
    });
  }),
  getAllScheduled: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.post.findMany({
      take: 100,
      orderBy: [
        {
          postDate: "asc",
        },
      ],
      where: {
        authorId: ctx.currentUserId,
        postDate: {
          gt: new Date(),
        },
      },
    });
  }),
  getAllArchived: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.post.findMany({
      take: 100,
      orderBy: [
        {
          postDate: "asc",
        },
      ],
      where: {
        authorId: ctx.currentUserId,
        postDate: {
          lt: new Date(),
        },
      },
    });
  }),
  createPost: privateProcedure
    .input(
      z.object({
        content: z
          .string()
          .min(1, {
            message: "Content must be at least 1 character long",
          })
          .max(255, {
            message: "Content must be at most 255 characters long",
          }),
        postDate: z.date(),
        platforms: z.array(PlatformEnum),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.currentUserId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests. Please try again later.",
        });
      }

      const createPostPromises = input.platforms.map(async (platform) => {
        const { messageId } = await qstashClient.publishJSON({
          url: QSTASH_URL[platform],
          notBefore: Math.floor(input.postDate.getTime() / 1000),
          body: {
            userId: authorId,
            content: input.content,
          },
        });

        const post = ctx.db.post.create({
          data: {
            authorId,
            content: input.content,
            postDate: input.postDate,
            platform,
            messageId,
          },
        });

        return post;
      });

      try {
        const posts = await Promise.all(createPostPromises);

        return {
          posts,
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not schedule post. Please try again later.",
        });
      }
    }),
});

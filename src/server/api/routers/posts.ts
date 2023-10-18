import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { PlatformEnum } from "@/lib/types";

// Create a new ratelimiter with a sliding window of 3 requests per minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const postsRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.post.findMany({
      take: 100,
      orderBy: [
        {
          postDate: "asc",
        },
      ],
      include: {
        platforms: true,
      },
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
      include: {
        platforms: true,
      },
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
      include: {
        platforms: true,
      },
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

      const post = await ctx.db.post.create({
        data: {
          authorId,
          content: input.content,
          postDate: input.postDate,
          platforms: {
            connect: input.platforms.map((platform) => ({
              name: platform,
            })),
          },
        },
      });
      return post;
    }),
});

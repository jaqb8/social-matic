import type { User } from "@clerk/backend/dist/types/api";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import dayjs, { type Dayjs } from "dayjs";

import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "@/server/api/trpc";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    imageUrl: user.imageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
      orderBy: [
        {
          postDate: "desc",
        },
      ],
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);
      if (!author) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author not found",
        });
      }

      return {
        post,
        author,
      };
    });
  }),
  createPost: privateProcedure
    .input(
      z.object({
        content: z.string().min(1).max(255),
        postDate: z.date(),
        platform: z.enum(["LINKEDIN", "TWITTER"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.currentUserId;
      const post = await ctx.db.post.create({
        data: {
          authorId,
          content: input.content,
          postDate: input.postDate,
          platform: input.platform,
        },
      });
      return post;
    }),
});

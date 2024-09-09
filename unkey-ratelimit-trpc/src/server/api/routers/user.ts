import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { UnkeyRatelimit } from "~/server/ratelimit";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure
    .input(z.object({ created_by: z.string() }))
    .query(async ({ ctx, input }) => {
      const success = await UnkeyRatelimit({
        namespace: "user.get",
        limit: 3,
        duration: 5,
        userId: ctx.session.user.id,
      });
      if (!success) {
        return new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.created_by),
      });

      return user ?? new TRPCError({ code: "NOT_FOUND" });
    }),
});

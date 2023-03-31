import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const goalsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const test = await ctx.prisma.goal.findUnique({ where: { id: "1" } });
    console.log("test", test?.createdAt);
    return ctx.prisma.goal.findMany();
  }),

  addGoal: publicProcedure.query(async ({ ctx }) => {
    const test = await ctx.prisma.goal.findUnique({ where: { id: "1" } });
    console.log("test", test?.createdAt);
    return ctx.prisma.goal.findMany();
  }),
});

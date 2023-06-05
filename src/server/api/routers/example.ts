import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const test = await ctx.prisma.example.findUnique({ where: { id: "1" } });

    return ctx.prisma.example.findMany();
  }),

  getGoals: publicProcedure.query(async ({ ctx }) => {
    const test = await ctx.prisma.goal.findUnique({ where: { id: "1" } });

    return ctx.prisma.goal.findMany();
  }),

  addGoal: publicProcedure.query(async ({ ctx }) => {
    const test = await ctx.prisma.goal.findUnique({ where: { id: "1" } });

    return ctx.prisma.goal.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

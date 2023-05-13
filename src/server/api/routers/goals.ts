import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const goalsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const test = await ctx.prisma.goal.findUnique({ where: { id: "1" } });

    return ctx.prisma.goal.findMany();
  }),

  addGoal: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        id: z.string(),
        description: z.string(),
        category: z.string(),
        completion: z.number(),
        isCompleted: z.boolean(),
        createdAt: z.date(),
        updatedAt: z.date(),
        completedAt: z.date(),
        image: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        id,
        description,
        category,
        completion,
        isCompleted,
        createdAt,
        updatedAt,
        completedAt,
        image,
      } = input;
      try {
        const newGoal = await ctx.prisma.goal.create({
          data: {
            name,
            id,
            description,
            category,
            completion,
            isCompleted,
            createdAt,
            updatedAt,
            completedAt,
            image,
          },
        });

        return newGoal;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error while adding goal",
        });
      }
    }),

  deleteGoal: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      try {
        await ctx.prisma.goal.delete({
          where: { id },
        });

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error while deleting goal ${id}`,
        });
      }
    }),

  editGoal: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        id: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        completion: z.number().optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...rest } = input;
      try {
        const newGoal = await ctx.prisma.goal.update({
          where: {
            id: id,
          },
          data: rest,
        });

        return newGoal;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error while adding goal",
        });
      }
    }),
});

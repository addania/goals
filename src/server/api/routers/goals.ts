import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const goalsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // const test = await ctx.prisma.goal.findUnique({ where: { id: "1" } });

    return ctx.prisma.goal.findMany({
      // take: 100,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      //  where: { authorId: "user_2OBaeJj8EI29omUN4LZTUFl7TBh" },
    });
  }),

  addGoal: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        category: z.string().optional(),
        completion: z.number().optional(),
        image: z
          .string()
          .refine((value) => value === "" || new URL(value), {
            message: "Image must be a valid URL or empty",
          })
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, description, category, completion, image } = input;
      console.log("imageeeee", image);
      try {
        const newGoal = await ctx.prisma.goal.create({
          data: {
            name,
            description,
            category,
            completion,
            image: image === "" ? undefined : image,
          },
        });
        console.log("imageeeee", image);
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

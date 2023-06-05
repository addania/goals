import * as z from "zod";

export const goalSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .nonempty(),
  description: z
    .string({ invalid_type_error: "Name must be a string" })
    .optional(),
  category: z
    .string({
      invalid_type_error: "Category must be a string",
    })
    .optional(),
  image: z
    .string()
    .refine((value) => value === "" || new URL(value), {
      message: "Image must be a valid URL or empty",
    })
    .optional(),
});

export type GoalSchema = z.infer<typeof goalSchema>;

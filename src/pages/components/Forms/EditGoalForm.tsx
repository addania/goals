import * as React from "react";
import * as z from "zod";

import { Divider } from "@mantine/core";
//import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
//import * as ReactHookForm from "react-hook-form";
import { goalSchema } from "../../types/goal";
import type { GoalSchema } from "../../types/goal";
import { api } from "~/utils/api";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { zodResolver } = require("@hookform/resolvers/zod");

type GoalSchemaWithCompletion = GoalSchema & { completion: number; id: string };

type EditProps = { close: () => void; goal: GoalSchemaWithCompletion };

const editGoalSchema = goalSchema.extend({
  completion: z.string().refine((value) => {
    const num = Number(value);
    return num >= 0 && num <= 100;
  }, "Completion must be a number from 0 to 100"),
});

export const EditGoalForm = ({ close, goal }: EditProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalSchemaWithCompletion>({
    resolver: zodResolver(editGoalSchema),
  });
  const editGoalMutation = api.goals.editGoal.useMutation();
  const ctx = api.useContext();

  const onSubmit = (data: GoalSchemaWithCompletion) => {
    const newGoal = {
      id: goal.id,
      name: data.name,
      description: data.description,
      category: data.category,
      completion: Number(data.completion),
      image: data.image,
    };

    editGoalMutation.mutate(newGoal, {
      onSuccess: () => {
        toast.success("Successfully edited your goal.");
        void ctx.goals.getAll.invalidate();
        close();
      },
      onError: ({ data }) => {
        toast.error(
          `Failed to edit goal. Application returned: ${data ? data.code : ""}`
        );
      },
    });
  };

  return (
    <>
      <Divider my="sm" />
      <form
        //THIS FUNCTION IS ONLY CALLED IF VALIDATION IS SUCCESSFULL
        onSubmit={handleSubmit(onSubmit)}
        style={{ color: "black", backgroundColor: "white" }}
        id="goal_form"
      >
        <div style={{ margin: "16px 0" }}>
          <div>
            <span style={{ color: "red" }}>*</span>
            <span> Name</span>
          </div>
          <input
            type="text"
            {...register("name")}
            placeholder="Name your goal"
            style={{
              padding: "4px 8px",
              border: "1px solid #868E96",
              borderRadius: "2px",
              width: "100%",
            }}
            defaultValue={goal.name}
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div style={{ margin: "16px 0" }}>
          <div>Description</div>
          <input
            type="text"
            {...register("description")}
            placeholder="Add details about your goal"
            style={{
              padding: "4px 8px",
              border: "1px solid #868E96",
              borderRadius: "2px",
              width: "100%",
            }}
            defaultValue={goal.description}
          />
          {errors.description && <p>{errors.description.message}</p>}
        </div>
        <div style={{ margin: "16px 0" }}>
          <div>Category</div>
          <input
            type="text"
            {...register("category")}
            placeholder="Group your goal"
            style={{
              padding: "4px 8px",
              border: "1px solid #868E96",
              borderRadius: "2px",
              width: "100%",
            }}
            defaultValue={goal.category}
          />
          {errors.category && <p>{errors.category.message}</p>}
        </div>
        <div style={{ margin: "16px 0" }}>
          <div>Completion (%)</div>
          <input
            type="number"
            {...register("completion")}
            placeholder="Number from 0 to 100"
            style={{
              padding: "4px 8px",
              border: "1px solid #868E96",
              borderRadius: "2px",
              width: "100%",
            }}
            defaultValue={goal.completion}
          />
          {errors.completion && <p>{errors.completion.message}</p>}
        </div>

        <div style={{ margin: "16px 0" }}>
          <div>Image url</div>
          <input
            type="url"
            {...register("image")}
            placeholder="Url of image"
            style={{
              padding: "4px 8px",
              border: "1px solid #868E96",
              borderRadius: "2px",
              width: "100%",
            }}
            defaultValue={goal.image}
          />
          {errors.image && <p>{errors.image.message}</p>}
        </div>
        <input
          style={{
            backgroundColor: "#E7F5FF",
            color: "#228be6",
            border: "none",
            borderRadius: "5px",
            padding: "8px 16px",
            fontWeight: "bold",
          }}
          type="submit"
        />
      </form>
    </>
  );
};

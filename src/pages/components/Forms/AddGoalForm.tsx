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

const { zodResolver } = require("@hookform/resolvers/zod");

type Props = {
  close: () => void;
};

export const AddGoalForm = ({ close }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalSchema>({
    resolver: zodResolver(goalSchema),
  });

  const { mutate: createGoalMutation, isLoading } =
    api.goals.addGoal.useMutation();
  const ctx = api.useContext();

  const onSubmit = (data: GoalSchema) => {
    const goal = {
      name: data.name,
      description: data.description,
      category: data.category,
      image: data.image,
    };

    createGoalMutation(goal, {
      onSuccess: () => {
        toast.success("Successfully created your goal.");
        void ctx.goals.getAll.invalidate();
        close();
      },
      onError: ({ data }) => {
        toast.error(
          `Failed to create goal. Application returned: ${
            data ? data.code : ""
          }`
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
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div style={{ margin: "16px 0" }}>
          <div>
            Description <span style={{ color: "#868E96" }}>(optional)</span>
          </div>
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
          />
          {errors.description && <p>{errors.description.message}</p>}
        </div>
        <div style={{ margin: "16px 0" }}>
          <div>
            Category <span style={{ color: "#868E96" }}>(optional)</span>
          </div>
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
          />
          {errors.category && <p>{errors.category.message}</p>}
        </div>
        <div style={{ margin: "16px 0" }}>
          <div>
            Image url <span style={{ color: "#868E96" }}>(optional)</span>
          </div>
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

import * as z from "zod";
import * as React from "react";

import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Card,
  Divider,
  Image,
  Modal,
  Text,
  Badge,
  Button,
  Group,
  Space,
} from "@mantine/core";
//import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDisclosure } from "@mantine/hooks";

//import * as ReactHookForm from "react-hook-form";

import { api } from "~/utils/api";

const { zodResolver } = require("@hookform/resolvers/zod");

const goalSchema = z.object({
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

const editGoalSchema = goalSchema.extend({
  completion: z.string().refine((value) => {
    const num = Number(value);
    return num >= 0 && num <= 100;
  }, "Completion must be a number from 0 to 100"),
});

type GoalSchema = z.infer<typeof goalSchema>;

type GoalSchemaWithCompletion = GoalSchema & { completion: number; id: string };
// https://i.imgur.com/zGaB4zf.png
// https://i.imgur.com/tnuKXQf.png
// https://i.imgur.com/mZ3D5A3.png
// https://i.imgur.com/mZ3D5A3.png

const goal1 = {
  name: "Joy of React",
  description: "by Josh Cameau",
  category: "Education",
  completion: 20,
  image: "https://i.imgur.com/zGaB4zf.png",
};

type Props = {
  close: () => void;
};

type EditProps = Props & { goal: GoalSchemaWithCompletion };

const EditGoalForm = ({ close, goal }: EditProps) => {
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
        toast.error(`Failed to edit goal. Application returned: ${data.code}`);
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

const GoalForm = ({ close }: Props) => {
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
          `Failed to create goal. Application returned: ${data.code}`
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

const goal2 = {
  name: "Total Typescript",
  description: "by Matt Pocock",
  category: "Education",
  image: "https://i.imgur.com/tnuKXQf.png",
};

const goal3 = {
  name: "T3App Tutorial",
  description: "By Theo. Beginner course to T3App",
  category: "Hands-on",
  image: "https://i.imgur.com/mZ3D5A3.png",
};

const goal4 = {
  name: "T3App",
  description: "Create a production ready-app for tracking goals",
  category: "Hands-on",
  image: "https://i.imgur.com/C9QB8oj.png",
};

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  //const all = api.example.getAll.useQuery();

  const goals = api.goals.getAll.useQuery();
  const createGoalMutation = api.goals.addGoal.useMutation();
  const deleteGoalMutation = api.goals.deleteGoal.useMutation();
  const editGoalMutation = api.goals.editGoal.useMutation();

  const [createFormOpened, { open: createFormOpen, close: createFormClose }] =
    useDisclosure(false);

  const [openedGoals, setOpenedGoals] = React.useState<number[]>([]);

  const openGoalModal = (goalId: number) => {
    setOpenedGoals((prevOpenedGoals) => [...prevOpenedGoals, goalId]);
  };

  const closeGoalModal = (goalId: number) => {
    setOpenedGoals((prevOpenedGoals) =>
      prevOpenedGoals.filter((id) => id !== goalId)
    );
  };
  const ctx = api.useContext();
  return (
    <>
      <Head>
        <title>Create T3 App for Mia</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.showcaseContainer}>
            <p className={styles.showcaseText}>
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
          <Modal
            opened={createFormOpened}
            onClose={createFormClose}
            title="Create your goal"
          >
            <GoalForm close={createFormClose} />
          </Modal>

          <h1 className={styles.title}>My Goals</h1>
          <Button
            onClick={createFormOpen}
            variant="light"
            color="blue"
            mt="sm"
            radius="md"
            size="lg"
          >
            + Add goal
          </Button>
          <Group position="center">
            {goals?.data?.map((goal) => (
              <div style={{ minWidth: "400px" }} key={goal.id}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  key={goal.id}
                  style={{ minWidth: "200px" }}
                >
                  <Card.Section>
                    <Image src={goal.image} height={160} alt={goal.name} />
                  </Card.Section>
                  <Group position="apart" mt="md" mb="xs">
                    <Text weight={500}>{goal.name}</Text>
                    <Badge
                      color={goal.completion === 100 ? "green" : "orange"}
                      variant="light"
                    >
                      Progress: {goal.completion} %
                    </Badge>
                  </Group>
                  <Text size="sm" color="dimmed">
                    {goal.description}
                    {goal.description === undefined ||
                      (goal.description === "" && <Space h="lg" />)}
                  </Text>
                  <Modal
                    opened={openedGoals.includes(goal.id)}
                    onClose={() => closeGoalModal(goal.id)}
                    title="Edit goal"
                  >
                    <EditGoalForm
                      close={() => closeGoalModal(goal.id)}
                      goal={goal}
                    />
                  </Modal>
                  <Group position="apart">
                    <Button
                      variant="light"
                      color="blue"
                      mt="sm"
                      radius="md"
                      size="xs"
                      onClick={() => openGoalModal(goal.id)}
                    >
                      ✎ Edit
                    </Button>

                    <Button
                      variant="light"
                      color="green"
                      mt="md"
                      radius="md"
                      size="xs"
                      onClick={() => {
                        editGoalMutation.mutate(
                          {
                            id: goal.id,
                            completion: 100,
                          },
                          {
                            onSuccess: () => {
                              void ctx.goals.getAll.invalidate();
                              toast.success(
                                "Successfully completed your goal."
                              );
                            },
                            onError: () => {
                              toast.error("Failed to complete goal.");
                            },
                          }
                        );
                      }}
                    >
                      ✅ Complete
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      mt="md"
                      radius="md"
                      size="xs"
                      onClick={() => {
                        deleteGoalMutation.mutate(
                          { id: goal.id },
                          {
                            onSuccess: () => {
                              toast.success("Successfully deleted your goal.");
                              void ctx.goals.getAll.invalidate();
                            },
                            onError: () => {
                              toast.error("Failed to delete goal.");
                            },
                          }
                        );
                      }}
                    >
                      🗑️ Delete
                    </Button>
                  </Group>
                </Card>
              </div>
            ))}
          </Group>
          <Group>
            <Button
              variant="light"
              color="green"
              mt="md"
              radius="md"
              size="sm"
              onClick={() => {
                createGoalMutation.mutate(goal1);
              }}
            >
              Add Goal 1
            </Button>
            <Button
              variant="light"
              color="green"
              mt="md"
              radius="md"
              size="sm"
              onClick={() => {
                createGoalMutation.mutate(goal2);
              }}
            >
              Add Goal 2
            </Button>
            <Button
              variant="light"
              color="green"
              mt="md"
              radius="md"
              size="sm"
              onClick={() => {
                createGoalMutation.mutate(goal3);
              }}
            >
              Add Goal 3
            </Button>
            <Button
              variant="light"
              color="green"
              mt="md"
              radius="md"
              size="sm"
              onClick={() => {
                createGoalMutation.mutate(goal4);
              }}
            >
              Add Goal 4
            </Button>
          </Group>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className={styles.authContainer}>
      <p className={styles.showcaseText}>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {sessionData && <span> with user id. {sessionData.user?.id}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className={styles.loginButton}
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

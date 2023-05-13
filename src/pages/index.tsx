import * as z from "zod";

import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

//import * as ReactHookForm from "react-hook-form";

import { api } from "~/utils/api";

const { zodResolver } = require("@hookform/resolvers/zod");

const goalSchema = z.object({
  id: z
    .string({
      required_error: "Id is required",
      invalid_type_error: "Id must be a unique id",
    })
    .min(2),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .nonempty(),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
  category: z.string({
    required_error: "Category is required",
    invalid_type_error: "Category must be a string",
  }),
  image: z
    .string({
      required_error: "Image is required",
      invalid_type_error: "Image must be a valid url",
    })
    .url(),
  /*completion: z.number(),
  isCompleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date(),
  */
});

type GoalSchema = z.infer<typeof goalSchema>;

// https://i.imgur.com/zGaB4zf.png
// https://i.imgur.com/tnuKXQf.png
// https://i.imgur.com/mZ3D5A3.png
// https://i.imgur.com/mZ3D5A3.png

const goal1 = {
  name: "Joy of React",
  id: "1",
  description: "by Josh Cameau",
  category: "Education",
  completion: 0.02,
  isCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  completedAt: new Date(),
  image: "https://i.imgur.com/zGaB4zf.png",
};

const GoalForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    // watch,
    // setError,
  } = useForm<GoalSchema>({
    // reValidateMode: "onBlur",
    // mode: "onBlur",
    // reValidateMode: "onBlur",
    resolver: zodResolver(goalSchema),
  });

  /*const id = watch("id");
  const name = watch("name");
  const description = watch("description");
  const category = watch("category");
  const image = watch("image");*/

  const { mutate: createGoalMutation, isLoading } =
    api.goals.addGoal.useMutation();

  console.log("errors1", errors);

  const onSubmit = (data: GoalSchema) => {
    console.log("Submitting triggered", data);
    console.log("errors2", errors);

    const goal = {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      completion: 0,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: new Date(),
      image: data.image,
    };

    createGoalMutation(goal, {
      onSuccess: () => {
        toast.success("Successfully created your goal.");
      },
      onError: ({ data }) => {
        toast.error(
          `Failed to create goal. Application returned: ${data.code}`
        );
        console.log("dataaaaa from error", data);
        /* setError(
          "id",
          { type: "id", message: "Duplicated id" },
          { shouldFocus: index === 0 }
        );*/
        /*if (data?.formErrors) {
          data.formErrors.forEach((error, index) => {
            setError(
              error.key as keyof Schema,
              { type: error.type, message: error.message },
              { shouldFocus: index === 0 }
            );
          });
        }*/
      },
    });
  };

  return (
    <form
      //THIS FUNCTION IS ONLY CALLED IF VALIDATION IS SUCCESSFULL
      onSubmit={handleSubmit(onSubmit)}
      style={{ color: "black", backgroundColor: "white" }}
      id="goal_form"
    >
      <div>* ID</div>
      <input
        type="text"
        {...register("id")}
        placeholder="id" /* defaultValue="5"*/
      />
      {errors.id && <p>{errors.id.message}</p>}
      <div>* NAME</div>
      <input
        type="text"
        {...register("name")}
        placeholder="Name your goal"
        // defaultValue="Crypt raider"
      />
      {errors.name && <p>{errors.name.message}</p>}
      <div>* DESCRIPTION</div>
      <input
        type="text"
        {...register("description")}
        placeholder="Add details about your goal"
        // defaultValue="XXX"
      />
      {errors.description && <p>{errors.description.message}</p>}
      <div>* CATEGORY</div>
      <input
        type="text"
        {...register("category")}
        placeholder="Group your goal"
        //defaultValue="Education"
      />
      {errors.category && <p>{errors.category.message}</p>}
      <div>* IMAGE URL</div>
      <input
        type="text"
        {...register("image")}
        placeholder="url of image"
        //  defaultValue="https://i.imgur.com/zGaB4zf.png"
      />
      {errors.image && <p>{errors.image.message}</p>}
      <input type="submit" />
    </form>
  );
};

const goal2 = {
  name: "Total Typescript",
  id: "2",
  description: "by Matt Pocock",
  category: "Education",
  completion: 1,
  isCompleted: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  completedAt: new Date(),
  image: "https://i.imgur.com/tnuKXQf.png",
};

const goal3 = {
  name: "T3App Tutorial",
  id: "3",
  description: "By Theo. Beginner course to T3App",
  category: "Hands-on",
  completion: 0,
  isCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  completedAt: new Date(),
  image: "https://i.imgur.com/mZ3D5A3.png",
};

const goal4 = {
  name: "T3App",
  id: "4",
  description: "Create a production ready-app for tracking goals",
  category: "Hands-on",
  completion: 0,
  isCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  completedAt: new Date(),
  image: "https://i.imgur.com/C9QB8oj.png",
};

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const all = api.example.getAll.useQuery();

  const goals = api.goals.getAll.useQuery();

  const createGoalMutation = api.goals.addGoal.useMutation();
  const deleteGoalMutation = api.goals.deleteGoal.useMutation();
  const editGoalMutation = api.goals.editGoal.useMutation();
  return (
    <>
      <Head>
        <title>Create T3 App for Mia</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Yay, finally here! Create{" "}
            <span className={styles.pinkSpan}>T3</span> App
          </h1>
          <div className={styles.cardRow}>
            <Link
              className={styles.card}
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className={styles.cardTitle}>First Steps →</h3>
              <div className={styles.cardText}>
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className={styles.card}
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className={styles.cardTitle}>Documentation →</h3>
              <div className={styles.cardText}>
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <div className={styles.showcaseContainer}>
            <p className={styles.showcaseText}>
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
          <h1 className={styles.title}>My Goals</h1>
          <Group position="center">
            {goals?.data?.map((goal) => (
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                key={goal.id}
              >
                <Card.Section>
                  <Image src={goal.image} height={160} alt={goal.name} />
                </Card.Section>

                <Group position="apart" mt="md" mb="xs">
                  <Text weight={500}>{goal.name}</Text>
                  <Badge
                    color={goal.completion === 1 ? "green" : "orange"}
                    variant="light"
                  >
                    Progress: {goal.completion * 100} %
                  </Badge>
                </Group>

                <Text size="sm" color="dimmed">
                  {goal.description}
                </Text>
                <Group position="apart">
                  <Button
                    variant="light"
                    color="blue"
                    mt="sm"
                    radius="md"
                    size="xs"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="light"
                    color="blue"
                    mt="md"
                    radius="md"
                    size="xs"
                  >
                    Add Progress
                  </Button>
                  <Button
                    variant="light"
                    color="violet"
                    mt="md"
                    radius="md"
                    size="xs"
                  >
                    Complete
                  </Button>
                  <Button
                    variant="light"
                    color="blue"
                    mt="md"
                    radius="md"
                    size="xs"
                  >
                    Delete
                  </Button>
                </Group>
              </Card>
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
              color="red"
              mt="md"
              radius="md"
              size="sm"
              onClick={() => {
                deleteGoalMutation.mutate({ id: "1" });
              }}
            >
              Delete Goal 1
            </Button>
            <Button
              variant="light"
              color="green"
              mt="md"
              radius="md"
              size="sm"
              onClick={() => {
                editGoalMutation.mutate({
                  id: "1",
                  image: "https://i.imgur.com/C9QB8oj.png",
                });
              }}
            >
              Edit Image 1
            </Button>
            <Button
              variant="light"
              color="green"
              mt="md"
              radius="md"
              size="sm"
              onClick={() => {
                editGoalMutation.mutate({
                  id: "1",
                  name: "XXX",
                });
              }}
            >
              Edit Name 1
            </Button>
            <Button
              variant="light"
              color="green"
              mt="md"
              radius="md"
              size="sm"
              onClick={() => {
                editGoalMutation.mutate({
                  id: "1",
                  description: "XXX",
                });
              }}
            >
              Edit Description 1
            </Button>
            <Button
              variant="light"
              color="green"
              mt="md"
              radius="md"
              size="sm"
              onClick={() => {
                editGoalMutation.mutate({
                  id: "1",
                  completion: 0,
                });
              }}
            >
              Edit Completion 1
            </Button>
          </Group>
          <Group>
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
              color="red"
              mt="md"
              radius="md"
              size="sm"
              onClick={() => {
                deleteGoalMutation.mutate({ id: "2" });
              }}
            >
              Delete Goal 2
            </Button>
          </Group>
          <Group>
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
              color="red"
              mt="md"
              radius="md"
              size="sm"
              onClick={() => {
                deleteGoalMutation.mutate({ id: "3" });
              }}
            >
              Delete Goal 3
            </Button>
          </Group>
          <Group>
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
            <Button
              variant="light"
              color="red"
              mt="md"
              radius="md"
              size="sm"
              onClick={() => {
                deleteGoalMutation.mutate({ id: "4" });
              }}
            >
              Delete Goal 4
            </Button>
          </Group>
        </div>
        <GoalForm />
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

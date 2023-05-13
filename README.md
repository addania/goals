## Learn More

Welcome to goals add

Start docker locally with:

- docker-compose up -d

Start dev server with:

- npm run dev

Start prisma studio:

- npx prisma studio

If you need to make some changes to the docker:

- docker-compose up -d
- npx prisma generate
- npm run dev
- npx prisma studio

If you need to make prisma migration:

- npx prisma migrate dev

If you want to see which containers run at which ports:

- docker ps

If you change docker ports, then update firts port indocker-compose.yml and url in schema.prisma

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

**To get started**

- git clone git@github.com:addania/goals.git
- nvm install 16.0.0
- git init (?)
- npm create t3-app@latest
- npx prisma db push
- npm run dev

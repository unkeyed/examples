This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Go to [unkey.dev](https://app.unkey.com) and create a new root key. The onboarding flow will create one for you.
Take the root key and create a `.env.local` file in the root of the project. Add the following line to the file:

```bash
UNKEY_ROOT_KEY=your_root_key_here
```


Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000/simple](http://localhost:3000/simple) with your browser to see the result.

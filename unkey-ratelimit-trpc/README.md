# Unkey ratelimiting with TRPC + Drizzle

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app` and `Unkey ratelimiting`.

## Getting Started

- You will need to make a new root key at [unkey.com](https://app.unkey.com). If you do not already have an account, the onboarding flow will create one for you. Take the root key and create a `.env` file in the root of the project. Add the following line to the file:

```bash
UNKEY_ROOT_KEY=your_root_key_here
```

- Add a new github OAuth app and add the GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET

``` bash
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

## Used in this project

From `T3 Stack`:

- [T3 Stack](https://create.t3.gg/)
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
  
From `Unkey`:

- [Unkey Ratelimiting](https://www.unkey.com/docs/libraries/ts/ratelimit)
  
## Learn More

Learn more about [Unkey services](https://www.unkey.com/docs/introduction)

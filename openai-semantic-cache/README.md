This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Prerequisites 

[x] Have an OpenAI account and OpenAI keys

[x] Have an application with OpenAI implemented

## Overview
1. Log into your Unkey account and navigate to [Semantic Cache](https://app.unkey.com/semantic-cache)

2. Copy your gateway URL at the top of the screen OR navigate to Settings to retrieve your gateway URL.
3. Locate the OpenAI constructor within your application. 

*In this example, it is behind a NextJS route located at `/app/openai/route.ts`. This will allow you to add other Unkey features such as rate limiting on this route (not covered in this example)*

4. Override the default `baseURL` within your initial constructor per [documentation](https://www.unkey.com/docs/semantic-cache/introduction): 

```
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://<gateway>.llm.unkey.io"
  });
```
*In this example, the gateway URL is stored within an environment variable. You can name it anything you want. This helps obscure your gateway URL from the public, and use different gateway URLs per environment if needed.*

```
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.SEMANTIC_CACHE_GATEWAY_URL
});
```

5. Subsequent responses will be cached. You can monitor the cache via the dashboard.

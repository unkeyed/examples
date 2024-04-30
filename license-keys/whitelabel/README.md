<div align="center">
    <h1 align="center">Unkey for license keys</h1>
    <h5>Whitelabel proxy</h5>
</div>

<div align="center">
  <a href="https://go.unkey.com">unkey.com</a>
</div>
<br/>

Some users might not want to use the Unkey domain for their license key management. In this case, you can use a white-label proxy to manage license keys under your own domain.

This example deploys to Vercel and simply passes the key to Unkey's API. You can also use this example to deploy to your own server.



## Benefits
- Runs on your own domain
- No data that you don't pass to Unkey is shared with Unkey. (If the user calls Unkey directly, their IP will be shared with Unkey).
- Add any additional middleware logic if you want.



## Getting Started

1. Create an account on [Unkey](https://unkey.com) and create a new API. 

2. Add the API id to your .env file:

```bash
UNKEY_API_ID="api_..."
```

3. Run the development server:

```bash
pnpm vercel dev
```



## Deploy to Vercel

```bash
pnpm vercel deploy
```

Make sure to add the `UNKEY_API_ID` to your Vercel environment variables.


## Issuing license keys

To issue license keys, you can use the [Unkey](https://app.unkey.com/apis) Dashboard or API.

In the dashboard, click on your API and then on "Create key". You can add an expiration if you want. Then click "Create" and copy the generated key.

You can find the API reference [here](https://www.unkey.com/docs/api-reference/keys/create).
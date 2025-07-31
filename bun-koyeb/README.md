# Global API auth with Unkey and Koyeb

## Overview

[Koyeb](https://www.koyeb.com?ref=unkey) is a developer-friendly serverless platform to deploy apps globally. Koyeb offers a fully managed environment to deploy any apps in seconds without managing any infrastructure. Koyeb supports any programming languages, frameworks, and tools to build your apps.

This example shows how to build an API using Bun, secure it with Unkey, and deploy it globally on Koyeb.

## Requirements

- [Bun](https://bun.sh/) installed
- An [Unkey](https://app.unkey.com) account
- A [Koyeb](https://www.koyeb.com?ref=unkey) account

## Install

```bash
bun install
```

## Develop locally

```bash
bun run dev
```

## Test

```bash
curl -X POST http://localhost:8000 -H "Authorization: Bearer <KEY>"
```

## Deploy on Koyeb

[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?type=git&name=bun-unkey&service_type=web&ports=8000;http;/&env[UNKEY_ROOT_KEY]=&repository=github.com/unkeyed/unkey&branch=main&workdir=examples/bun-koyeb&builder=buildpack)

Replace the `UNKEY_ROOT_KEY` environment variable with your actual root key from your Unkey [dashboard](https://app.unkey.com).

Then hit the `Deploy` button.

Koyeb will deploy your app in your selected regions and provide a unique URL to access it, or you can configure your own custom domain.

Now that your app is deployed, you can test it:

```bash
curl -X POST https://<YOUR_APP_NAME>-<YOUR_KOYEB_ORG>.koyeb.app -H "Authorization: Bearer <UNKEY_API_KEY>"
```

It should return a `200` status code with the Unkey verification response:

```json
{
  "meta": {
    "requestId": "req_123"
  },
  "data": {
    "valid": true,
    "code": "VALID",
    "keyId": "key_123",
    "name": "my-api-key"
  }
}
```

### Manual configuration:

1. In the [Koyeb control panel](https://app.koyeb.com), click **Create Web Service**.
2. Select **GitHub** as the deployment method.
3. Choose your repository and branch.
4. Under **Environment variables**, add your `UNKEY_ROOT_KEY`. You can find this in the [Unkey dashboard](https://app.unkey.com).
5. Click the **Deploy** button.

## References

- [Bun Documentation](https://bun.sh/docs)
- [Koyeb Documentation](https://www.koyeb.com/docs)
- [Unkey Documentation](https://unkey.dev/docs/introduction)

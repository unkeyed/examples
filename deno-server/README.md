# deno server with unkey

A simple deno server with unkey.

## Run

`deno add npm:@unkey/api@latest`

```bash
deno run server.ts
```

## Test

```bash
curl http://localhost:8000 -H "Authorization: Bearer <KEY>"
```

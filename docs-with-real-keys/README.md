
<div align="center">
    <h1 align="center">Showing real keys in your documentation snippets</h1>
    <h5>How you can use Unkey to safely display real production keys for your users.</h5>
</div>

<div align="center">
  <a href="https://unkey.dev">unkey.dev</a>
</div>
<br/>


## Quickstart

### Create a root key

1. Go to [/settings/root-keys](https://app.unkey.com/settings/root-key) and click on the "Create New Root Key" button.
2. Enter a name for the key.
3. Select the following workspace permissions: `create_key`, `read_key`, `encrypt_key` and `decrypt_key`.
4. Click "Create".


### Create your API

1. Go to [https://app.unkey.com/apis](https://app.unkey.com/apis) and click on the "Create New API" button.
2. Give it a name.
3. Click "Create".


### Set up the example

1. Clone the repository
```bash
git clone git@github.com:unkeyed/examples.git
cd examples/docs-with-real-keys
```

2. Install the dependencies
```bash
pnpm install
```

3. Create a `.env` file and add the following:
```env
UNKEY_ROOT_KEY=your-root-key
UNKEY_API_ID=your-api-id
```

4. Start the server
```bash
pnpm dev
```

5. Open your browser and go to [http://localhost:3000](http://localhost:3000)


<div align="center">
    <h1 align="center">Express with middleware permissions</h1>
    <h5>Protecting your routes</h5>
</div>

<div align="center">
  <a href="https://unkey.dev">unkey.dev</a>
</div>
<br/>


## Quickstart

### Create a permission and role

1. Go to [app/authorization/permissions](https://unkey.dev/app/authorization/permissions) and click on the "Create New Permission" button.
2. Enter `call-protected-route` as the name and add a description if you want.
3. Click "Create New Permission"
4. Now head over to [/app/authorization/roles](https://unkey.dev/app/authorization/roles) and click on the "Create New Role" button.
5. Enter a name for the role, for example, `admin` and select the permission from the prevous step
6. Click "Create".


### Create your API

1. Go to [https://unkey.dev/app/apis](https://unkey.dev/app/apis) and click on the "Create New API" button.
2. Give it a name.
3. Click "Create".


### Create your first key

1. Click "Create Key" in the top right corner.
2. Click "Create"
3. Copy the key and save it somewhere safe.


### Connect the key to the role

1. Go to [/app/apis](https://unkey.dev/app/apis) and click on the API you created.
2. Click on "Keys" in the tabs.
3. Click on the key you created.
4. Click on "Permissions" in the tabs.
5. Check the role's checkbox to give the key the role and permission.



### Set up the example

1. Clone the repository
```bash
  git clone git@github.com:unkeyed/examples.git
  cd examples/express-with-middleware-permissions
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

5. curl the unprotected route
```bash
  curl http://localhost:3000/public
```
It should return `Hello world!`

6. curl the protected route
```bash
  curl http://localhost:3000/protected -H "Authorization: Bearer <YOUR_KEY>"
```

It should return `Hello protected world!`
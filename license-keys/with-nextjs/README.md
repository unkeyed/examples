<div align="center">
    <h1 align="center">Unkey for license keys</h1>
    <h5>Licensing parts of your apps for selfhosting</h5>
</div>

<div align="center">
  <a href="https://go.unkey.com">unkey.com</a>
</div>
<br/>


This is an example of protecting parts of your Next.js application with license keys.

The idea is to offer your app as a self-hosted solution, where users can download the app and run it on their own servers. To access the app or parts of it, users need to buy a license from you.

In this example. we have a simple Next.js app with a single page (`/ee`) that requires a valid license key to access. The license key is stored in a .env file and is checked at runtime using Next.js middleware.

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

Open [http://localhost:3000/ee](http://localhost:3000/ee) with your browser to see a page blocking access to users without a valid license key.

Add the following license key to your .env file:

```bash
LICENSE_KEY="3ZHPofatirM4egrh51EEwcTe"
```

Now restart your development server and try to access the page again. You should now see the content of the page.



## License key management

To manage license keys, you can use the [Unkey](https://unkey.com) Dashboard or API and optionally add a white-label proxy in between, like in this example. (See [white label](../whitelabel) for more information.) 


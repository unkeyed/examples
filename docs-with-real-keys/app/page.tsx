import { Unkey } from "@unkey/api";
import { CopyButton } from "@/components/copy-button";
import { cookies } from "next/headers";
import { UserAuthForm } from "./signup";
import Link from "next/link";
import { Suspense } from "react";
import { User } from "lucide-react";

export default async function Home() {
  const userId = cookies().get("fakeUserId")?.value;

  return (
    <div className="container relative min-h-screen flex-col items-center justify-between flex lg:flex-row lg:max-w-none  lg:px-0">
      <div className="absolute flex items-center right-4 top-4 md:right-8 md:top-8 gap-2">
        <User className="size-4" /> {userId}
      </div>
      <div className="relative h-full flex-col flex p-10 text-black justify-between bg-white dark:border-r w-full lg:w-2/5 lg:min-h-screen">
        <Link
          href="https://unkey.com"
          target="_blank"
          className="relative z-20 flex items-center text-lg font-medium"
        >
          Unkey.com
        </Link>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Provide the best experience to your users, allowing them to try
              your API by simply copying code snippets without having to dig
              through your dashboard to find an API key.
            </p>
            <footer className="text-sm">
              {" "}
              Unkey allows you to recover keys securely, without having to worry
              about how to store anything in your database.
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 w-full lg:w-3/5 bg-zinc-50 border-l min-h-screen flex flex-col justify-center p-4">
        {userId ? (
          <div className="mx-auto flex w-full flex-col justify-center items-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Call our API
              </h1>
              <p className="text-sm text-muted-foreground">
                Copy the snippet below and paste it into your terminal
              </p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <Docs keyId={userId} />
            </Suspense>
          </div>
        ) : (
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
              <p className="text-sm text-muted-foreground">
                This auth step is entirely fake and just serves to assign a
                random user ID to you
              </p>
            </div>
            <UserAuthForm />
          </div>
        )}
      </div>
    </div>
  );
}

const Docs: React.FC<{ keyId: string }> = async (props) => {
  const rootKey = process.env.UNKEY_ROOT_KEY;
  if (!rootKey) {
    console.error("UNKEY_ROOT_KEY is not defined");
    return <div>Server configuration error</div>;
  }

  const unkey = new Unkey({ rootKey });

  try {
    console.log({ keyId: props.keyId });
    const response = await unkey.keys.getKey({
      keyId: props.keyId,
    });
    console.log(response);

    if (!response.data) {
      return <div>No key found</div>;
    }

    const key = response.data.plaintext;
    const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000";

    const snippet = `curl -X POST '${baseUrl}/api/v1/fake-api' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer ${key}' \\
  -d '{
    "hello": "world"
  }'`;

    return (
      <div className="flex items-start bg-white justify-between gap-x-4 border rounded-md shadow-sm p-4 font-mono overflow-x-scroll">
        <pre className="text-xs md:text-sm">{snippet}</pre>
        <CopyButton value={snippet} />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch key:", error);
    return <div>Error loading key</div>;
  }
};

"use client";

import { notFound, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "@/components/ui/toaster"
import { CheckCircle, Fingerprint, Loader2, PartyPopper, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

function CodeCharacter({ char }: { char: string }) {
  return <div className="p-2 lg:p-4 font-mono text-xl lg:text-4xl rounded bg-primary text-primary-foreground">{char}</div>;
}

function Cancelled() {
  return (
    <div className="w-full min-h-screen flex items-center pt-[250px] px-4 flex-col">
      <div className="flex pt-10">
        <div className="flex justify-center items-center pr-10">
          <XCircle className="text-primary" />
        </div>
        <div className="flex-col">
          <h1 className="text-lg text-primary">Login cancelled</h1>
          <p className="text-sm text-muted">You can return to your CLI.</p>
        </div>
      </div>
    </div>
  );
}

function Success() {
  return (
    <div className="w-full min-h-screen flex items-center pt-[250px] px-4 flex-col">
      <div className="flex pt-10">
        <div className="flex justify-center items-center pr-10">
          <PartyPopper className="text-primary" />
        </div>
        <div className="flex-col">
          <h1 className="text-lg text-primary">Login successful!</h1>
          <p className="text-sm text-muted">You can return to your CLI.</p>
        </div>
      </div>
    </div>
  );
}

export default function Page() {

  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [success, setSuccess] = useState(false);

  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect");

  async function verify(opts: {
    code: string | null;
    redirect: string | null;
  }) {
    setLoading(true);
    try {
      const req = await fetch("/api/unkey", {
        method: "POST",
        body: JSON.stringify(opts),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!req.ok) {
        throw new Error(`HTTP error! status: ${req.status}`);
      }

      const res = await req.json();

      try {
        const redirectUrl = new URL(res.redirect);
        redirectUrl.searchParams.append("code", res.code);
        redirectUrl.searchParams.append("key", res.key);

        await fetch(redirectUrl.toString());

        setLoading(false);
        setSuccess(true);
      } catch (error) {
        console.error(error);
        setLoading(false);
        toast.error("Error redirecting back to local CLI. Is your CLI running?", {
          description: (error as Error).message
        });
      }
    } catch (_error) {
      setLoading(false);
      toast.error("Error creating Unkey API key.");
    }
  }

  async function cancel() {
    try {
      setLoading(true);
      const redirectUrl = new URL(redirect as string);
      redirectUrl.searchParams.append("cancelled", "true");
      await fetch(redirectUrl.toString());
      setLoading(false);
      setCancelled(true);
    } catch (_error) {
      setLoading(false);
      toast.error("Error cancelling login. Is your local CLI running?");
    }
  }

  const { user } = useUser();

  if (!code || !redirect) {
    return (<div className="flex items-center justify-center w-screen h-screen">
      <div><Alert>
        <AlertTitle>Invalid request</AlertTitle>
        <AlertDescription>
          This page was accessed without a valid <Badge variant="outline">code</Badge> or <Badge variant="outline">redirect</Badge> query parameter.
        </AlertDescription>
      </Alert></div>
    </div>)
  }

  const opts = { code, redirect: redirect, id: user?.id };

  if (cancelled) {
    return <Cancelled />;
  }

  if (success) {
    return <Success />;
  }

  return (
    <div className="w-full min-h-screen flex items-center pt-[250px] px-4 flex-col">
      <div className="flex flex-col">
        <div className="flex ">
          <div className="flex justify-center items-center pr-4">
            <Fingerprint className="text-gray-900" />
          </div>
          <div className="flex-col">
            <h1 className="text-lg text-gray-900">Device confirmation</h1>
            <p className="text-sm text-primary/50">
              Please confirm this is the code shown in your terminal
            </p>
          </div>
        </div>
        <div>
          <div className="grid grid-flow-col gap-1 pt-6 leading-none lg:gap-3 auto-cols-auto">
            {code?.split("").map((char, i) => (
              <CodeCharacter char={char} key={`${char}-${i}`} />
            ))}
          </div>
          <div className="flex justify-center pt-6">
            <div className="flex items-center">
              <Button
                variant="default"
                className="mr-2"
                onClick={() => verify(opts)}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Confirm code
              </Button>
              <Button variant="outline" onClick={() => cancel()}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

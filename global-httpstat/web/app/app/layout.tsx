import * as React from "react"
import {
  Activity,
  AlertCircle,
  Archive,
  ArchiveX,
  BookKey,
  ExternalLink,
  File,
  Inbox,
  MessagesSquare,
  PenBox,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react"

import { AccountSwitcher } from "@/components/account-switcher"
import { Nav } from "@/components/nav"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SignIn, auth } from "@clerk/nextjs"
import { Redis } from "@upstash/redis"
import ms from "ms"
import { Unkey } from "@unkey/api"


const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY! })
export default async function Layout({ children }: { children: React.ReactNode }) {
  console.log("app.layout.tsx")
  const { userId } = auth()
  if (!userId) {
    return <div className="flex items-center justify-center w-screen h-screen">
      <SignIn />
    </div>
  }

  const redis = Redis.fromEnv()
  
  // TEMPORARY: Use test user ID to verify Redis functionality
  const testUserId = "user_test_123"
  const actualUserId = userId
  
  let checks: { checkId: string, time: number }[] = []
  try {
    const rawResponse = await redis.zrange<unknown[]>(`user:${testUserId}:checks`, 0, -1, { withScores: true, })
    
    for (let i = 0; i < rawResponse.length; i += 2) {
      checks.push({ checkId: rawResponse[i] as string, time: rawResponse[i + 1] as number, })
    }
    checks = checks.sort((a, b) => b.time - a.time)

  } catch (error) {
    console.error("Redis error:", error)
    return <div>Error connecting to Redis: {error instanceof Error ? error.message : 'Unknown error'}</div>
  }

  const keys = await unkey.apis.listKeys({
    apiId: process.env.UNKEY_API_ID!,
    externalId: userId,
  })



  return (
    <div>
      <div>
        <div className="h-14 w-full flex" >
          <div className="w-64 flex items-center justify-center h-[52px] px-2">
            <AccountSwitcher />
          </div>
          <Separator orientation="vertical" />

        </div>
        <Separator />
      </div>
      <div className="flex">
        <aside className="w-64 flex-shrink-0">

          <Nav
            links={[
              {
                title: "Unkey",
                icon: ExternalLink,
                variant: "ghost",
                href: "https://unkey.dev",
                external: true
              },
              {
                title: "API Keys",
                label: keys.data?.length.toString() ?? undefined,
                icon: BookKey,
                variant: "ghost",
                href: "/app/keys"
              },

            ]}
          />
          <Separator />
          <Nav
            links={checks.map(c => ({
              title: c.checkId,
              label: `${ms(Date.now() - c.time)} ago`,
              icon: Activity,
              variant: "ghost",
              href: `/app/${c.checkId}`,
            }))}
          />
        </aside>

        <Separator orientation="vertical" className="h-screen -mt-14" />

        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  )
}

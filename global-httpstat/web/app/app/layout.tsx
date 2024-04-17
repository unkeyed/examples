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

  const checks = await redis.zrange<unknown[]>(`user:${userId}:checks`, 0, -1, { withScores: true, }).then(res => {
    const tmp: { checkId: string, time: number }[] = []
    for (let i = 0; i < res.length; i += 2) {
      tmp.push({ checkId: res[i] as string, time: res[i + 1] as number, })
    }
    return tmp
  }).then(res => res.sort((a, b) => b.time - a.time))
  console.log("checkIds", checks)


  const keys = await unkey.apis.listKeys({
    apiId: process.env.UNKEY_API_ID!,
    ownerId: userId,
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
                label: keys.result?.total.toString() ?? undefined,
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

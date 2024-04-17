import * as React from "react"
import {
  AlertCircle,
  Archive,
  ArchiveX,
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

export default async function Page() {
  console.log("app/page.tsx")

  return (
    <div>
      Hello
    </div>
  )
}

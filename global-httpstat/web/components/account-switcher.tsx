"use client"

import * as React from "react"

import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { useUser, useAuth } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ChevronsUpDown, LogOut } from "lucide-react"


export const AccountSwitcher: React.FC = () => {

  const { user } = useUser()
  const { signOut } = useAuth()
  if (!user) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full h-12">




        <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
          <div className="flex items-center gap-2 justify-start">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.username ?? user?.fullName ?? "Profile picture"}
              />

              <AvatarFallback>
                {(user?.username ?? user?.fullName ?? "")
                  .slice(0, 2)
                  .toUpperCase() ?? "P"}
              </AvatarFallback>
            </Avatar>

            <span>
              {
                user?.username ?? user?.emailAddresses.at(0)?.emailAddress ?? user?.fullName
              }
            </span>
          </div>
          <ChevronsUpDown className="hidden h-3 w-3 shrink-0 md:block" />
        </div>

      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu >
  )
}

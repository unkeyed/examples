import Link from "next/link";
import * as React from "react";

import { clearChats } from "@/app/actions";
import { ClearHistory } from "@/components/clear-history";
import { Sidebar } from "@/components/sidebar";
import { SidebarFooter } from "@/components/sidebar-footer";
import { SidebarList } from "@/components/sidebar-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	IconGitHub,
	IconNextChat,
	IconSeparator,
	IconUnkey,
	IconVercel,
} from "@/components/ui/icons";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";

async function UserOrLogin() {
	return (
		<>
			<Link href="/" target="_blank" rel="nofollow">
				<IconUnkey className="w-20 h-20 mr-2 " inverted />
				{/* <IconNextChat className="w-6 h-6 mr-2 dark:hidden" inverted /> */}
				{/* <IconNextChat className="hidden w-6 h-6 mr-2 dark:block" /> */}
			</Link>
		</>
	);
}

export function Header() {
	return (
		<header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
			<div className="flex items-center">
				<React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
					<UserOrLogin />
				</React.Suspense>
			</div>
			<div className="flex items-center justify-end space-x-2">
				<a
					target="_blank"
					href="https://github.com/unkeyed/examples/tree/main/ai-chatbot"
					rel="noopener noreferrer"
					className={cn(buttonVariants({ variant: "outline" }))}
				>
					<IconGitHub />
					<span className="hidden ml-2 md:flex">GitHub</span>
				</a>
			</div>
		</header>
	);
}

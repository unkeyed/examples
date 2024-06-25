import Link from "next/link";
import * as React from "react";

import { ClearHistory } from "@/components/clear-history";
import { Sidebar } from "@/components/sidebar";
import { SidebarFooter } from "@/components/sidebar-footer";
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

export function Header() {
	return (
		<header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
			<div className="flex items-center justify-end space-x-2">
				<a
					target="_blank"
					href="https://github.com/vercel/nextjs-ai-chatbot/"
					rel="noopener noreferrer"
					className={cn(buttonVariants({ variant: "outline" }))}
				>
					<IconGitHub />
					<span className="hidden ml-2 md:flex">GitHub</span>
				</a>
				<a
					href="https://github.com/vercel/nextjs-ai-chatbot/"
					target="_blank"
					className={cn(buttonVariants())}
					rel="noreferrer"
				>
					<IconVercel className="mr-2" />
					<span className="hidden sm:block">Deploy to Vercel</span>
					<span className="sm:hidden">Deploy</span>
				</a>
			</div>
		</header>
	);
}

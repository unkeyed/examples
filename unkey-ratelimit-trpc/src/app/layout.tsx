import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { Header } from "./components/header";
import { Categories } from "./components/categories";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "Unkey ratelimiting with TRPC + Drizzle",
	description: "Example app using Nextjs, Drizzle, Unkey, trpc and openapi",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${GeistSans.variable}`}>
			<TRPCReactProvider>
				<body className="max-w-[2160px] mx-auto h-screen ">
					<Header />
					<div className="w-full flex flex-row bg-slate-200 h-full">
						<Categories />
						{children} <Toaster />
					</div>
				</body>
			</TRPCReactProvider>
		</html>
	);
}

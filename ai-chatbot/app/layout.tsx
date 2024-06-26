import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "react-hot-toast";

import "@/app/globals.css";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { cn } from "@/lib/utils";

export const metadata = {
	metadataBase: new URL(`https://${process.env.VERCEL_URL}`),
	title: {
		default: "Unkey semantic caching chatbot",
	},
	description: "AI chatbot with built-in semantic caching",
	openGraph: {
		title: "Unkey semantic caching chatbot",
		description: "AI chatbot with built-in semantic caching",
		images: [
			{
				url: "/og.png",
				width: 1200,
				height: 675,
			},
		],
	},
	twitter: {
		title: "Unkey semantic caching chatbot",
		card: "summary_large_image",
	},
};

export const viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"font-sans antialiased",
					GeistSans.variable,
					GeistMono.variable,
				)}
			>
				<Toaster />
				<Providers attribute="class" defaultTheme="system" enableSystem>
					<div className="flex flex-col min-h-screen">
						<Header />
						<main className="flex flex-col flex-1 bg-muted/50">{children}</main>
					</div>
					<TailwindIndicator />
				</Providers>
			</body>
		</html>
	);
}

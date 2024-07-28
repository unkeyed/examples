import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans"; // import font
import "./globals.css";

export const metadata: Metadata = {
  title: "Docs snippets with Unkey ",
  description: "Make snippets great again",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // add font to className, also add antialiased and dark mode
    <html
      lang="en"
      className={`${GeistSans.className} min-h-screen bg-background font-sans antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}

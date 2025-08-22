import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "GameHub - Premium Online Gaming Platform",
  description:
    "Experience the ultimate online gaming platform with hundreds of premium games, live dealers, and massive jackpots.",
  keywords: ["online gaming", "casino games", "slots", "live dealer", "jackpots", "gaming platform"],
  authors: [{ name: "GameHub" }],
  creator: "GameHub",
  publisher: "GameHub",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourgamingsite.com",
    siteName: "GameHub",
    title: "GameHub - Premium Online Gaming Platform",
    description:
      "Experience the ultimate online gaming platform with hundreds of premium games and massive jackpots.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameHub - Premium Online Gaming Platform",
    description:
      "Experience the ultimate online gaming platform with hundreds of premium games and massive jackpots.",
    creator: "@gamehub",
  },
  metadataBase: new URL("https://yourgamingsite.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="gaming">
      <head>
        <link rel="canonical" href="https://yourgamingsite.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} antialiased bg-gaming-gradient`}>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}

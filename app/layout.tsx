import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import { Analytics } from "@vercel/analytics/react"

import "@radix-ui/themes/styles.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Bailout",
  description: "Your Ultimate Escape Plan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={poppins.className}>
        <Theme accentColor="iris" appearance="dark" radius="full">
          {children}
          <Analytics />
        </Theme>
      </body>
    </html>
  );
}

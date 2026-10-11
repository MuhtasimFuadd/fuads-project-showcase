import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const SITE_NAME = "Fuad's Project Showcase";

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description:
    "A living collection of personal projects — apps, games, experiments and ideas — with the stories behind them."
};

export const viewport: Viewport = { themeColor: "#0A0C10" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink font-body text-paper antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

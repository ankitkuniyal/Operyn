import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Operyn",
  description: "Operyn is an autonomous AI Executive Assistant that manages workspace workflows—scanning Gmail, organizing tasks, drafting context-aware email replies, and scheduling calendar events in the background.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", fontSans.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          appearance={{
            theme: shadcn,
            variables: {
              colorBackground: "oklch(0.11 0.01 15)",
            },
            elements: {
              card: "bg-background/90 shadow-2xl border-white/10",
              userButtonPopoverCard:
                "bg-background/90 shadow-2xl border-white/10",
            },
          }}
        >
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}

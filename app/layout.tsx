import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Image from "next/image";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Operyn",
  description: "An Autonomous AI Executive Assistant",
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
          <footer className="border-t border-border/50 bg-background/40 backdrop-blur-md mt-auto">
            <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-auto h-8" />
                <span className="text-xl font-bold tracking-tight">Operyn</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Operyn. All rights reserved.
              </p>
              <nav className="flex gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
              </nav>
            </div>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}

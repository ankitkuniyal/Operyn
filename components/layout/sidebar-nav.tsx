"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HomeIcon, MailIcon, SettingsIcon } from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    label: "Monitoring",
    href: "/monitoring",
    icon: MailIcon,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1.5">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.href}
            variant="ghost"
            className={`justify-start gap-3 w-full transition-all duration-300 rounded-xl px-4 py-3 h-auto group relative overflow-hidden ${
              isActive
                ? "bg-primary/10 text-primary border-l-2 border-primary"
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
            asChild
          >
            <Link href={item.href}>
              <item.icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-primary" : ""}`} />
              <span className="text-sm font-semibold">{item.label}</span>
              {isActive && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-5 left-5 right-5 z-50 flex items-center justify-around py-3.5 px-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              isActive 
                ? "text-primary scale-105" 
                : "text-muted-foreground hover:text-white"
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? "bg-primary/10" : ""}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold tracking-wide uppercase">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

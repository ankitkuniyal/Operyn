import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ShieldCheck, Shield, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SidebarNav, MobileNav } from "@/components/layout/sidebar-nav";
import { getUserByClerkId } from "@/db/queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await auth();
  const { has, userId: clerkId } = authData;
  const user = clerkId ? await getUserByClerkId(clerkId) : null;
  
  const isPremiumUser = has({ plan: "premium" });

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-white/10 bg-card/15 backdrop-blur-xl p-5 justify-between h-full shrink-0">
        <div className="flex flex-col gap-8">
          {/* Logo & Branding */}
          <div className="flex items-center px-1">
            <Link href="/" className="flex items-center gap-3 group">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={32} 
                height={32} 
                className="w-auto h-8 group-hover:scale-105 transition-transform" 
              />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Operyn
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <SidebarNav />
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-5">
          {!isPremiumUser && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-primary/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  Upgrade Plan
                </span>
                <span className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                  Unlock continuous autonomous background sweeps and scheduling.
                </span>
              </div>
              <Button size="sm" className="w-full bg-primary hover:bg-primary/95 text-white font-semibold text-xs rounded-xl shadow-lg shadow-primary/10 cursor-pointer" asChild>
                <Link href="/#pricing">Activate Premium</Link>
              </Button>
            </div>
          )}

          {/* User Profile Card */}
          <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
            <div className="flex items-center gap-3 px-1">
              <UserButton />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">
                  {user?.name || "User Profile"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user?.email || ""}
                </span>
              </div>
            </div>
            
            {isPremiumUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold justify-center">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span>PREMIUM SUBSCRIBER</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground text-[10px] font-bold justify-center">
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span>FREE VISITOR</span>
              </div>  
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between px-6 py-4 border-b border-white/10 bg-card/20 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Logo" width={28} height={28} className="w-auto h-7" />
            <span className="text-lg font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Operyn
            </span>
          </Link>
          <UserButton />
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-28 md:pb-8 relative">
          <div className="absolute top-[5%] right-[10%] h-[300px] w-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </main>

        {/* Mobile Floating Bottom Bar */}
        <MobileNav />
      </div>
    </div>
  );
}

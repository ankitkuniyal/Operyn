import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { HomeIcon, MailIcon, SettingsIcon, ShieldCheck, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await auth();
  const { userId, has } = authData;
  const user = await currentUser();
  
  const isPremiumUser = has({ plan: "premium" });

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon
    },
    {
      label: "Monitoring",
      href: "/monitoring",
      icon: MailIcon
    },
    {
      label: "Settings",
      href: "/settings",
      icon: SettingsIcon
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-white/10 bg-card/20 backdrop-blur-xl p-4 justify-between h-full">
        <div className="flex flex-col gap-6">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2 px-2  py-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-auto h-8" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Operyn
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="justify-start gap-3 w-full hover:bg-white/5 hover:text-primary transition-all duration-200"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4">
          {!isPremiumUser && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">Upgrade to Premium</span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Unlock advanced AI executive capabilities and integrations.
                </span>
              </div>
              <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white font-medium" asChild>
                <Link href="/#pricing">Upgrade Plan</Link>
              </Button>
            </div>
          )}

          {/* User Card at the bottom */}
          <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <UserButton />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold truncate max-w-[120px]">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {user?.emailAddresses[0]?.emailAddress}
                  </span>
                </div>
              </div>
            </div>
            {isPremiumUser?(
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold justify-center">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span>Premium User</span>
              </div>
            ):(
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground text-xs font-semibold justify-center">
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span>Free Plan</span>
              </div>  
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header (Top) */}
        <header className="flex md:hidden items-center justify-between px-6 py-4 border-b border-white/10 bg-card/20 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={28} height={28} className="w-auto h-7" />
            <span className="text-lg font-bold">Operyn</span>
          </Link>
          <UserButton />
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 md:pb-10">
          {children}
        </main>

        {/* Mobile Bottom Navigation (Floating tab bar) */}
        <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex items-center justify-around py-3 px-6 rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl shadow-2xl">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}


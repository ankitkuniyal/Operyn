import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, Show, UserButton, PricingTable } from '@clerk/nextjs';
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="landing-header p-4">
      <header className="flex gap-4 items-center justify-between m-2">
        <div className="logo-container">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Operyn</span>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-4">
          <Show when="signed-out">
          <SignInButton>
            <Button variant="outline">Sign In</Button>
          </SignInButton>
          <SignUpButton>
            <Button>Sign Up</Button>
          </SignUpButton> 
        </Show>
        <Show when="signed-in">
          <div className="">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
          <UserButton />
        </Show>
        </div>
      </header>
      <section id="pricing" className="flex flex-col items-center justify-center py-24 px-4 gap-12 w-full">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, Transparent & <span className="text-primary">Affordable</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Scale your executive assistant capabilities as you grow.
          </p>
        </div>
        
        <div className="w-full max-w-5xl mx-auto">
          <PricingTable />
        </div>
      </section>
    </div>
  );
}

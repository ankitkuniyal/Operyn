import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden">
      {/* Ambient black-to-red radial gradient theme backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-zinc-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[10%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-4 flex justify-center">
        <SignUp />
      </div>
    </div>
  );
}

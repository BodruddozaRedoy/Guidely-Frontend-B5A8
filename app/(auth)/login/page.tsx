/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(auth)/login/page.tsx  (or wherever your Login component file is)
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import GoogleSignInButton from "@/components/module/auth/GoogleSignInButton";

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || data?.error || "Invalid email or password.");
        return;
      }

      if (data?.token) localStorage.setItem("token", data.token);
      if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Welcome back!");
      router.push(callbackUrl);
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left / right split similar to your previous layout */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Guidely</span>
          </Link>

          <h1 className="font-display font-bold text-3xl mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Sign in to continue your adventure.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="hello@example.com" className="pl-10 h-12" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 h-12" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>{isLoading ? "Signing in..." : "Sign In"}</Button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <span>or continue with</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <GoogleSignInButton callbackUrl={callbackUrl} text="Sign in with Google" className="w-full" />
            </div>

            <p className="text-center mt-8 text-muted-foreground">Don&apos;t have an account? <Link href="/register" className="text-primary font-medium hover:underline">Sign up</Link></p>
          </form>
        </div>
      </div>

      <div className="hidden lg:block flex-1 relative">
        <Image src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200" alt="Travel" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-br from-primary/80 to-secondary/80" />
      </div>
    </div>
  );
};

export default Login;

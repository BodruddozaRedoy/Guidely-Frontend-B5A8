/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Mail, Lock, User, Eye, EyeOff, Compass, Map } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { UserRole } from "@/types/index.type";

const Register = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRole = (searchParams.get("role") as UserRole) || "TOURIST";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------
  // SUBMIT HANDLER (NextAuth)
  // ---------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Register user via API
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // After successful registration, sign in the user
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Account created but sign-in failed. Please try logging in.");
        router.push("/login");
        return;
      }

      toast.success(`Welcome to Guidely! Your ${role} account is ready.`);

      router.push(role === "GUIDE" ? "/dashboard" : "/");
      router.refresh();
    } catch (error: any) {
      const message =
        error?.message || "Registration failed. Please try again.";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block flex-1 relative">
        <Image
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200"
          alt="Adventure"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 to-primary/80" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-primary-foreground max-w-md">
            <h2 className="font-display font-bold text-4xl mb-4">
              Start your journey today
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Whether you&apos;re exploring or guiding, amazing experiences await you.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Guidely</span>
          </Link>

          <h1 className="font-display font-bold text-3xl mb-2">Create account</h1>
          <p className="text-muted-foreground mb-8">
            Join our community of travelers and guides.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label>I want to</Label>

              <RadioGroup
                value={role}
                onValueChange={(v) => setRole(v as UserRole)}
                className="grid grid-cols-2 gap-4"
              >
                {/* Tourist Option */}
                <Label
                  htmlFor="TOURIST"
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    role === "TOURIST"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="TOURIST" id="TOURIST" className="sr-only" />
                  <Compass
                    className={`w-8 h-8 ${
                      role === "TOURIST" ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <div className="text-center">
                    <p className="font-medium">Explore</p>
                    <p className="text-xs text-muted-foreground">
                      Find amazing tours
                    </p>
                  </div>
                </Label>

                {/* Guide Option */}
                <Label
                  htmlFor="GUIDE"
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    role === "GUIDE"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="GUIDE" id="GUIDE" className="sr-only" />
                  <Map
                    className={`w-8 h-8 ${
                      role === "GUIDE" ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <div className="text-center">
                    <p className="font-medium">Guide</p>
                    <p className="text-xs text-muted-foreground">
                      Share your city
                    </p>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 h-12"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  className="pl-10 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>

          <p className="text-center mt-8 text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

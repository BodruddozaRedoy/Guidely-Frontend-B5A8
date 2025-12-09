/* eslint-disable @typescript-eslint/no-explicit-any */
// components/module/auth/GoogleSignInButton.tsx
'use client';

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WholeWord } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

declare global {
  interface Window { google: any; }
}

interface Props {
  callbackUrl?: string;
  text?: string;
  className?: string;
}

export default function GoogleSignInButton({
  callbackUrl = "/",
  text = "Sign in with Google",
  className = ""
}: Props) {
  const router = useRouter();

  useEffect(() => {
    // ensure google accounts lib is available
    if (!window || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        try {
          const id_token = response?.credential;
          console.log("[GSI] full response:", response);
          console.log("[GSI] id_token length:", id_token?.length);
          console.log("[GSI] id_token preview:", id_token?.slice?.(0, 60));

          if (!id_token) {
            toast.error("Google sign-in failed (no token received)");
            return;
          }

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_token }),
          });

          const data = await res.json();
          console.log("[CLIENT] /api/auth/google response:", data, "status:", res.status);

          if (!res.ok) {
            toast.error(data?.message || data?.error || "Google sign-in failed");
            return;
          }

          // store token & user in localStorage
          if (data?.token) localStorage.setItem("token", data.token);
          if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

          toast.success("Signed in with Google");
          router.push(callbackUrl);
        } catch (err) {
          console.error("[CLIENT] Google sign-in error:", err);
          toast.error("Google sign-in failed. Check console.");
        }
      },
    });

    const el = document.getElementById("g_id_signin");
    if (el) {
      window.google.accounts.id.renderButton(el, { theme: "outline", size: "large", width: "100%" });
    }
  }, [router, callbackUrl]);

  return (
    <div id="g_id_signin" className={className} style={{ width: "100%" }}>
      <noscript>
        <Button variant="outline" className={`flex items-center gap-2 ${className}`} onClick={() => window.open('https://accounts.google.com/', '_blank')}>
          <WholeWord/> {text}
        </Button>
      </noscript>
    </div>
  );
}

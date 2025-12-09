/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WholeWord } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // <-- IMPORTANT

declare global {
  interface Window {
    google: any;
  }
}

interface Props {
  callbackUrl?: string;
  text?: string;
  className?: string;
}

export default function GoogleSignInButton({
  callbackUrl = "/",
  text = "Sign in with Google",
  className = "",
}: Props) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth(); // <-- Use AuthContext

  useEffect(() => {
    if (!window || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        try {
          const id_token = response?.credential;

          if (!id_token) {
            toast.error("Google login failed — no token received.");
            return;
          }

          // Debug (optional)
          console.log("[GSI] token:", id_token.slice(0, 50));

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_token }),
            }
          );

          const data = await res.json();
          console.log("[CLIENT] /google response →", data);

          if (!res.ok) {
            toast.error(data?.message || "Google sign-in failed.");
            return;
          }

          const token = data?.data?.token;
          const user = data?.data?.user;

          if (!token || !user) {
            toast.error("Invalid Google response.");
            return;
          }

          // ⬇️ Use AuthContext instead of manually writing localStorage
          loginWithGoogle(user, token);

          toast.success("Signed in with Google!");
          router.push(callbackUrl);
        } catch (err) {
          console.error("Google login error:", err);
          toast.error("Google login failed. Check console.");
        }
      },
    });

    const button = document.getElementById("g_id_signin_btn");
    if (button) {
      window.google.accounts.id.renderButton(button, {
        theme: "outline",
        size: "large",
        width: "100%",
      });
    }
  }, [router, callbackUrl, loginWithGoogle]);

  return (
    <div className={className} style={{ width: "100%" }}>
      <div id="g_id_signin_btn"></div>
    </div>
  );
}

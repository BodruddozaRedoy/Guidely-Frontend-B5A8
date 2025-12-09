"use client";

import { useAuth } from "./AuthContext";
import FullPageLoader from "@/components/common/FullPageLoader";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { authLoading } = useAuth();

  if (authLoading) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}

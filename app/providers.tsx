"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  // NOW we can use useState because this file is a CLIENT component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>

      <Toaster richColors closeButton />
    </QueryClientProvider>
  );
}

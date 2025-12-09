"use client";

import { User, UserRole } from "@/types/index.type";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  startTransition,
} from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  authLoading: boolean; // ⬅️ HERE
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  loginWithGoogle: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // ⬅️ HERE

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // -------------------------------------------------
  // INITIAL LOAD / RESTORE FROM LOCALSTORAGE
  // -------------------------------------------------
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      startTransition(() => {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      });
    }

    // Finished loading auth state
    setAuthLoading(false); // ⬅️ HERE
  }, []);

  // -------------------------------------------------
  // LOGIN
  // -------------------------------------------------
  const login = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const result = await res.json();
    const loggedUser: User = result.data.user;
    const accessToken: string = result.data.token;

    startTransition(() => {
      setUser(loggedUser);
      setToken(accessToken);
    });

    localStorage.setItem("user", JSON.stringify(loggedUser));
    localStorage.setItem("token", accessToken);
  };

  // -------------------------------------------------
  // REGISTER
  // -------------------------------------------------
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) throw new Error("Registration failed");

    const result = await res.json();
    const newUser: User = result.data.user;
    const accessToken: string = result.data.token;

    startTransition(() => {
      setUser(newUser);
      setToken(accessToken);
    });

    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", accessToken);
  };

  // -------------------------------------------------
  // GOOGLE LOGIN
  // -------------------------------------------------
  const loginWithGoogle = (googleUser: User, googleToken: string) => {
    startTransition(() => {
      setUser(googleUser);
      setToken(googleToken);
    });

    localStorage.setItem("user", JSON.stringify(googleUser));
    localStorage.setItem("token", googleToken);
  };

  // -------------------------------------------------
  // LOGOUT
  // -------------------------------------------------
  const logout = () => {
    startTransition(() => {
      setUser(null);
      setToken(null);
    });

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authLoading,     // ⬅️ Provide loading state
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// -------------------------------------------------
// Hook
// -------------------------------------------------
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

"use client";

import { User, UserRole } from "@/types/index.type";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        name: string,
        role: UserRole
    ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

    // -----------------------------
    // LOGIN
    // -----------------------------
  const login = async (email: string, password: string) => {
      // Mock login (replace with an API call later)
    const mockUser: User = {
        id: "1",
      email,
        name: "Demo User",
        role: "tourist",
        languages: ["English"],
      createdAt: new Date(),
    };

    setUser(mockUser);

      // optional persistence:
      // localStorage.setItem("user", JSON.stringify(mockUser));
  };

    // -----------------------------
    // REGISTER
    // -----------------------------
    const register = async (
        email: string,
        password: string,
        name: string,
        role: UserRole
    ) => {
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
        languages: ["English"],
      createdAt: new Date(),
    };

    setUser(mockUser);

      // optional persistence:
      // localStorage.setItem("user", JSON.stringify(mockUser));
  };

    // -----------------------------
    // LOGOUT
    // -----------------------------
  const logout = () => {
    setUser(null);
      // localStorage.removeItem("user");
  };

  return (
      <AuthContext.Provider
          value={{
              user,
              isAuthenticated: !!user,
              login,
              register,
              logout,
          }}
      >
      {children}
    </AuthContext.Provider>
  );
};

// -----------------------------
// useAuth Hook
// -----------------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

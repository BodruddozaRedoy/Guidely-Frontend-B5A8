import NextAuth from "next-auth";
import { authConfig } from "@/auth";

const authHandler = NextAuth(authConfig);

export const { GET, POST } = authHandler;

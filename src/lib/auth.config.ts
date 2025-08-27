import CredentialsProvider from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "../actions/user";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) { 
      // Example: Replace with your actual user lookup logic
      if (credentials?.email === "test@example.com" && credentials?.password === "password") {
        const user = await getUserByEmail("test@example.com");
        return user;
      }
      else {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);

          if (!user || !user.password || !user.email) return null;

          const passwordMatch = await bcrypt.compare(
            password,
            user.password
          );

          if (!passwordMatch) { return null; } 
          else { return user; }
        }
        return null;
      }
    }
  })]
} as NextAuthConfig;
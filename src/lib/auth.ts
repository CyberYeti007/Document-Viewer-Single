import NextAuth from "next-auth"
import { prisma } from "./db/postgres"
import authConfig from "./auth.config"
import { PrismaAdapter } from '@auth/prisma-adapter'
import { getUserById } from '../actions/user';
import { getAccountByUserId } from '../actions/account';
import { getAccessType, isApprover, isFileOwner } from '../actions/user';



export const {auth, handlers, signIn, signOut} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"},
    ...authConfig,
    callbacks: {
      async signIn({ user, account }) {
        if(account?.provider !== 'credentials') {
          return true
        }
        if (!user.id) return false
        const existingUser = await getUserById(user.id ?? "");
        if(!existingUser) {
          return false
        } 
        return true
      },
      async jwt({token}) {
        if(!token.sub) return token;
        const existingUser = await getUserById(token.sub)
        if(!existingUser) return token;
        const existingAccount = await getAccountByUserId(existingUser.id)
        token.isOauth = !!existingAccount;
        token.name = existingUser.firstName[0].toUpperCase() + existingUser.firstName.slice(1) + " " + existingUser.lastName[0].toUpperCase() + existingUser.lastName.slice(1);
        token.email = existingUser.email;
        token.picture = existingUser.image;
        token.id = existingUser.id;
        token.accessType = await getAccessType(existingUser.id);
        token.isApprover = await isApprover(existingUser.id);
        token.isFileOwner = await isFileOwner(existingUser.id);

        return token
      },
      async session({ token, session }) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
            isOauth: token.isOauth,
            accessType: token.accessType || "User",
            isApprover: token.isApprover || false,
            isFileOwner: token.isFileOwner || false,
          },
        }
      }
    }
})
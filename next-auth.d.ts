import { DefaultSession } from 'next-auth';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isOauth: boolean;
      accessType: string;
      isApprover: boolean;
      isFileOwner: boolean;
    } & DefaultSession["user"];
  }
}
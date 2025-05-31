import { Timestamp } from 'firebase/firestore';
import { Session } from 'inspector';
import NextAuth, {
  DefaultUser,
  DefaultSession,
  Account as NextAuthAccount,
} from 'next-auth';
import { JWT as NextAuthJWT } from 'next-auth/jwt';

interface CustomUser {
  externalId: string;
  source: string;
  created_at: Timestamp;
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    error?: string;
    user?: DefaultSession['user'] & CustomUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    user?: DefaultUser & CustomUser;
  }
}

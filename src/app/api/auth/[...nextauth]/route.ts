import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { db } from '../../../../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token, user }) => {
      if (!session?.user?.email) return session;

      const userDoc = await getDoc(doc(db, 'users', session?.user?.email));

      // create new user
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', session.user.email), {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          created_at: serverTimestamp(),
        });

        console.log('New user added');
      }

      console.log(`Welcome ${session.user.name} (${session.user.email})!`);

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

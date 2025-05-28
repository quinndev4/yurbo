import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { firestore } from './firebase';
import { C } from './constants/constants';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;

      return session;
    },

    async jwt({ token, user, trigger }) {
      // User login
      if (user?.id && trigger && ['signIn', 'singUp'].includes(trigger)) {
        // fetch user profile
        const userDoc = (
          await getDocs(
            query(
              collection(firestore, C.COLLECTIONS.USERS),
              where('email', '==', user.email)
            )
          )
        )?.docs?.[0];

        const userData = userDoc
          ? { ...userDoc.data(), id: userDoc.id }
          : {
              id: (
                await addDoc(collection(firestore, C.COLLECTIONS.USERS), {
                  name: user.name,
                  email: user.email,
                  created_at: serverTimestamp(),
                })
              ).id,
            };

        console.log('hehyeye', userData);

        token.user = {
          ...user,
          created_at: Timestamp.now(),
          ...userData,
          externalId: user.id,
          source: 'Google',
        };
      }

      return token;
    },
  },
  // adapter: FirestoreAdapter({
  //   credential: cert({
  //     projectId: process.env.FIREBASE_PROJECT_ID,
  //     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  //     privateKey: process.env.FIREBASE_PRIVATE_KEY,
  //   }),
  // }),
});

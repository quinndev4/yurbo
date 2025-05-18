'use server';

import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '../constants/errors';
import { collection, getDocs, query, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { LOGS } from '../constants/logs';
import { Yurbo } from '@/types/types';

export async function getYurbos(): Promise<Yurbo[]> {
  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.email) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    // get yurbos for this user
    const yurbo_snapshot = await getDocs(
      query(
        collection(db, 'users', session.user.email, 'yurbos')
        // orderBy("timestamp", "desc")
      )
    );

    const yurbos = yurbo_snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as Yurbo;
    });

    // return successful response
    console.log(LOGS.YURBO.GOT, session.user.email, yurbos, Date.now());

    return yurbos;
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(ERRORS.YURBO.GOT, JSON.stringify({ message: errorMessage }));
    throw new Error(errorMessage);
  }
}

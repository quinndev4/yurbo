'use server';

import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { LOGS } from '@/constants/logs';
import { Yurbo } from '@/types/types';
import { C } from '@/constants/constants';

export async function getYurbos(): Promise<Yurbo[]> {
  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    // get yurbos for this user
    const yurbo_snapshot = await getDocs(
      query(
        collection(
          firestore,
          C.COLLECTIONS.USERS,
          session.user.id,
          C.COLLECTIONS.YURBOS
        )
        // orderBy('created_at', 'desc')
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

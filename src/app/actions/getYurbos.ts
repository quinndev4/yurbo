'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { ERRORS, getErrorMessage } from '../constants/errors';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/firebase';
import { LOGS } from '../constants/logs';
import { Yurbo } from '@/types/types';

export async function getYurbos(): Promise<Yurbo[]> {
  try {
    const session = await getServerSession(authOptions);

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
      const data = doc.data();
      return {
        id: doc.id,
        created_at: data.created_at,
        location_id: data.location_id,
        name: data.name,
        lat: data.lat,
        long: data.long,
      };
    });

    // return successful response
    console.log(LOGS.YURBO.GOT, session.user.email, yurbos);

    return yurbos;
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(ERRORS.YURBO.GOT, JSON.stringify({ message: errorMessage }));
    throw new Error(errorMessage);
  }
}

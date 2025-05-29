import { auth } from '@/auth';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { C } from '@/constants/constants';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    // get locations for this user
    const personal_locations = await getDocs(
      query(
        collection(firestore, C.COLLECTIONS.USERS, id, C.COLLECTIONS.LOCATIONS)
      )
    );

    const locations = personal_locations.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('ayo', locations);

    return Response.json({ locations });
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(ERRORS.YURBO.GOT, JSON.stringify({ message: errorMessage }));
    return Response.json(
      { mesage: errorMessage, success: false },
      { status: 500 }
    );
  }
}

import { auth } from '@/auth';
import { CreateLocationRequest } from '@/types/types';
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
} from 'firebase/firestore';
import { firestore } from '@/firebase';
import { LOGS } from '@/constants/logs';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { C } from '@/constants/constants';

export async function GET() {
  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    // get locations for this user
    const personal_locations = await getDocs(
      query(
        collection(
          firestore,
          C.COLLECTIONS.USERS,
          session.user.id,
          C.COLLECTIONS.LOCATIONS
        )
        // orderBy("timestamp", "desc")
      )
    );

    const locations = personal_locations.docs.map((doc) => {
      const data = doc.data();

      return { id: doc.id, ...data };
    });

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

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { name, lat, long, description } = body; // js destructuring

  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    // add new personal yurbo
    await setDoc(
      doc(
        collection(
          firestore,
          C.COLLECTIONS.USERS,
          session.user.id,
          C.COLLECTIONS.LOCATIONS
        )
      ),
      {
        name,
        ...(description && { description }),
        lat,
        long,
        created_at: serverTimestamp(),
      }
    );

    revalidatePath(C.ROUTES.locations(session.user.id));

    // return successful response
    console.log(LOGS.LOCATION.CREATED, body);
    return Response.json(
      { message: LOGS.LOCATION.CREATED, success: true, location: body },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.LOCATION.CREATED,
      JSON.stringify({ message: errorMessage, name, lat, long })
    );
    return Response.json(
      { mesage: errorMessage, success: false, name, lat, long },
      { status: 500 }
    );
  }
}

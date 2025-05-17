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
import { db } from '@/firebase';
import { LOGS } from '@/app/constants/logs';
import { ERRORS, getErrorMessage } from '@/app/constants/errors';

export async function GET() {
  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.email) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    // get locations for this user
    const personal_locations = await getDocs(
      query(
        collection(db, 'users', session.user.email, 'locations')
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

export async function POST(request: CreateLocationRequest) {
  const body = await request.json();

  const { name, lat, long, description } = body; // js destructuring

  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.email) {
      return Response.json(
        { success: false, message: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    // add new personal yurbo
    await setDoc(
      doc(collection(db, 'users', session.user.email, 'locations')),
      {
        name,
        ...(description && { description }),
        lat,
        long,
        created_at: serverTimestamp(),
      }
    );

    // return successful response
    console.log(LOGS.LOCATION.CREATED, body);
    return Response.json(
      { message: LOGS.LOCATION.CREATED, success: true, ...body },
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

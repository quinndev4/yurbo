import { getServerSession } from 'next-auth';
import { CreateYurboRequest, CreateYurboResponse } from '@/types/types';
import { authOptions } from '../../auth/[...nextauth]/route';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { LOGS } from '@/app/constants/logs';
import { ERRORS, getErrorMessage } from '@/app/constants/errors';

export async function POST(request: CreateYurboRequest) {
  const body = await request.json();

  const { location, lat, long } = body; // js destructuring

  try {
    const session = await getServerSession(authOptions);

    // no user found in session
    if (!session?.user?.email) {
      return Response.json(
        { success: false, mesage: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    const docRef = doc(collection(db, 'users', session.user.email, 'yurbos'));

    // add new personal yurbo
    await setDoc(docRef, {
      location,
      lat,
      long,
      created_at: serverTimestamp(),
    });

    // return successful response
    console.log(LOGS.YURBO.CREATED, location, lat, long);
    return Response.json(
      { message: LOGS.YURBO.CREATED, success: true, location, lat, long },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.YURBO.CREATED,
      JSON.stringify({ message: errorMessage, location, lat, long })
    );
    return Response.json(
      { mesage: errorMessage, success: false, location, lat, long },
      { status: 500 }
    );
  }
}

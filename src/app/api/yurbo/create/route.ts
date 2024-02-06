import { getServerSession } from 'next-auth';
import { CreateEventRequest } from '@/types/types';
import { authOptions } from '../../auth/[...nextauth]/route';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { LOGS } from '@/app/constants/logs';
import { ERRORS, getErrorMessage } from '@/app/constants/errors';

export async function POST(request: CreateEventRequest) {
  try {
    const body = await request.json();

    const { location } = body;

    const session = await getServerSession(authOptions);

    // no user found in session
    if (!session?.user?.email) {
      return Response.json(
        { success: false, mesage: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    const docRef = doc(collection(db, 'posts'));

    // add new personal event
    await setDoc(docRef, {
      location,
      user: session.user.email,
      created_at: serverTimestamp(),
    });

    // return successful response
    console.log(LOGS.YURBO.CREATED, location);
    return Response.json(
      { message: LOGS.YURBO.CREATED, success: true, location },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.YURBO.CREATED,
      JSON.stringify({ message: errorMessage, location })
    );
    return Response.json(
      { mesage: errorMessage, success: false, location },
      { status: 500 }
    );
  }
}

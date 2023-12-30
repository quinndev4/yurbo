import { getServerSession } from 'next-auth';
import { CreateEventRequest } from '@/types/types';
import { authOptions } from '../../auth/[...nextauth]/route';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { LOGS } from '@/app/constants/logs';
import { ERRORS, getErrorMessage } from '@/app/constants/errors';

export async function POST(request: CreateEventRequest) {
  const body = await request.json();

  const { eventName } = body;

  try {
    const session = await getServerSession(authOptions);

    // no user found in session
    if (!session?.user?.email) {
      return Response.json(
        { success: false, mesage: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    const docRef = doc(collection(db, 'users', session.user.email, 'events'));

    // add new personal event
    await setDoc(docRef, {
      name: eventName,
      created_at: serverTimestamp(),
    });

    // return successful response
    console.log(LOGS.EVENT.CREATED, eventName);
    return Response.json(
      { message: LOGS.EVENT.CREATED, success: true, eventName },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.EVENT.CREATED,
      JSON.stringify({ message: errorMessage, eventName })
    );
    return Response.json(
      { mesage: errorMessage, success: false, eventName },
      { status: 500 }
    );
  }
}

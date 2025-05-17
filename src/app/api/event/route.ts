import { db } from '../../../firebase';
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  orderBy,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/app/constants/errors';
import { LOGS } from '@/app/constants/logs';
import { Act, CreateEventRequest } from '@/types/types';

export async function GET() {
  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.email) {
      return Response.json(
        { success: false, mesage: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    // get acts for this user
    const act_snapshot = await getDocs(
      query(collection(db, 'users', session.user.email, 'events'))
    );

    const events = act_snapshot.docs.map((doc) => {
      const data = doc.data();

      return { id: doc.id, ...data };
    });

    // return successful response
    console.log(LOGS.EVENT.GOT, 'for user', session.user.email, events);
    return Response.json({ events });
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

export async function POST(request: CreateEventRequest) {
  const body = await request.json();

  const { name, description } = body;

  try {
    const session = await auth();

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
      name,
      ...(description && { description }),
      created_at: serverTimestamp(),
    });

    // return successful response
    console.log(LOGS.EVENT.CREATED, name);
    return Response.json(
      { message: LOGS.EVENT.CREATED, success: true, name, description },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.EVENT.CREATED,
      JSON.stringify({ message: errorMessage, name, description })
    );
    return Response.json(
      { mesage: errorMessage, success: false, name, description },
      { status: 500 }
    );
  }
}

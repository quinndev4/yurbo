import { firestore } from '@/firebase';
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  getDocs,
} from 'firebase/firestore';
import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { LOGS } from '@/constants/logs';
import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { C } from '@/constants/constants';

export async function GET() {
  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      return Response.json(
        { success: false, mesage: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    // get acts for this user
    const act_snapshot = await getDocs(
      query(
        collection(
          firestore,
          C.COLLECTIONS.USERS,
          session.user.id,
          C.COLLECTIONS.EVENTS
        )
      )
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await request.json();

  const { id } = await params;
  const { name, description } = body;

  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id || session.user.id !== id) {
      return Response.json(
        { success: false, mesage: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    const docRef = doc(
      collection(
        firestore,
        C.COLLECTIONS.USERS,
        session.user.id,
        C.COLLECTIONS.EVENTS
      )
    );

    // add new personal event
    await setDoc(docRef, {
      name,
      ...(description && { description }),
      created_at: serverTimestamp(),
    });

    revalidatePath(C.ROUTES.events(session.user.id));

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

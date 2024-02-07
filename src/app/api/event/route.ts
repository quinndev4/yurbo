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
import { getServerSession } from 'next-auth';
import { ERRORS, getErrorMessage } from '@/app/constants/errors';
import { authOptions } from '../auth/[...nextauth]/route';
import { LOGS } from '@/app/constants/logs';
import { Act, CreateEventRequest } from '@/types/types';

export async function GET() {
  function isAct(a: any): a is Act {
    return a && 'name' in a && 'created_at' in a;
  }
  try {
    const session = await getServerSession(authOptions);

    // no user found in session
    if (!session?.user?.email) {
      return Response.json(
        { success: false, mesage: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    // get acts for this user
    const act_snapshot = await getDocs(
      query(
        collection(db, 'users', session.user.email, 'events')
        // orderBy("timestamp", "desc")
      )
    );

    // convert snapshot into list of Acts, making sure they are assignable to Act
    let acts: Act[] = [];

    act_snapshot.forEach((doc) => {
      const a = doc.data();
      if (isAct(a)) {
        acts.push(a);
      } else {
        console.error('datum is not assignable to a yurbo...', a);
      }
    });

    // return successful response
    console.log(LOGS.YURBO.GOT, 'for user', session.user.email, acts);
    return Response.json({ acts });
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

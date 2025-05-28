import { firestore } from '@/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { LOGS } from '@/constants/logs';
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

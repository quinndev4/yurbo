import { db } from '../../../firebase';
import {
  doc,
  getDocs,
  query,
  setDoc,
  serverTimestamp,
  collection,
} from 'firebase/firestore';
import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { LOGS } from '@/constants/logs';
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    console.log(`user - ${session}`);

    // no user found in session
    if (!session?.user?.id) {
      console.error(`no session email - ${session}`);
      return Response.json(
        { success: false, mesage: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    // get locations for this user
    const personal_locations = await getDocs(
      query(
        collection(db, 'users', session.user.id, 'locations')
        // orderBy("timestamp", "desc")
      )
    );

    const res = personal_locations.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('res', res);

    return Response.json({ res });
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(ERRORS.TEST.GET, JSON.stringify({ message: errorMessage }));
    return Response.json(
      { mesage: errorMessage, success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { field1, field2 } = body; // js destructuring

  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      return Response.json(
        { success: false, mesage: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    // add new personal yurbo
    await setDoc(doc(collection(db, 'users', session.user.id, 'yurbos')), {
      field1,
      field2,
    });

    revalidatePath('/api/test');

    // return successful response
    console.log(LOGS.YURBO.CREATED, body);
    return Response.json(
      { message: LOGS.YURBO.CREATED, success: true, body },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.TEST.POST,
      JSON.stringify({ message: errorMessage, body })
    );
    return Response.json(
      { mesage: errorMessage, success: false, ...body },
      { status: 500 }
    );
  }
}

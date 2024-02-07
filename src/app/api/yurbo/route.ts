import { db } from '../../../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
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
import { CreateYurboRequest, Yurbo } from '@/types/types';
import { getYurbos } from '@/app/actions/getYurbos';

export async function GET() {
  try {
    const yurbos = getYurbos();

    return Response.json({ yurbos });
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

export async function POST(request: CreateYurboRequest) {
  const body = await request.json();

  const { name, lat, long, loc_id } = body; // js destructuring

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
      name,
      lat,
      long,
      location_id: loc_id,
      created_at: serverTimestamp(),
    });

    // return successful response
    console.log(LOGS.YURBO.CREATED, name, lat, long);
    return Response.json(
      { message: LOGS.YURBO.CREATED, success: true, name, lat, long, loc_id },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.YURBO.CREATED,
      JSON.stringify({ message: errorMessage, name, lat, long })
    );
    return Response.json(
      { mesage: errorMessage, success: false, name, lat, long },
      { status: 500 }
    );
  }
}

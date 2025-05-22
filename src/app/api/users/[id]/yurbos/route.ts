import { firestore } from '@/firebase';
import { serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { LOGS } from '@/constants/logs';
import { getYurbos } from '@/app/actions/getYurbos';
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import { C } from '@/constants/constants';

export async function GET() {
  try {
    const yurbos = await getYurbos();

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

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { location_id, event_id, lat, long, description, name } = body; // js destructuring

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
    const res = await addDoc(
      collection(
        firestore,
        C.COLLECTIONS.USERS,
        session.user.id,
        C.COLLECTIONS.YURBOS
      ),
      {
        name,
        event_id,
        ...(location_id ? { location_id } : { lat, long }),
        ...(description && { description }),
        created_at: serverTimestamp(),
      }
    );

    revalidatePath(C.ROUTES.yurbos(session.user.id));

    // return successful response
    console.log(LOGS.YURBO.CREATED, location_id, body);
    return Response.json(
      {
        message: LOGS.YURBO.CREATED,
        success: true,
        yurbo: { ...body, id: res.id },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.YURBO.CREATED,
      JSON.stringify({ message: errorMessage, body })
    );
    return Response.json(
      { mesage: errorMessage, success: false, ...body },
      { status: 500 }
    );
  }
}

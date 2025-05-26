import {
  serverTimestamp,
  collection,
  where,
  query,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { LOGS } from '@/constants/logs';
import { getFollowing } from '@/app/actions/getFollowing';
import { getFollowers } from '@/app/actions/getFollowers';
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';
import { C } from '@/constants/constants';
import { firestore } from '../../../../../firebase';

export async function GET(request: NextRequest) {
  // GET params
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  // Returns a list of Friends
  // Depending on type of get request, tweak
  try {
    if (!query || !['following', 'followers'].includes(query)) {
      return Response.json(
        { success: false, mesage: ERRORS.FRIEND.GETPARAMS },
        { status: 404 }
      );
    }

    console.log(`Doing a ${query} grab.`);

    const ret =
      query === 'following' ? await getFollowing() : await getFollowers();

    return Response.json({ ret });
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    if (query === 'followers') {
      console.error(
        ERRORS.FRIEND.GETFOLLOWERS,
        JSON.stringify({ message: errorMessage })
      );
    } else {
      console.error(
        ERRORS.FRIEND.GETFOLLOWEES,
        JSON.stringify({ message: errorMessage })
      );
    }

    return Response.json(
      { mesage: errorMessage, success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { email } = body; // {email: 'david.ham0099@gmail.com'}

  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      return Response.json(
        { success: false, mesage: ERRORS.UNATHORIZED },
        { status: 401 }
      );
    }

    // Get following's info
    const followerDoc = (
      await getDocs(
        query(
          collection(firestore, C.COLLECTIONS.USERS),
          where('email', '==', email)
        )
      )
    )?.docs?.[0];

    const created_at = serverTimestamp(); // When relationship starts

    // manually spreading to omit created_at that exists when user profile got created
    const follower = {
      email: followerDoc.data().email,
      name: followerDoc.data().name,
      id: followerDoc.id,
      created_at: created_at,
    };

    console.log('Found user:', follower);

    // Add relationship to "Followers" collection
    const followFriendRes = await addDoc(
      collection(firestore, C.COLLECTIONS.FOLLOWERS),
      {
        user_id: follower.id,
        follower_id: session?.user?.id,
        created_at,
      }
    );
    revalidatePath(C.ROUTES.following(session.user.id));

    // return successful response
    return Response.json(
      {
        message: LOGS.FRIEND.created(email),
        success: true,
        friend: follower,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.FRIEND.CREATED,
      JSON.stringify({ message: errorMessage, body })
    );
    return Response.json(
      { mesage: errorMessage, success: false, ...body },
      { status: 500 }
    );
  }
}

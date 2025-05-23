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
import { getFollowees } from '@/app/actions/getFollowees';
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

    const ret_list =
      query === 'following' ? await getFollowees() : await getFollowers();

    return Response.json({ ret_list });
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

    // Get followee's info
    const followeeDoc = (
      await getDocs(
        query(
          collection(firestore, C.COLLECTIONS.USERS),
          where('email', '==', email)
        )
      )
    )?.docs?.[0];

    // Followee doesnt exist, return error code
    if (!followeeDoc) {
      return Response.json(
        { success: false, message: ERRORS.FRIEND.NOTFOUND },
        { status: 404 }
      );
    }

    const created_at = serverTimestamp(); // When relationship starts

    // manually spreading to omit created_at that exists when user profile got created
    const followee = {
      email: followeeDoc.data().email,
      name: followeeDoc.data().name,
      id: followeeDoc.id,
      created_at: created_at,
    };

    console.log('Found user:', followee);

    // Check that user doesnt follow followee already
    const followingDoc = (
      await getDocs(
        query(
          collection(
            firestore,
            C.COLLECTIONS.USERS,
            session.user.id,
            C.COLLECTIONS.FOLLOWING
          ),
          where('id', '==', followee.id)
        )
      )
    )?.docs?.[0];

    if (followingDoc) {
      return Response.json(
        { success: false, message: ERRORS.FRIEND.ALREADYEXISTS },
        { status: 404 }
      );
    }

    // add to your following list
    const followFriendRes = await addDoc(
      collection(
        firestore,
        C.COLLECTIONS.USERS,
        session.user.id,
        C.COLLECTIONS.FOLLOWING
      ),
      {
        id: followee.id,
        created_at,
      }
    );

    // add to their followers list
    const friendFollowedRes = await addDoc(
      collection(
        firestore,
        C.COLLECTIONS.USERS,
        followee.id,
        C.COLLECTIONS.FOLLOWERS
      ),
      {
        id: session.user.id,
        created_at,
      }
    );

    console.log('Now following:', followee);

    // revalidatePath(C.ROUTES.yurbos(session.user.id));

    // return successful response
    // console.log(LOGS.YURBO.CREATED, location_id, body);
    return Response.json(
      {
        message: LOGS.FRIEND.created(email),
        success: true,
        friend: followee,
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

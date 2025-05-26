'use server';

import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { LOGS } from '@/constants/logs';
import { Friend, User } from '@/types/types';
import { C } from '@/constants/constants';

export async function getFollowees(): Promise<Friend[]> {
  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    // get following for this user
    const followees_snapshot = await getDocs(
      query(
        collection(
          firestore,
          C.COLLECTIONS.USERS,
          session.user.id,
          C.COLLECTIONS.FOLLOWING
        )
      )
    );

    const followees_list = followees_snapshot.docs.map(
      (doc) => doc.data() as Friend
    );

    // return successful response
    console.log(
      LOGS.FRIEND.GOT,
      session.user.email,
      followees_list,
      Date.now()
    );

    return followees_list;
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.FRIEND.GETFOLLOWEES,
      JSON.stringify({ message: errorMessage })
    );
    throw new Error(errorMessage);
  }
}

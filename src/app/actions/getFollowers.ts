'use server';

import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { LOGS } from '@/constants/logs';
import { Friend } from '@/types/types';
import { C } from '@/constants/constants';

export async function getFollowers(): Promise<Friend[]> {
  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    // get following for this user
    const followers_snapshot = await getDocs(
      query(
        collection(
          firestore,
          C.COLLECTIONS.USERS,
          session.user.id,
          C.COLLECTIONS.FOLLOWERS
        )
      )
    );

    const followers_list = followers_snapshot.docs.map(
      (doc) => doc.data() as Friend
    );

    // return successful response
    console.log(
      LOGS.FRIEND.GOT,
      session.user.email,
      followers_list,
      Date.now()
    );

    return followers_list;
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(
      ERRORS.FRIEND.GETFOLLOWERS,
      JSON.stringify({ message: errorMessage })
    );
    throw new Error(errorMessage);
  }
}

import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { LOGS } from '@/constants/logs';
import { Friend, User } from '@/types/types';
import { C } from '@/constants/constants';
import { queryByBatch } from '@/util';

export async function getFollowing(): Promise<User[]> {
  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    // get all records where user is the follower
    const following_snapshot = await getDocs(
      query(
        collection(firestore, C.COLLECTIONS.FOLLOWERS),
        where('follower_id', '==', session?.user?.id)
      )
    );

    const following_list = following_snapshot.docs.map((doc) => {
      const data = doc.data();
      return { id: data.user_id, created_at: data.created_at } as Friend;
    });

    const following_ids = following_list.map((friend) => friend.id);
    console.log('followers ids', following_ids);

    // Now get User data on all these...
    // Must do a batch query as firestore 'in' only allows up to 10 items
    const userDocs = await queryByBatch<User>(
      C.COLLECTIONS.USERS,
      following_ids
    );

    console.log('your following list:', userDocs);
    // return successful response
    console.log(
      LOGS.FRIEND.GOT,
      session.user.email,
      following_list,
      Date.now()
    );

    return userDocs;
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

import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { LOGS } from '@/constants/logs';
import { Friend, User } from '@/types/types';
import { C } from '@/constants/constants';

export async function getFollowers(id: string): Promise<User[]> {
  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    // get all records where user is the follower
    const followers_snapshot = await getDocs(
      query(
        collection(firestore, C.COLLECTIONS.FOLLOWERS),
        where('user_id', '==', id)
        // orderBy('created_at', 'desc')
      )
    );

    const followers_list = followers_snapshot.docs.map((doc) => {
      const data = doc.data();
      return { id: data.follower_id, created_at: data.created_at } as Friend;
    });

    const followers_ids = followers_list.map((friend) => friend.id);
    console.log('followers ids', followers_ids);

    // Now get User data on all these...
    // Must do a batch query as firestore 'in' only allows up to 10 items
    const userDocs: User[] = [];

    // This should be put into a utility file
    for (let i = 0; i < followers_ids.length; i += 10) {
      const batch = followers_ids.slice(i, i + 10);

      const users_snapshot = await getDocs(
        query(
          collection(firestore, C.COLLECTIONS.USERS),
          where('__name__', 'in', batch)
        )
      );
      userDocs.push(
        ...users_snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as User
        )
      );
    }

    console.log('your following list:', userDocs);
    // return successful response
    console.log(
      LOGS.FRIEND.GOT,
      session.user.email,
      followers_list,
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

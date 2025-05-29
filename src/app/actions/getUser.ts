import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { User } from '@/types/types';
import { C } from '@/constants/constants';

export async function getUser(id: string): Promise<User> {
  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    // get all records where user is the follower
    const userDoc = (
      await getDocs(query(collection(firestore, C.COLLECTIONS.FOLLOWERS, id)))
    ).docs?.[0];

    return {
      id: userDoc.id,
      name: userDoc.data().name,
      email: userDoc.data().email,
      created_at: userDoc.data().created_at,
    };
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

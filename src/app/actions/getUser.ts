import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { doc, getDoc } from 'firebase/firestore';
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
    const userDoc = await getDoc(doc(firestore, C.COLLECTIONS.USERS, id));

    return { id: userDoc.id, ...userDoc.data() } as User;
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

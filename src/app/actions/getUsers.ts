import { auth } from '@/auth';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import {
  doc,
  getDocs,
  orderBy,
  startAt,
  endAt,
  query,
  collection,
  where,
} from 'firebase/firestore';
import { firestore } from '@/firebase';
import { User } from '@/types/types';
import { C } from '@/constants/constants';

export async function getUsers(nameInput: string): Promise<User[]> {
  /**
   * This gets a list of Users by string matching on name substring.
   * Other one gets a list with a singular user by exact user id
   */

  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    // Search for users starting with given input
    console.log('name input:', nameInput);

    const users_snapshot = await getDocs(
      query(
        collection(firestore, C.COLLECTIONS.USERS),
        where('searchable_name', '>=', nameInput),
        where('searchable_name', '<=', nameInput + '\uf8ff')
      )
    );

    const users_list = users_snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as User;
    });

    console.log('USERS:', users_list);

    return users_list;
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

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
  collectionGroup,
} from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Yurbo } from '@/types/types';
import { C } from '@/constants/constants';

export async function getYurbosByName(nameInput: string): Promise<Yurbo[]> {
  /**
   * This gets a list of Yurbos by string matching on name substring.
   * Other one gets a list with a singular user by exact user id
   */

  try {
    const session = await auth();

    // no user found in session
    if (!session?.user?.id) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    // Search for yurbos starting with given input
    console.log('name input:', nameInput);

    const yurbos_snapshot = await getDocs(
      query(
        collectionGroup(firestore, C.COLLECTIONS.YURBOS),
        where('searchable_name', '>=', nameInput),
        where('searchable_name', '<=', nameInput + '\uf8ff')
      )
    );

    const yurbos_list = yurbos_snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as Yurbo;
    });

    console.log('YURBOS:', yurbos_list);

    return yurbos_list;
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

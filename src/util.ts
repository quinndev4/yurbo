// All utility functions

import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from './firebase';

export async function queryByBatch<T>(
  collectionPath: string,
  queryIds: string[]
): Promise<T[]> {
  const returnDocs: T[] = [];

  for (let i = 0; i < queryIds.length; i += 10) {
    const batch = queryIds.slice(i, i + 10);

    const users_snapshot = await getDocs(
      query(
        collection(firestore, collectionPath),
        where('__name__', 'in', batch)
      )
    );

    users_snapshot.docs.forEach((doc) =>
      returnDocs.push({ id: doc.id, ...doc.data() } as T)
    );
  }

  return returnDocs;
}

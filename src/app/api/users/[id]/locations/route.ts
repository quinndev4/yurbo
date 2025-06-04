import { auth } from '@/auth';
import {
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { firestore } from '@/firebase';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { C } from '@/constants/constants';
import { NextRequest } from 'next/server';
import { Location } from '@/types/types';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const session = await auth();

    // GET params
    const searchParams = request.nextUrl.searchParams;
    const getQuery = searchParams.get('query');

    // no user found in session
    if (!session?.user?.id) {
      throw new Error(ERRORS.UNATHORIZED);
    }

    console.log('query:', getQuery);

    // If the user has get params, then search location by name
    if (getQuery && getQuery.length > 0) {
      const locations_snapshot = await getDocs(
        query(
          collectionGroup(firestore, C.COLLECTIONS.LOCATIONS),
          where('searchable_name', '>=', getQuery),
          where('searchable_name', '<=', getQuery + '\uf8ff')
        )
      );

      const locations_list = locations_snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Location;
      });

      console.log('LOCATIONS:', locations_list);

      return Response.json({ locations: locations_list });
    }

    // No get params - search location by user
    const personal_locations = await getDocs(
      query(
        collection(firestore, C.COLLECTIONS.USERS, id, C.COLLECTIONS.LOCATIONS)
      )
    );

    const locations = personal_locations.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('locations', locations);

    return Response.json({ locations });
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    console.error(ERRORS.YURBO.GOT, JSON.stringify({ message: errorMessage }));
    return Response.json(
      { mesage: errorMessage, success: false },
      { status: 500 }
    );
  }
}

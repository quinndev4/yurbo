'use server';

import { C } from '@/constants/constants';
import { ERRORS, getErrorMessage } from '@/constants/errors';
import { LOGS } from '@/constants/logs';
import { firestore } from '@/firebase';
import { authActionClient } from '@/lib/safe-action';
import {
  createEventSchema,
  createLocationSchema,
  createYurboSchema,
  createFriendSchema,
} from '@/schemas/db';
import { User } from '@/types/types';
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export const createEvent = authActionClient
  .schema(createEventSchema)
  .action(async ({ parsedInput: { name, description }, ctx: { userId } }) => {
    const body = { name, ...(description && { description }) };

    console.log(LOGS.EVENT.CREATING, userId, body);

    const { id } = await addDoc(
      collection(firestore, C.COLLECTIONS.USERS, userId, C.COLLECTIONS.EVENTS),
      { ...body, created_at: serverTimestamp() }
    );

    revalidatePath(`/api/users/${userId}/events`);

    console.log(LOGS.EVENT.CREATED, name, id);

    return { event: { id, ...body, created_at: Timestamp.now() } };
  });

export const createLocation = authActionClient
  .schema(createLocationSchema)
  .action(
    async ({
      parsedInput: { name, description, lat, long },
      ctx: { userId },
    }) => {
      const body = { name, lat, long, ...(description && { description }) };

      console.log(LOGS.LOCATION.CREATING, userId, body);

      const { id } = await addDoc(
        collection(
          firestore,
          C.COLLECTIONS.USERS,
          userId,
          C.COLLECTIONS.LOCATIONS
        ),
        {
          ...body,
          searchable_name: body.name.toLowerCase().replace(/[^a-z0-9]/gi, ''), // NEW - now locations have searchability
          created_at: serverTimestamp(),
        }
      );

      revalidatePath(C.ROUTES.locations(userId));

      console.log(LOGS.LOCATION.CREATED, name, id);

      return {
        location: {
          id,
          ...body,
          searchable_name: body.name.toLowerCase().replace(/[^a-z0-9]/gi, ''),
          created_at: Timestamp.now(),
        },
      };
    }
  );

export const createYurbo = authActionClient
  .schema(createYurboSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    console.log(LOGS.YURBO.CREATING, userId, parsedInput);

    const { id } = await addDoc(
      collection(firestore, C.COLLECTIONS.USERS, userId, C.COLLECTIONS.YURBOS),
      {
        ...parsedInput,
        searchable_name: parsedInput.name
          .toLowerCase()
          .replace(/[^a-z0-9]/gi, ''),
        created_at: serverTimestamp(),
      }
    );

    revalidatePath(`/api/users/${userId}/yurbos`);

    console.log(LOGS.YURBO.CREATED, parsedInput.name, id);

    return {
      yurbo: {
        id,
        ...parsedInput,
        searchable_name: parsedInput.name
          .toLowerCase()
          .replace(/[^a-z0-9]/gi, ''),
        created_at: Timestamp.now(),
      },
    };
  });

export const createFriend = authActionClient
  .schema(createFriendSchema)
  .action(async ({ parsedInput: { email }, ctx: { userId } }) => {
    const body = { email };

    try {
      // Get following's info
      const followingDoc = (
        await getDocs(
          query(
            collection(firestore, C.COLLECTIONS.USERS),
            where('email', '==', email)
          )
        )
      )?.docs?.[0];

      // check if user is found
      if (!followingDoc) {
        return { success: false, errorMessage: ERRORS.FRIEND.NOTFOUND };
      }

      // check if user is yourself
      if (followingDoc.id === userId) {
        return { success: false, errorMessage: ERRORS.FRIEND.YOURSELF };
      }

      const following: User = {
        id: followingDoc.id,
        name: followingDoc.data().name,
        email: followingDoc.data().email,
        created_at: Timestamp.now(),
      };

      console.log('Found user:', following);

      // check if user already follows this head
      const existingRelationship = (
        await getDocs(
          query(
            collection(firestore, C.COLLECTIONS.FOLLOWERS),
            where('follower_id', '==', userId),
            where('user_id', '==', following.id)
          )
        )
      )?.docs?.[0];

      if (existingRelationship) {
        console.log(
          'Existing relationship?',
          JSON.stringify(existingRelationship.data())
        );
        return { success: false, errorMessage: ERRORS.FRIEND.ALREADYEXISTS };
      }

      // Add relationship to "Followers" collection
      await addDoc(collection(firestore, C.COLLECTIONS.FOLLOWERS), {
        user_id: following.id,
        follower_id: userId,
        created_at: following.created_at,
      });
      console.log('Relationship now added');
      revalidatePath(C.ROUTES.following(userId));

      // return successful response
      return {
        user_followed: { ...following },
      };
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      // failure
      console.error(
        ERRORS.FRIEND.CREATED,
        JSON.stringify({ message: errorMessage, body })
      );
      return { errorMessage: errorMessage, success: false, ...body };
    }
  });

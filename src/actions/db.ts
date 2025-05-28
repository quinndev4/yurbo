'use server';

import { C } from '@/constants/constants';
import { LOGS } from '@/constants/logs';
import { firestore } from '@/firebase';
import { authActionClient } from '@/lib/safe-action';
import {
  createEventSchema,
  createLocationSchema,
  createYurboSchema,
} from '@/schemas/db';
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
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
        { ...body, created_at: serverTimestamp() }
      );

      revalidatePath(C.ROUTES.locations(userId));

      console.log(LOGS.LOCATION.CREATED, name, id);

      return { location: { id, ...body, created_at: Timestamp.now() } };
    }
  );

export const createYurbo = authActionClient
  .schema(createYurboSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    console.log(LOGS.YURBO.CREATING, userId, parsedInput);

    const { id } = await addDoc(
      collection(firestore, C.COLLECTIONS.USERS, userId, C.COLLECTIONS.YURBOS),
      { ...parsedInput, created_at: serverTimestamp() }
    );

    revalidatePath(`/api/users/${userId}/yurbos`);

    console.log(LOGS.YURBO.CREATED, parsedInput.name, id);

    return { yurbo: { id, ...parsedInput, created_at: Timestamp.now() } };
  });

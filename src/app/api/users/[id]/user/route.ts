import { getErrorMessage } from '@/constants/errors';
import { getUser } from '@/app/actions/getUser';
import { NextRequest } from 'next/server';
import { C } from '@/constants/constants';
import { firestore } from '../../../../../firebase';
import { User } from '@/types/types';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;

  // Depending on type of get request, tweak
  try {
    console.log(`Searching for user with id ${id}.`);

    const ret = await getUser(id);

    return Response.json({ ret });
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    return Response.json(
      { mesage: errorMessage, success: false },
      { status: 500 }
    );
  }
}

import { getErrorMessage } from '@/constants/errors';
import { getUser } from '@/app/actions/getUser';
import { getUsers } from '@/app/actions/getUsers';

import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  // Depending on type of get request, tweak
  try {
    console.log(`Searching for user with id ${id}.`);

    const safeQuery = query ?? '';

    console.log('the query:', safeQuery);
    const user =
      safeQuery === '' || !safeQuery
        ? await getUser(id)
        : await getUsers(safeQuery);

    return Response.json({ user });
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    return Response.json(
      { mesage: errorMessage, success: false, yeet: 'YEET' },
      { status: 500 }
    );
  }
}

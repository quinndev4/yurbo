import { ERRORS, getErrorMessage } from '@/constants/errors';

import { getUsers } from '@/app/actions/getUsers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return Response.json(
      { mesage: ERRORS.USERS.EMPTY_QUERY, success: false },
      { status: 400 }
    );
  }

  // Depending on type of get request, tweak
  try {
    console.log('GET query:', query);
    const users = await getUsers(query);

    return Response.json({ users });
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    return Response.json(
      { mesage: errorMessage, success: false },
      { status: 500 }
    );
  }
}

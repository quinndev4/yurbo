import { ERRORS, getErrorMessage } from '@/constants/errors';
import { getFollowing } from '@/app/actions/getFollowing';
import { getFollowers } from '@/app/actions/getFollowers';
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

  // GET params
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  // Returns a list of Friends
  // Depending on type of get request, tweak
  try {
    if (!query || !['following', 'followers'].includes(query)) {
      return Response.json(
        { success: false, mesage: ERRORS.FRIEND.GETPARAMS },
        { status: 404 }
      );
    }

    console.log(`Doing a ${query} grab.`);

    const ret =
      query === 'following' ? await getFollowing(id) : await getFollowers(id);

    return Response.json({ ret });
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    // failure
    if (query === 'followers') {
      console.error(
        ERRORS.FRIEND.GETFOLLOWERS,
        JSON.stringify({ message: errorMessage })
      );
    } else {
      console.error(
        ERRORS.FRIEND.GETFOLLOWEES,
        JSON.stringify({ message: errorMessage })
      );
    }

    return Response.json(
      { mesage: errorMessage, success: false },
      { status: 500 }
    );
  }
}

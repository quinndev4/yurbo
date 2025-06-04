import { ERRORS, getErrorMessage } from '@/constants/errors';
import { getYurbos } from '@/actions/getYurbos';
import { NextRequest } from 'next/server';
import { getYurbosByName } from '@/app/actions/getYurbosByName';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  // GET params
  const searchParams = request.nextUrl.searchParams;
  const getQuery = searchParams.get('query');

  if (getQuery && getQuery.length > 0) {
    try {
      const searchableYurbos = await getYurbosByName(getQuery);

      console.log('api route returning', searchableYurbos);

      return Response.json({ searchableYurbos });
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      // failure
      console.error(
        ERRORS.YURBO.GOT,
        JSON.stringify({ message: errorMessage })
      );
      return Response.json(
        { mesage: errorMessage, success: false },
        { status: 500 }
      );
    }
  }
  try {
    const { id } = await params;

    const yurbos = await getYurbos(id);

    return Response.json({ yurbos });
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

import { ERRORS, getErrorMessage } from '@/constants/errors';
import { getYurbos } from '@/actions/getYurbos';

export async function GET() {
  try {
    const yurbos = await getYurbos();

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

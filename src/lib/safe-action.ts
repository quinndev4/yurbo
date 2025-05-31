import { createSafeActionClient } from 'next-safe-action';
import { ZodError } from 'zod';
import { auth } from '@/auth';

const baseActionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof ZodError) {
      return { message: 'Validation Error', error: e };
    } else if (e instanceof Error) {
      return { message: 'Generic Error', error: e };
    }

    return { message: 'Unkown Error', error: e };
  },
});

export const authActionClient = baseActionClient.use(async ({ next }) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return next({ ctx: { userId: session.user.id } });
});

import { signIn } from '@/auth';
import Button from './Button';

export default function SignInButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn();
      }}
    >
      <Button type='submit'>Sign In</Button>
    </form>
  );
}

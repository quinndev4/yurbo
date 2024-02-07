import { signIn } from 'next-auth/react';
import React from 'react';

export default function SignInButton() {
  return (
    <button className='btn-primary' onClick={() => signIn('google')}>
      Sign In
    </button>
  );
}

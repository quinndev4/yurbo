'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button className='btn-primary' onClick={() => signOut()}>
      Sign Out
    </button>
  );
}

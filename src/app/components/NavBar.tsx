'use client';

import Link from 'next/link';
import React from 'react';
import SignOutButton from './SignOutButton';
import { useSession } from 'next-auth/react';
import SignInButton from './SignInButton';

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <header className='flex justify-between h-20 mx-8 items-center sticky top-0 bg-black'>
      {/* Home logo */}
      <Link className='hover:cursor-pointer text-3xl font-bold' href='/'>
        Yurbo
      </Link>

      {session && status === 'authenticated' ? (
        <SignOutButton />
      ) : (
        <SignInButton />
      )}
    </header>
  );
}

import Link from 'next/link';
import React from 'react';
import SignOutButton from './SignOutButton';
import { auth } from '@/auth';

export default async function NavBar() {
  const session = await auth();

  return (
    <header className='fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b-2 bg-black'>
      {/* Home logo */}
      <Link className='mx-4 text-3xl font-bold hover:cursor-pointer' href='/'>
        Yurbo
      </Link>
      <div className='flex'>
        <div>
          <Link
            className='mx-4 text-xl font-bold hover:cursor-pointer'
            href={`/${session?.user?.id}/profile`}
          >
            Profile
          </Link>
        </div>

        <div className='mx-4'>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}

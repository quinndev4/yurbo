import Link from 'next/link';
import React from 'react';
import SignOutButton from './SignOutButton';

export default async function NavBar() {
  return (
    <header className='fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b-2 bg-black'>
      {/* Home logo */}
      <Link className='mx-4 text-3xl font-bold hover:cursor-pointer' href='/'>
        Yurbo
      </Link>
      <div className='flex items-center'>
        <Link
          className='rounded-lg border-2 border-transparent p-2 text-xl font-bold hover:cursor-pointer hover:border-white'
          href='/me/profile'
        >
          Profile
        </Link>

        <div className='mx-4'>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}

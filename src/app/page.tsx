'use client';

import { useSession } from 'next-auth/react';
import HomePage from './HomePage';
import { RotatingLines } from 'react-loader-spinner';
import SignInButton from './components/SignInButton';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {session && status === 'authenticated' ? (
        <HomePage />
      ) : status === 'loading' ? (
        <div className='m-auto'>
          <RotatingLines
            strokeColor='grey'
            strokeWidth='5'
            animationDuration='0.75'
            width='96'
            visible={true}
          />
        </div>
      ) : (
        <div className='flex flex-col'>
          <h1 className='text-3xl font-bold mb-20'>Yurbo</h1>

          <SignInButton />
        </div>
      )}
    </main>
  );
}

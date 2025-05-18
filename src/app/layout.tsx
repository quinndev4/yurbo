import { auth } from '@/auth';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import LoginPage from './LoginPage';
import UserDataProvider from '@/components/UserDataProvider';

const inter = Inter({ subsets: ['latin'] });

// Set tab icon:
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#image-files-ico-jpg-png

export const metadata: Metadata = {
  title: 'Yurbo',
  description: '',
};

// TODO: have navbar show up only when signed in. can make a separate client componenet for this
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider>
      <html lang='en'>
        <body
          className={`${inter.className} bg-primary-light text-primary-dark dark:bg-primary-dark dark:text-primary-light`}
        >
          {session?.user ? (
            <UserDataProvider>
              <div className='flex min-h-screen flex-col'>
                <NavBar />
                <main className='mt-22 flex justify-center overflow-y-auto p-8'>
                  {children}
                </main>
              </div>
            </UserDataProvider>
          ) : (
            <div className='flex min-h-screen flex-col items-center justify-center gap-10'>
              <h1 className='text-6xl'>Joe Hole</h1>
              <LoginPage />
            </div>
          )}
        </body>
      </html>
    </SessionProvider>
  );
}

import { auth } from '@/auth';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';
import LoginPage from '../components/LoginPage';
import UserDataProvider from '@/components/UserDataProvider';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

// Set tab icon:
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#image-files-ico-jpg-png

export const metadata: Metadata = {
  title: 'Yurbo',
  description: '',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider>
      <html lang='en' className='h-full'>
        <body
          className={`${inter.className} bg-primary-light text-primary-dark dark:bg-primary-dark dark:text-primary-light flex h-full min-h-screen flex-col`}
        >
          {session?.user ? (
            <UserDataProvider>
              <NavBar />
              <main className='flex flex-grow justify-center pt-20'>
                {children}
              </main>
            </UserDataProvider>
          ) : (
            <LoginPage />
          )}
        </body>
      </html>
    </SessionProvider>
  );
}

import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from './components/NavBar';

const inter = Inter({ subsets: ['latin'] });

// Set tab icon:
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#image-files-ico-jpg-png

export const metadata: Metadata = {
  title: 'Yurbo',
  description: '',
};

// TODO: have navbar show up only when signed in. can make a separate client componenet for this
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang='en'>
        <body
          className={`${inter.className} text-black bg-white dark:text-white dark:bg-black`}
        >
          <NavBar />

          {children}
        </body>
      </html>
    </SessionProvider>
  );
}

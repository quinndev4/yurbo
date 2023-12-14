import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Set tab icon:
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#image-files-ico-jpg-png

export const metadata: Metadata = {
  title: 'Yurbo',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`${inter.className} text-black bg-white dark:text-white dark:bg-black`}
      >
        {children}
      </body>
    </html>
  );
}

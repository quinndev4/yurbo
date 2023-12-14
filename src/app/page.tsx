import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Link href={'/submit'} className='rounded-lg border-2 border-white'>
        Create a new Yurbo
      </Link>
    </main>
  );
}

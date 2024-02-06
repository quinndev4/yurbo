import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='flex flex-col'>
      <Link href={'/yurbo/create'} className='rounded-lg border-2 border-white'>
        Create a new Yurbo
      </Link>

      <Link href={'/event/create'} className='rounded-lg border-2 border-white'>
        Create a new Event
      </Link>
      <Link
        href={'/location/create'}
        className='rounded-lg border-2 border-white'>
        Create a new Location
      </Link>
      <Link href={'/map'} className='rounded-lg border-2 border-white'>
        Your Yurbos
      </Link>
    </div>
  );
}

import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <Link href={'/yurbo/create'} className='rounded-lg border-2 border-white'>
        Create a new Yurbo
      </Link>

      <Link href={'/event/create'} className='rounded-lg border-2 border-white'>
        Create a new Event
      </Link>
    </div>
  );
}

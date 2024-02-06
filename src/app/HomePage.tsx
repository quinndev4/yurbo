import Link from 'next/link';
import Posts from './components/Posts';

export default function HomePage() {
  return (
    <div className='flex flex-col'>
      <Link
        href='/yurbo/create'
        className='rounded-lg border-2 border-white my-5 p-2'
      >
        Create a new Yurbo
      </Link>

      <Link
        href='/event/create'
        className='rounded-lg border-2 border-white my-5 p-2'
      >
        Create a new Event
      </Link>

      <Posts />
    </div>
  );
}

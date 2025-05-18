'use client';

import Button from '@/components/Button';
import LinkButton from '@/components/LinkButton';

export default function HomePage() {
  const onClick = async () => {
    const res = await fetch('/api/location', {
      cache: 'force-cache',
      next: { revalidate: false },
    });

    console.log('yoooo');
  };

  return (
    <div className='flex flex-col gap-8'>
      <LinkButton href='/yurbo/create'>Create a new Yurbo</LinkButton>
      <LinkButton href='/event/create'>Create a new Event</LinkButton>
      <LinkButton href='/location/create'>Create a new Location</LinkButton>
      <LinkButton href='/me/yurbos'>Your Yurbos</LinkButton>
      <Button onClick={onClick}></Button>
    </div>
  );
}

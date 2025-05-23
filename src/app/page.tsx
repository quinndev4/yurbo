'use client';

import LinkButton from '@/components/LinkButton';

export default function HomePage() {
  return (
    <div className='flex flex-col gap-8'>
      <LinkButton href='/create'>Create a new Yurbo</LinkButton>
      <LinkButton href='/event/create'>Create a new Event</LinkButton>
      <LinkButton href='/location/create'>Create a new Location</LinkButton>
      <LinkButton href='/friends'>Friends</LinkButton>
      <LinkButton href='/me/yurbos'>Your Yurbos</LinkButton>

      <LinkButton href='/test'>Test</LinkButton>
    </div>
  );
}

'use client';

import Button from '@/components/Button';
import { useSession } from 'next-auth/react';

// https://next-auth.js.org/getting-started/client#updating-the-session

export default function page() {
  const { data: session, status, update } = useSession();

  const onClick = async () => {
    if (session) update({ name: 'amy' });
  };

  return (
    <div className='flex flex-col gap-10'>
      <h1 className='text-7xl'>Test</h1>

      <span>Session: {JSON.stringify(session, null, 2)}</span>

      <span>Status: {status}</span>

      <Button onClick={onClick}>Update Session</Button>
    </div>
  );
}

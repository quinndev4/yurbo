'use client';

import { useSelectedUser } from '@/providers/SelectedUserProvider';

export default function UserProfilePage() {
  const { user, yurbos, events, locations, followers, following } =
    useSelectedUser();

  return (
    <div className='flex flex-col items-center gap-4'>
      <h1 className='text-6xl'>Profile</h1>

      <h2 className='text-3xl'>Name: {user?.name}</h2>
      <h2 className='text-3xl'>Email: {user?.email}</h2>

      <h2 className='text-xl'>Yurbos: {yurbos.size}</h2>
      <h2 className='text-xl'>Events: {events.size}</h2>
      <h2 className='text-xl'>Locations: {locations.size}</h2>
      <h2 className='text-xl'>Follower: {followers.size}</h2>
      <h2 className='text-xl'>Following: {following.size}</h2>
    </div>
  );
}

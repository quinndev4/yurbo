'use client';

import { friendFormSchema, FriendFormData } from '@/types/forms';
import FormBuilder, { Field } from '@/components/FormBuilder';
import { useUserData } from '@/components/UserDataProvider';
import { Map } from 'immutable';
import { Friend } from '@/types/types';
import FormLayout from '@/components/FormLayout';
import { useState, useEffect } from 'react';
import { CreateFriendResponse } from '@/types/types';
import { useRouter } from 'next/navigation';
import { getErrorMessgaeSuccess } from '@/constants/errors';
import { C } from '@/constants/constants';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Button from '@/components/Button';

interface User {
  id: string;
  name: string;
}

export default function FriendsPage() {
  const { data: session } = useSession();

  const { following, followers, setFollowers, setFollowing } = useUserData();

  const getFollowing = async () => {
    const res = await fetch(C.ROUTES.following(session?.user?.id));
    const following: Friend[] = await res.json();

    console.log('following:', following);
  };

  const getFollowers = async () => {
    const res = await fetch(C.ROUTES.followers(session?.user?.id));
    const followers: User[] = await res.json();

    console.log('followers:', followers);
  };

  const router = useRouter();

  const fields: Field[] = [
    { name: 'email', label: 'Search a friend by email', type: 'text' },
  ];

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (friendData: FriendFormData) => {
    setSubmitting(true);

    try {
      const res = await fetch(C.ROUTES.friends(session?.user?.id), {
        method: 'POST',
        body: JSON.stringify(friendData),
      });

      const response: CreateFriendResponse = await res.json();
      alert(JSON.stringify(response, null, 2));
      setFollowing((oldFollowing) =>
        oldFollowing.set(response.friend.id, response.friend)
      );
    } catch (error) {
      alert(
        JSON.stringify(
          { ...location, ...getErrorMessgaeSuccess(error) },
          null,
          2
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className='flex flex-row gap-x-7'>
        <div className='flex flex-col'>
          <h1>Following:</h1>
          {[...following].map(([, following]) => (
            <div className='flex flex-row' key={following.id}>
              <p className='text-xs'>{following.id}</p>
            </div>
          ))}
        </div>

        <div className='flex flex-col'>
          <h1>Followers:</h1>
          {[...followers].map(([, follower]) => (
            <div className='flex flex-row' key={follower.id}>
              <p className='text-xs'>
                {follower.name} ({follower.email}){' '}
              </p>
            </div>
          ))}
        </div>
      </div>

      <FormLayout title='Follow User'>
        <FormBuilder
          schema={friendFormSchema}
          fields={fields}
          onSubmit={onSubmit}
          submitting={submitting}
        />
      </FormLayout>
      <Button onClick={getFollowers}>Get Followers</Button>
      <Button onClick={getFollowing}>Get Following</Button>
    </>
  );
}

'use client';

import { createFriendSchema, FriendFormData } from '@/schemas/db';
import FormBuilder, { Field } from '@/components/FormBuilder';
import { useUserData } from '@/providers/UserDataProvider';
import { Map } from 'immutable';
import { Friend, User } from '@/types/types';
import FormLayout from '@/components/FormLayout';
import { useState, useEffect } from 'react';
import { CreateFriendResponse } from '@/types/types';
import { useRouter } from 'next/navigation';
import { getErrorMessgaeSuccess } from '@/constants/errors';
import { C } from '@/constants/constants';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Button from '@/components/Button';
import { useAction } from 'next-safe-action/hooks';
import { createFriend } from '@/actions/db';

export default function FriendsPage() {
  const { data: session } = useSession();

  const { following, followers, setFollowers, setFollowing } = useUserData();
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(
    null
  );

  const [success, setSuccess] = useState<boolean | null | undefined>(null);
  const [userFollowed, setUserFollowed] = useState<string | null | undefined>(
    null
  );

  const [geoDefaults, setGeoDefaults] = useState<Partial<FriendFormData>>({});

  const getFollowing = async () => {
    const res = await fetch(C.ROUTES.following(session?.user?.id));
    const following: User[] = await res.json();

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

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }

    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }, [success, errorMessage]);

  // #####################
  const { execute } = useAction(createFriend, {
    onSuccess: ({ data }) => {
      if (data?.errorMessage) {
        console.log('JSON RESPONSE:', JSON.stringify(errorMessage));

        setErrorMessage(data?.errorMessage);
        console.log(errorMessage);
      } else if (data?.user_followed?.id) {
        setErrorMessage(null);
        setSuccess(true);
        setUserFollowed(data?.user_followed?.name);

        setFollowing((oldFollowing) =>
          oldFollowing.set(data!.user_followed.id, data!.user_followed)
        );
      }
      setSubmitting(false);
    },
    onError: (res) => {
      alert(
        JSON.stringify(
          { ...res.input, ...getErrorMessgaeSuccess(res.error) },
          null,
          2
        )
      );
      setSubmitting(false);
    },
    onExecute: ({ input }) => {
      setSubmitting(true);
      console.log('Friend submitting...', input);
    },
  });

  // #####################

  const onSubmit = async (friendData: FriendFormData) => {
    setSubmitting(true);

    let responseJson: CreateFriendResponse | null = null;

    try {
      const res = await fetch(C.ROUTES.friends(session?.user?.id), {
        method: 'POST',
        body: JSON.stringify(friendData),
      });

      responseJson = await res.json();

      if (!res.ok) {
        throw new Error('Failed to create new following');
      }
      if (responseJson) {
        setFollowing((oldFollowing) =>
          oldFollowing.set(
            responseJson!.user_followed.id,
            responseJson!.user_followed
          )
        );
      } else {
        throw new Error('Response undefined');
      }

      setErrorMessage(null);
      setSuccess(true);
      setUserFollowed(responseJson.user_followed.name);
    } catch (error) {
      console.log('JSON RESPONSE:', JSON.stringify(responseJson));

      setErrorMessage(responseJson?.message);
      console.log(errorMessage);
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
              <p className='text-xs'>
                {following.name} ({following.email}){' '}
              </p>
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
          schema={createFriendSchema}
          fields={fields}
          execute={(a) => {
            console.log('a', a);
            execute(a);
          }}
          // submitting={submitting}
        />
        {errorMessage && (
          <div className='mt-4 rounded border border-red-400 bg-red-100 p-3 text-red-700'>
            <p>Error: {errorMessage}</p>
          </div>
        )}
        {success && (
          <div className='mt-4 rounded border border-green-600 bg-green-700 p-3 text-white'>
            <p>Successfully followed {userFollowed}</p>
          </div>
        )}
      </FormLayout>
      {/* <Button onClick={getFollowers}>Get Followers</Button>
      <Button onClick={getFollowing}>Get Following</Button> */}
    </>
  );
}

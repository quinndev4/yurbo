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

export default function FriendsPage() {
  const { data: session } = useSession();
  const params = useParams();

  const { followees } = useUserData();
  const { followers } = useUserData();

  // const [followees, setFollowees] = useState<Map<string, Friend>>(Map());
  // const [followers, setFollowers] = useState<Map<string, Friend>>(Map());

  // [...followees].map(([id, followee]) => console.log('followee id:', id));

  // useEffect(() => {
  //   if (session?.user?.id) {
  //     if (params.userId === session.user.id) {
  //       window.history.replaceState(null, '', '/me/friends');
  //     }

  //     if (!['me', session.user.id].includes(params.userId as string)) {
  //       fetch(C.ROUTES.followees(params.userId as string), {
  //         cache: 'force-cache',
  //       })
  //         .then((res) => res.json())
  //         .then((res) => setFollowees(res));

  //       fetch(C.ROUTES.followers(params.userId as string), {
  //         cache: 'force-cache',
  //       })
  //         .then((res) => res.json())
  //         .then((res) => setFollowers(res));
  //     } else {
  //       setFollowees(myFollowees);
  //       setFollowers(myFollowers);
  //     }
  //   }
  // }, [params.userId, session?.user?.id, myFollowees, myFollowers]);

  console.log('Those I follow:\n', followees);

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

      router.push('/');
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
      <div>
        <h1>Following:</h1>
        {[...followees].map(([, followee]) => (
          <div key={followee.id}>
            <p>{followee.id}</p>
          </div>
        ))}

        <h1>Followers:</h1>

        {[...followers].map(([, follower]) => (
          <div key={follower.id}>
            <p>{follower.id}</p>
          </div>
        ))}
      </div>

      <FormLayout title='Follow User'>
        <FormBuilder
          schema={friendFormSchema}
          fields={fields}
          onSubmit={onSubmit}
          submitting={submitting}
        />
      </FormLayout>
    </>
  );
}

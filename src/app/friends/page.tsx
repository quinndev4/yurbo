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
import UsersTable from '@/components/UsersTable';
import Button from '@/components/Button';

interface User {
  id: string;
  name: string;
}

export default function FriendsPage() {
  const { data: session } = useSession();
  const params = useParams();

  const { following, followers, setFollowers, setFollowing } = useUserData();

  // const [followers, setFollowers] = useState<Map<string, Friend>>(Map());
  // const [following, setFollowing] = useState<Map<string, Friend>>(Map());

  // useEffect(() => {

  // }, [myFollowers, myFollowing]);

  const sampleUsers: User[] = [
    { id: 'u1', name: 'Alice Johnson' },
    { id: 'u2', name: 'Bob Smith' },
    { id: 'u3', name: 'Carol Williams' },
    { id: 'u4', name: 'David Brown' },
  ];

  const getFollowing = async () => {
    const res = await fetch(C.ROUTES.following(session?.user?.id));
    const following: Friend[] = await res.json();

    console.log('following:', following);
  };

  const getFollowers = async () => {
    const res = await fetch(C.ROUTES.followers(session?.user?.id));
    const followers: Friend[] = await res.json();

    console.log('followers:', followers);
  };

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

  // console.log('Those I follow:\n', following);

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
      <div>
        <h1>Following:</h1>
        {[...following].map(([, following]) => (
          <div key={following.id}>
            <p>{following.id}</p>
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
      <Button onClick={getFollowers}>Get Followers</Button>
      <Button onClick={getFollowing}>Get Following</Button>
    </>
  );
}

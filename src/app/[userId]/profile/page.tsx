'use client';

import MapWithSidebar from '@/components/SideBarMap';
import { useUserData } from '@/components/UserDataProvider';
import { C } from '@/constants/constants';
import { Friend, Yurbo, User } from '@/types/types';
import { Map } from 'immutable';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserProfilePage() {
  const params = useParams();

  const { data: session } = useSession();

  const { yurbos: myYurbos } = useUserData();

  const [following, setFollowing] = useState<Map<string, User>>(Map());
  const [followers, setFollowers] = useState<Map<string, User>>(Map());
  const [userData, setUserData] = useState<Map<string, User>>(Map());
  const [yurbos, setYurbos] = useState<Map<string, Yurbo>>(Map());

  useEffect(() => {
    const getFollowers = async () => {
      const res = await fetch(C.ROUTES.followers(session?.user?.id));
      const followers: User[] = await res.json();

      const followersMap = Map(
        followers.map((followers) => [followers.id, followers])
      );
      setFollowers(followersMap);

      console.log('followers:', followers);
    };

    const getFollowing = async () => {
      const res = await fetch(C.ROUTES.following(session?.user?.id));
      const following: User[] = await res.json();

      const followingMap = Map(
        following.map((following) => [following.id, following])
      );
      setFollowing(followingMap);

      console.log('following:', following);
    };

    getFollowers();
  }, []);

  return (
    <>
      <div classname='px-4 pt-2'>
        <h1 className='text-2xl font-bold'>David</h1>
        <h3>Followers: {followers.size}</h3>
        <h3>Following: {following.size}</h3>
      </div>
    </>
  );
}

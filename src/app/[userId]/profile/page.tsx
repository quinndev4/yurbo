'use client';

import { useUserData } from '@/components/UserDataProvider';
import { C } from '@/constants/constants';
import { Yurbo, User } from '@/types/types';
import { Map } from 'immutable';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserProfilePage() {
  const params = useParams();

  const { data: session } = useSession();

  // My info shit
  const {
    following: myFollowing,
    followers: myFollowers,
    yurbos: myYurbos,
  } = useUserData();

  const [following, setFollowing] = useState<Map<string, User>>(Map());
  const [followers, setFollowers] = useState<Map<string, User>>(Map());
  const [yurbos, setYurbos] = useState<Map<string, Yurbo>>(Map());
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const getFollowers = async (id: string) => {
      const res = await fetch(C.ROUTES.followers(id));
      const followers: User[] = (await res.json()).ret;

      const followersMap = Map(
        followers.map((follower) => [follower.id, follower])
      );
      setFollowers(followersMap);

      console.log('followers:', followers);
    };

    const getFollowing = async (id: string) => {
      const res = await fetch(C.ROUTES.following(id));
      const following: User[] = (await res.json()).ret;

      const followingMap = Map(
        following.map((following) => [following.id, following])
      );
      setFollowing(followingMap);

      console.log('following:', following);
    };

    const getYurbos = async (id: string) => {
      const res = await fetch(C.ROUTES.yurbos(id));
      const yurbos: Yurbo[] = (await res.json()).yurbos;

      const yurbosMap = Map(yurbos.map((yurbo) => [yurbo.id, yurbo]));
      setYurbos(yurbosMap);

      console.log('yurbos:', yurbos);
    };

    const getUserData = async (id: string) => {
      const res = await fetch(C.ROUTES.user(id));
      const user: User = (await res.json()).ret;

      setUserData(user);

      console.log('user:', user);
    };

    if (session?.user?.id) {
      if (params.userId === session.user.id) {
        setYurbos(myYurbos);
        setFollowers(myFollowers);
        setFollowing(myFollowing);
        setUserData(session.user as User);
      } else {
        if (params.userId) {
          const userId = Array.isArray(params.userId)
            ? params.userId[0]
            : params.userId;
          getFollowers(userId);
          getFollowing(userId);
          getYurbos(userId);
          getUserData(userId);
        }
      }
    }
  }, [
    session?.user?.id,
    params.userId,
    myFollowers,
    myFollowing,
    myYurbos,
    session?.user,
  ]);

  return (
    <>
      <div className='space-y-3 p-4 px-4 pt-2'>
        <div>
          <h1 className='text-2xl font-bold'>{userData?.name}</h1>{' '}
          <p className='text-xs'>@{userData?.email}</p>
        </div>

        <div className='mt-[10px] flex space-x-6'>
          <h3 className=''>Followers: {followers.size}</h3>
          <h3 className=''>Following: {following.size}</h3>
        </div>
        <h3>Number of yurbos: {yurbos.size}</h3>
      </div>
    </>
  );
}

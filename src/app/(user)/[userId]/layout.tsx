'use client';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Map } from 'immutable';

import { useSelectedUser } from '@/providers/SelectedUserProvider';
import { useUser } from '@/providers/UserProvider';
import type { Event, Location, Yurbo, User } from '@/types/types';
import { C } from '@/constants/constants';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();

  const { data: session } = useSession();

  const { yurbos, locations, events, followers, following } = useUser();

  const {
    setUser,
    setYurbos,
    setEvents,
    setLocations,
    setFollowers,
    setFollowing,
  } = useSelectedUser();

  useEffect(() => {
    const userId = params.userId as string;

    const fetchSelectedData = async () => {
      console.log('start');
      try {
        if (session?.user?.id) {
          console.log('in', userId);

          const [user, yurbos, events, locations, following, followers]: [
            User,
            Yurbo[],
            Event[],
            Location[],
            User[],
            User[],
          ] = await Promise.all([
            fetch(C.ROUTES.user(userId), {
              cache: 'force-cache',
            })
              .then((res) => res.json())
<<<<<<< HEAD
              .then((res) => res.user),
=======
              .then((res) => res.user[0]),
>>>>>>> Adding shit that i changed - im adding a commit message!
            fetch(C.ROUTES.yurbos(userId), {
              cache: 'force-cache',
            })
              .then((res) => res.json())
              .then((res) => res.yurbos),
            fetch(C.ROUTES.events(userId), {
              cache: 'force-cache',
            })
              .then((res) => res.json())
              .then((res) => res.events),
            fetch(C.ROUTES.locations(userId), {
              cache: 'force-cache',
            })
              .then((res) => res.json())
              .then((res) => res.locations),
            fetch(C.ROUTES.following(userId), {
              cache: 'force-cache',
            })
              .then((res) => res.json())
              .then((res) => res.ret),
            fetch(C.ROUTES.followers(userId), {
              cache: 'force-cache',
            })
              .then((res) => res.json())
              .then((res) => res.ret),
          ]);

          console.log('selected user data', userId, {
            user,
            yurbos,
            events,
            locations,
            following,
            followers,
          });

          const eventMap = Map(events.map((event) => [event.id, event]));
          const locationMap = Map(
            locations.map((location) => [location.id, location])
          );

          const yurboMap = Map(
            yurbos.map((yurbo) => {
              const location =
                yurbo.location_id && locationMap.get(yurbo.location_id);

              if (location) {
                ({ lat: yurbo.lat, long: yurbo.long } = location);
              }

              return [yurbo.id, yurbo];
            })
          );

          const followingMap = Map(
            following.map((following) => [following.id, following])
          );

          const followerMap = Map(
            followers.map((follower) => [follower.id, follower])
          );

          setUser(user);
          setYurbos(yurboMap);
          setEvents(eventMap);
          setLocations(locationMap);
          setFollowing(followingMap);
          setFollowers(followerMap);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    if (session?.user?.id) {
      console.log('yes', window.location.pathname, userId);

      if (userId === 'me') {
        window.history.replaceState(
          null,
          '',
          window.location.pathname.replace('me', session.user.id)
        );
      }

      if (!['me', session.user.id].includes(userId)) {
        console.log('heyyy??');
        fetchSelectedData();
      } else {
        setUser(session.user as User);
        setYurbos(yurbos);
        setEvents(events);
        setLocations(locations);
        setFollowers(followers);
        setFollowing(following);
      }
    }
  }, [
    session?.user,
    params.userId,
    yurbos,
    events,
    locations,
    followers,
    following,
    setUser,
    setYurbos,
    setEvents,
    setLocations,
    setFollowers,
    setFollowing,
  ]);

  return children;
}

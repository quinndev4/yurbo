'use client';

import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Map } from 'immutable';

import { useSelectedUser } from '@/providers/SelectedUserProvider';
import { useUserData } from '@/providers/UserProvider';
import type { Event, Location, Yurbo, User } from '@/types/types';
import { C } from '@/constants/constants';

export default function UserLayout() {
  const params = useParams();

  const { data: session } = useSession();

  const { yurbos, locations, events, followers, following } = useUserData();

  const { setYurbos, setEvents, setLocations, setFollowers, setFollowing } =
    useSelectedUser();

  useEffect(() => {
    const fetchSelectedData = async () => {
      try {
        if (session?.user?.id) {
          const [yurbos, events, locations, following, followers]: [
            Yurbo[],
            Event[],
            Location[],
            User[],
            User[],
          ] = await Promise.all([
            fetch(C.ROUTES.yurbos(session.user.id), {
              cache: 'force-cache',
            })
              .then((res) => res.json())
              .then((res) => res.yurbos),
            fetch(C.ROUTES.events(session.user.id), {
              cache: 'force-cache',
            })
              .then((res) => res.json())
              .then((res) => res.events),
            fetch(C.ROUTES.locations(session.user.id), {
              cache: 'force-cache',
            })
              .then((res) => res.json())
              .then((res) => res.locations),
            fetch(C.ROUTES.following(session.user.id), {
              cache: 'force-cache',
            })
              .then((res) => res.json())
              .then((res) => res.ret),
            fetch(C.ROUTES.followers(session.user.id), {
              cache: 'force-cache',
            })
              .then((res) => res.json())
              .then((res) => res.ret),
          ]);

          console.log('selected user data', {
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

    if (session?.user?.id && session.user.id !== params.userId) {
      fetchSelectedData();
    } else {
      setYurbos(yurbos);
      setEvents(events);
      setLocations(locations);
      setFollowers(followers);
      setFollowing(following);
    }
  }, [
    session?.user?.id,
    params.userId,
    yurbos,
    events,
    locations,
    followers,
    following,
    setYurbos,
    setEvents,
    setLocations,
    setFollowers,
    setFollowing,
  ]);

  return <div>layout</div>;
}

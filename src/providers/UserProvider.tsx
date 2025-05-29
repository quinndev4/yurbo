'use client';

import { Map } from 'immutable';
import { C } from '@/constants/constants';
import type {
  Event,
  Location,
  Yurbo,
  User,
  UserDataContext,
} from '@/types/types';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext<UserDataContext | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null)
    throw new Error('useUserData must be used within a UserProvider');
  return context;
};

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [yurbos, setYurbos] = useState<Map<string, Yurbo>>(Map());
  const [events, setEvents] = useState<Map<string, Event>>(Map());
  const [locations, setLocations] = useState<Map<string, Location>>(Map());
  const [following, setFollowing] = useState<Map<string, User>>(Map());
  const [followers, setFollowers] = useState<Map<string, User>>(Map());

  useEffect(() => {
    (async () => {
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

          console.log('user data', {
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
    })();
  }, [session?.user?.id]);

  return (
    <UserContext.Provider
      value={{
        yurbos,
        setYurbos,
        events,
        setEvents,
        locations,
        setLocations,
        following,
        setFollowing,
        followers,
        setFollowers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

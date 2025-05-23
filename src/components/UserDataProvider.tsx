'use client';

import { Map } from 'immutable';
import { C } from '@/constants/constants';
import { Event, Location, Yurbo, Friend } from '@/types/types';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';

interface UserDataContext {
  yurbos: Map<string, Yurbo>;
  setYurbos: React.Dispatch<React.SetStateAction<Map<string, Yurbo>>>;
  events: Map<string, Event>;
  setEvents: React.Dispatch<React.SetStateAction<Map<string, Event>>>;
  locations: Map<string, Location>;
  setLocations: React.Dispatch<React.SetStateAction<Map<string, Location>>>;
  followees: Map<string, Friend>;
  setFollowees: React.Dispatch<React.SetStateAction<Map<string, Friend>>>;
  followers: Map<string, Friend>;
  setFollowers: React.Dispatch<React.SetStateAction<Map<string, Friend>>>;
}

const UserDataContext = createContext<UserDataContext | null>(null);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === null)
    throw new Error('useUserData must be used within a UserDataProvider');
  return context;
};

export default function UserDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [yurbos, setYurbos] = useState<Map<string, Yurbo>>(Map());
  const [events, setEvents] = useState<Map<string, Event>>(Map());
  const [locations, setLocations] = useState<Map<string, Location>>(Map());
  const [followees, setFollowees] = useState<Map<string, Friend>>(Map());
  const [followers, setFollowers] = useState<Map<string, Friend>>(Map());

  useEffect(() => {
    (async () => {
      try {
        if (session?.user?.id) {
          const [yurbos, events, locations, followees, followers]: [
            Yurbo[],
            Event[],
            Location[],
            Friend[],
            Friend[],
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
            fetch(C.ROUTES.followees(session.user.id), {
              cache: 'force-cache',
            })
              .then((res) => res.json())
              .then((res) => res.followees),
            fetch(C.ROUTES.followers(session.user.id), {
              cache: 'force-cache',
            })
              .then((res) => res.json())
              .then((res) => res.followers),
          ]);

          console.log('user data', {
            yurbos,
            events,
            locations,
            followees,
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

          const followeeMap = Map(
            followees.map((followee) => [followee.id, followee])
          );

          const followerMap = Map(
            followers.map((follower) => [follower.id, follower])
          );

          setYurbos(yurboMap);
          setEvents(eventMap);
          setLocations(locationMap);
          setFollowees(followeeMap);
          setFollowers(followerMap);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    })();
  }, [session?.user?.id]);

  return (
    <UserDataContext.Provider
      value={{
        yurbos,
        setYurbos,
        events,
        setEvents,
        locations,
        setLocations,
        followees,
        setFollowees,
        followers,
        setFollowers,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

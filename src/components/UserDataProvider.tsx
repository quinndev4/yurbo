'use client';

import { C } from '@/constants/constants';
import { Event, Location, Yurbo } from '@/types/types';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useState } from 'react';

interface UserDataContext {
  yurbos: Yurbo[];
  setYurbos: React.Dispatch<React.SetStateAction<Yurbo[]>>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
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
  const [yurbos, setYurbos] = useState<Yurbo[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (session?.user?.id) {
          const [yurbos, events, locations] = await Promise.all([
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
          ]);

          console.log('user data', { yurbos, events, locations });

          setYurbos(yurbos);
          setEvents(events);
          setLocations(locations);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    })();
  }, [session?.user?.id]);

  return (
    <UserDataContext.Provider
      value={{ yurbos, setYurbos, events, setEvents, locations, setLocations }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

'use client';

import { Event, Location, Yurbo } from '@/types/types';
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
  const [yurbos, setYurbos] = useState<Yurbo[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [yurbos, events, locations] = await Promise.all([
          fetch('/api/yurbo', { cache: 'force-cache' })
            .then((res) => res.json())
            .then((res) => res.yurbos),
          fetch('/api/event', { cache: 'force-cache' })
            .then((res) => res.json())
            .then((res) => res.events),
          fetch('/api/location', { cache: 'force-cache' })
            .then((res) => res.json())
            .then((res) => res.locations),
        ]);

        console.log('user data', { yurbos, events, locations });

        setYurbos(yurbos);
        setEvents(events);
        setLocations(locations);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <UserDataContext.Provider
      value={{ yurbos, setYurbos, events, setEvents, locations, setLocations }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

'use client';

import { Map } from 'immutable';
import type {
  Event,
  Location,
  Yurbo,
  User,
  UserDataContext,
} from '@/types/types';
import { createContext, useContext, useState } from 'react';

interface SelectedUserContext extends UserDataContext {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const SelectedUserContext = createContext<SelectedUserContext | null>(null);

export const useSelectedUser = () => {
  const context = useContext(SelectedUserContext);
  if (context === null)
    throw new Error('useUserData must be used within a UserProvider');
  return context;
};

export default function SelectedUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | undefined>();
  const [yurbos, setYurbos] = useState<Map<string, Yurbo>>(Map());
  const [events, setEvents] = useState<Map<string, Event>>(Map());
  const [locations, setLocations] = useState<Map<string, Location>>(Map());
  const [following, setFollowing] = useState<Map<string, User>>(Map());
  const [followers, setFollowers] = useState<Map<string, User>>(Map());

  return (
    <SelectedUserContext.Provider
      value={{
        user,
        setUser,
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
    </SelectedUserContext.Provider>
  );
}

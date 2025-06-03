'use client';

import { useEffect, useState } from 'react';
import { C } from '@/constants/constants';
import debounce from 'lodash/debounce';
import { User, Location, Yurbo } from '@/types/types';
import { Map } from 'immutable';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function DiscoverPage() {
  const [loading, setLoading] = useState(false);
  const [resultMap, setResultMap] = useState<
    Map<string, User> | Map<string, Yurbo> | Map<string, Location>
  >(Map<string, User>());
  const [searchMode, setSearchMode] = useState<
    'Profiles' | 'Yurbos' | 'Locations'
  >('Profiles');

  const { data: session } = useSession();

  const tabColor = (_searchMode: string, tab: string) => {
    return tab === _searchMode ? 'font-bold border border-gray-200' : '';
  };

  const getUsers = async (query: string) => {
    const ret = await (await fetch(C.ROUTES.users(query))).json();
    const users: User[] = ret.users;
    const resultMap = Map(users.map((user) => [user.id, user]));
    setResultMap(resultMap);
    setLoading(false);
    return resultMap;
  };

  const getLocations = async (query: string) => {
    console.log('searching for locales with query', query);
    const ret = await (
      await fetch(C.ROUTES.locations(session?.user?.id, query))
    ).json();
    const locs: Location[] = ret.locations;
    const resultMap = Map(locs.map((loc) => [loc.id, loc]));
    setResultMap(resultMap);
    setLoading(false);
    return resultMap;
  };

  const getYurbos = async (query: string) => {
    // TBD -- placeholder to get users rn
    const ret = await (await fetch(C.ROUTES.users(query))).json();
    const users: User[] = ret.users;
    const resultMap = Map(users.map((user) => [user.id, user]));
    setResultMap(resultMap);
    setLoading(false);
    return resultMap;
  };

  const debouncedResults = debounce(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('debouncer run on', e.target.value);
      const query = e.target.value.toLowerCase().replace(/[^a-z0-9]/gi, '');

      if (query) {
        setLoading(true);

        const ret =
          searchMode === 'Profiles'
            ? getUsers(query)
            : searchMode === 'Yurbos'
              ? getYurbos(query)
              : getLocations(query);

        console.log('THE DEBOUNCED RESULT:', resultMap);
      } else {
        setResultMap(Map<string, User>());
      }
    },
    500
  );

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  return (
    <div className='flex flex-col'>
      <h1 className='text-2xl'>Discover</h1>
      <div className='flex border-b border-gray-200'>
        {['Profiles', 'Yurbos', 'Locations'].map((tab) => {
          return (
            <button
              className={`rounded px-4 py-1 ${tabColor(searchMode, tab)} text-white`}
              key={tab}
              onClick={() => {
                setSearchMode(tab as 'Profiles' | 'Yurbos' | 'Locations');
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <input
        className=''
        type='text'
        onChange={debouncedResults}
        placeholder={`Search for ${searchMode}`}
      />

      {loading ? (
        'loading...'
      ) : ['Profiles', 'Yurbos'].includes(searchMode) ? (
        <ul className='flex flex-col'>
          {[...resultMap].map(([, user]) => {
            return (
              <Link key={user.id} href={`/${user.id}/profile/`}>
                {(user as User).email}
              </Link>
            );
          })}
        </ul>
      ) : searchMode === 'Locations' ? (
        <ul className='flex flex-col'>
          {[...resultMap].map(([, location]) => {
            return <li key={location.id}>{location.name}</li>;
          })}
        </ul>
      ) : null}
    </div>
  );
}

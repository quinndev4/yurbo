'use client';

import { useEffect, useState } from 'react';
import { C } from '@/constants/constants';
import { useSession } from 'next-auth/react';
import debounce from 'lodash/debounce';
import { User } from '@/types/types';
import { Map } from 'immutable';
import Link from 'next/link';

export default function DiscoverPage() {
  const [loading, setLoading] = useState(false);
  const [resultMap, setResultMap] = useState<Map<string, User>>(Map());
  const [searchMode, setSearchMode] = useState<'profile' | 'yurbo'>('profile');

  const debouncedResults = debounce(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('debouncer run on', e.target.value);
      const query = e.target.value.toLowerCase().replace(/[^a-z0-9]/gi, '');

      if (query) {
        setLoading(true);
        const ret = await (await fetch(C.ROUTES.users(query))).json();
        const users: User[] = ret.users;
        const resultMap = Map(users.map((user) => [user.id, user]));
        setResultMap(resultMap);
        setLoading(false);
        console.log('THE DEBOUNCED RESULT:', resultMap);
      } else {
        setResultMap(Map());
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
      <input
        className=''
        type='text'
        onChange={debouncedResults}
        placeholder={`Search for ${searchMode}`}
      />

      {loading ? (
        'loading...'
      ) : (
        <ul className='flex flex-col'>
          {[...resultMap].map(([, user]) => {
            return (
              <Link key={user.id} href={`/${user.id}/profile/`}>
                {user.email}
              </Link>
            );
          })}
        </ul>
      )}
    </div>
  );
}

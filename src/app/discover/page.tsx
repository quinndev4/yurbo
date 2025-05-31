'use client';

import { useEffect, useState, useMemo } from 'react';
import { C } from '@/constants/constants';
import { useSession } from 'next-auth/react';
import Button from '@/components/Button';
import debounce from 'lodash/debounce';
import { User } from '@/types/types';
import { Map } from 'immutable';
import Link from 'next/link';

export default function DiscoverPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [resultMap, setResultMap] = useState<Map<string, User>>(Map());
  const [searchMode, setSearchMode] = useState<'profile' | 'yurbo'>('profile');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data: session } = useSession();

  const getUsers = async () => {
    const res = await (
      await fetch(C.ROUTES.user(session?.user?.id, query))
    ).json();

    console.log('query:', query);

    console.log('user list:', res);
  };

  const debouncedResults = useMemo(() => {
    return debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value.toLowerCase().replace(/[^a-z0-9]/gi, ''));
      console.log('debouncer run on', e.target.value);
      const ret = await (
        await fetch(
          C.ROUTES.user(
            session?.user?.id,
            e.target.value.toLowerCase().replace(/[^a-z0-9]/gi, '')
          )
        )
      ).json();

      const users: User[] = ret.user;
      const resultMap = Map(users.map((user) => [user.id, user]));
      setResultMap(resultMap);
      console.log('THE DEBOUNCED RESULT:', resultMap);
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  return (
    <div>
      <h1 className='text-2xl'>Discover</h1>
      <Button onClick={getUsers}>Get Users</Button>
      <input
        className=''
        type='text'
        onChange={debouncedResults}
        placeholder={`Search for ${searchMode}`}
      ></input>
      <ul className='flex flex-col'>
        {query &&
          [...resultMap].map(([, user]) => {
            return (
              <Link key={user.id} href={`/${user.id}/profile/`}>
                {user.email}
              </Link>
            );
          })}
      </ul>
    </div>
  );
}

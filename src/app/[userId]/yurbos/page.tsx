'use client';

import MapWithSidebar from '@/components/SideBarMap';
import TestMapBasic from '@/components/TestMap';
import { useUserData } from '@/components/UserDataProvider';
import { C } from '@/constants/constants';
import { Yurbo } from '@/types/types';
import { Map } from 'immutable';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserYurbosPage() {
  const params = useParams();

  const { data: session } = useSession();

  const { yurbos: myYurbos } = useUserData();

  const [yurbos, setYurbos] = useState<Map<string, Yurbo>>(Map());

  useEffect(() => {
    if (session?.user?.id) {
      if (params.userId === session.user.id) {
        window.history.replaceState(null, '', '/me/yurbos');
      }

      if (!['me', session.user.id].includes(params.userId as string)) {
        fetch(C.ROUTES.yurbos(params.userId as string), {
          cache: 'force-cache',
        })
          .then((res) => res.json())
          .then((res) => setYurbos(res.yurbos));
      } else {
        setYurbos(myYurbos);
      }
    }
  }, [params.userId, session?.user?.id, myYurbos]);

  return <MapWithSidebar />;
}

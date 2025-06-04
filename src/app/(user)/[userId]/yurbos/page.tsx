'use client';

import MapWithSidebar from '@/components/SideBarMap';
// import { manyYurbos } from '@/mocks/manyYurbos';
// import { useSelectedUser } from '@/providers/SelectedUserProvider';
import { manyYurbos as yurbos } from '@/mocks/manyYurbos';

export default function UserYurbosPage() {
  // const { yurbos } = useSelectedUser();

  return <MapWithSidebar yurbos={yurbos} />;
}

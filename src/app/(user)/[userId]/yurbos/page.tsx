'use client';

import MapWithSidebar from '@/components/SideBarMap';
import { useSelectedUser } from '@/providers/SelectedUserProvider';

export default function UserYurbosPage() {
  const { yurbos } = useSelectedUser();

  return <MapWithSidebar yurbos={yurbos} />;
}

import SelectedUserProvider from '@/providers/SelectedUserProvider';

export default function RootUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SelectedUserProvider>{children}</SelectedUserProvider>;
}

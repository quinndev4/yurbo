import SignInButton from '@/components/SignInButton';

export default function LoginPage() {
  return (
    <main className='flex h-full flex-col items-center justify-center'>
      <h1 className='mb-20 text-6xl font-bold'>Yurbo</h1>

      <SignInButton />
    </main>
  );
}

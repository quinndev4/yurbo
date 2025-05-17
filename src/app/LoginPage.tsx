import SignInButton from '@/components/SignInButton';

export default function LoginPage() {
  return (
    <div className='flex flex-col'>
      <h1 className='mb-20 text-3xl font-bold'>Yurbo</h1>

      <SignInButton />
    </div>
  );
}

import Link from 'next/link';

export default function LinkButton({
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      {...props}
      href={props.href || '/'}
      className='bg-secondary-1 hover:bg-secondary-dark m-2 rounded-lg border-2 border-white p-2 px-8 text-center transition-transform duration-200 hover:scale-110'
    >
      {children}
    </Link>
  );
}

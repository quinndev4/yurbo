export default function FormLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className='border-primary-light mx-auto rounded-lg border-2 p-6 shadow'>
      <h1 className='mb-4 text-2xl font-semibold'>{title}</h1>
      {children}
    </section>
  );
}

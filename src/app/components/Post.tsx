interface Props {
  post: { title: string; description: string; location: string };
}

export default function Post({ post }: Props) {
  return (
    <div className='flex flex-col w-full border-white border-2 rounded-lg m-4'>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <p>{post.location}</p>
    </div>
  );
}

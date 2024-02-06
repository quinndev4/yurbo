import Post from './Post';

const posts = [
  { title: '#1', description: 'yo', location: 'aaa' },
  { title: '#2', description: 'ay', location: 'bbb' },
  { title: '#3', description: 'g', location: 'ccc' },
  { title: '#4', description: 'g', location: 'ccc' },
  { title: '#5', description: 'g', location: 'ccc' },
  { title: '#6', description: 'g', location: 'ccc' },
];

export default function Posts() {
  return (
    <div className='flex flex-col m-5 items-center overflow-hidden'>
      {posts.map((post) => (
        <Post post={post} key={post.title} />
      ))}
    </div>
  );
}

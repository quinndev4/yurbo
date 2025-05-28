interface User {
  id: string;
  name: string;
}

interface Props {
  tableName: string;
  users: User[];
}

export default function UsersTable({ users, tableName }: Props) {
  return (
    <div className='m-5 flex flex-col items-center overflow-hidden'>
      <table>
        <thead>
          <tr>{tableName}</tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

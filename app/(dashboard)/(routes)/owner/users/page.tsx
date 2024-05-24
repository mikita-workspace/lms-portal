import { getUsers } from '@/actions/users/get-users';

import { UsersList } from './_components/users-list/users-list';

const UsersPage = async () => {
  const users = await getUsers({});

  return (
    <div className="p-6 flex flex-col mb-6">
      <h1 className="text-2xl font-medium mb-12">Users Management</h1>
      <UsersList users={users} />
    </div>
  );
};

export default UsersPage;

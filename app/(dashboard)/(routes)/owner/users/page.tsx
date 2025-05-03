import { getUsers } from '@/actions/users/get-users';

import { UsersList } from './_components/users-list/users-list';

type UsersPageProps = {
  searchParams: Promise<{ pageIndex: string; pageSize: string; search?: string }>;
};

const UsersPage = async (props: UsersPageProps) => {
  const searchParams = await props.searchParams;
  const { pageCount, users } = await getUsers(searchParams);

  return (
    <div className="p-6 flex flex-col mb-6">
      <h1 className="text-2xl font-medium mb-12">Users Management</h1>
      <UsersList pageCount={pageCount} users={users} />
    </div>
  );
};

export default UsersPage;

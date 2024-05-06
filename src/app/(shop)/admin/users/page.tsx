
export const revalidate = 0;
import { getPaginateOrders, getPaginatedUsers } from '@/actions';
import { Title } from '@/components';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { IoCardOutline } from 'react-icons/io5';
import { UsersTable } from './ui/UsersTable';


export default async function UsersPage() {

  const { ok, users = [] } = await getPaginatedUsers();

  if (!ok) {
    redirect('/auth/login');
  }


  return (
    <>
      <Title title="Mantenimienotos de usuario" />

      <div className="mb-10">
        <UsersTable users={users} />
      </div>
    </>
  );
}
import { useQuery } from '@tanstack/react-query';
import { listMembers } from '../../features/members/api';
import { useState } from 'react';
import Pagination from '../../components/ui/Pagination';
import { PAGE_SIZE } from '../../static/constants';
import { Link } from 'react-router-dom';

export default function Members() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['members', page],
    queryFn: () => listMembers({ page, size: PAGE_SIZE }),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">회원 관리</h1>
      {isLoading ? (
        <div className="skeleton h-24 w-full" />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>닉네임</th>
                <th>권한</th>
                <th>가입일</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.content.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.email}</td>
                  <td>{m.username}</td>
                  <td>{m.role}</td>
                  <td>{m.createdAt?.slice(0, 10)}</td>
                  <td>
                    <Link className="btn btn-sm" to={`/admin/members/${m.id}`}>
                      상세
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        page={data?.number ?? 0}
        totalPages={data?.totalPages ?? 0}
        onPageChange={setPage}
      />
    </div>
  );
}

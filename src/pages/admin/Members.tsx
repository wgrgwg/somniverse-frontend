import { useQuery } from '@tanstack/react-query';
import { listMembers } from '../../features/members/api';
import { useState } from 'react';
import Pagination from '../../components/ui/Pagination';
import { PAGE_SIZE } from '../../static/constants';
import { Link } from 'react-router-dom';

export default function Members() {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['members', page, searchKeyword],
    queryFn: () =>
      listMembers({ page, size: PAGE_SIZE, keyword: searchKeyword }),
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(0);
    setSearchKeyword(keyword);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">회원 관리</h1>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="이메일 또는 닉네임"
              className="input input-bordered w-full max-w-xs"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              검색
            </button>
          </form>
        </div>
      </div>

      {isLoading ? (
        <div className="skeleton h-64 w-full" />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
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

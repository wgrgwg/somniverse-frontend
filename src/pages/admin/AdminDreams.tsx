import { useEffect, useState } from 'react';
import { getDreamsForAdmin } from '../../features/dreams/api';
import type { Dream } from '../../features/dreams/types';
import Pagination from '../../components/ui/Pagination';
import { Link } from 'react-router-dom';

export default function AdminDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const fetchDreams = () => {
    setLoading(true);
    getDreamsForAdmin(page, 10, includeDeleted)
      .then((res) => {
        setDreams(res.content);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDreams();
  }, [page, includeDeleted]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">관리자 꿈 목록</h1>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={includeDeleted}
            onChange={(e) => {
              setPage(0);
              setIncludeDeleted(e.target.checked);
            }}
          />
          <span className="text-sm">삭제된 꿈 포함</span>
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : dreams.length === 0 ? (
        <p>등록된 꿈이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {dreams.map((dream) => (
            <li key={dream.id} className="card bg-base-100 shadow-md p-4">
              <Link
                to={`/admin/dreams/${dream.id}?includeDeleted=${includeDeleted}`}
                className="text-xl font-semibold hover:underline"
              >
                [{dream.dreamDate}] {dream.title}
              </Link>
              <p className="text-sm text-gray-500">
                {dream.createdAt.slice(0, 10)} | {dream.authorUsername}
                {dream.isDeleted && (
                  <span className="ml-2 text-red-500 font-semibold">
                    (삭제됨)
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

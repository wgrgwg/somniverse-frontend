import { useEffect, useState } from 'react';
import { getPublicDreams } from '../../features/dreams/api';
import type { Dream } from '../../features/dreams/types';
import Pagination from '../../components/ui/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/AuthContext';

export default function Dreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<string>('createdAt,desc');
  const nav = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    setLoading(true);
    getPublicDreams(page, 5, sort)
      .then((res) => {
        setDreams(res.content);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, sort]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">공개 꿈 목록</h1>
        <div className="flex items-center gap-4">
          {user && (
            <button
              className="btn btn-primary"
              onClick={() => nav('/dreams/new')}
            >
              + 꿈일기 작성
            </button>
          )}
          <select
            className="select select-bordered"
            value={sort}
            onChange={(e) => {
              setPage(0);
              setSort(e.target.value);
            }}
          >
            <option value="createdAt,desc">최신 등록순</option>
            <option value="createdAt,asc">오래된 등록순</option>
            <option value="dreamDate,desc">꿈 날짜 최신순</option>
            <option value="dreamDate,asc">꿈 날짜 오래된순</option>
          </select>
        </div>
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
                to={`/dreams/${dream.id}`}
                className="text-xl font-semibold hover:underline"
              >
                [{dream.dreamDate}] {dream.title}
              </Link>
              <p className="text-sm text-gray-500">
                {dream.createdAt.slice(0, 10)} | {dream.authorUsername}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

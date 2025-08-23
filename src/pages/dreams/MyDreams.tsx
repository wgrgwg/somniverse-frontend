import { useEffect, useState } from 'react';
import { getMyDreams } from '../../features/dreams/api';
import type { Dream } from '../../features/dreams/types';
import Pagination from '../../components/ui/Pagination';
import { Link } from 'react-router-dom';

export default function MyDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMyDreams(page, 5)
      .then((res) => {
        setDreams(res.content);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">내 꿈 목록</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : dreams.length === 0 ? (
        <p>작성한 꿈이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {dreams.map((dream) => (
            <li key={dream.id} className="card bg-base-100 shadow-md p-4">
              <Link
                to={`/dreams/${dream.id}`}
                className="text-xl font-semibold"
              >
                {dream.title}
              </Link>
              <p className="text-sm text-gray-500">{dream.dreamDate}</p>
            </li>
          ))}
        </ul>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

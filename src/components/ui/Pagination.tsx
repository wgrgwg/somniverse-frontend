interface Props {
  page: number; // 현재 페이지 (0-indexed)
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6 space-x-2">
      <button
        className="btn btn-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        이전
      </button>

      <span className="px-3 py-2">
        {page + 1} / {totalPages}
      </span>

      <button
        className="btn btn-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page + 1 >= totalPages}
      >
        다음
      </button>
    </div>
  );
}

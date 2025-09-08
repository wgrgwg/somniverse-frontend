interface Props {
  page: number; // 0-based index
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const currentPage = page + 1; // UI는 1-based
  const maxVisible = 5;

  const startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-6 space-x-2">
      <button
        className="btn btn-sm"
        onClick={() => onPageChange(0)}
        disabled={currentPage === 1}
      >
        {'«'}
      </button>

      <button
        className="btn btn-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={currentPage === 1}
      >
        {'‹'}
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`btn btn-sm ${
            p === currentPage ? 'btn-primary' : 'btn-outline'
          }`}
          onClick={() => onPageChange(p - 1)}
        >
          {p}
        </button>
      ))}

      <button
        className="btn btn-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={currentPage === totalPages}
      >
        {'›'}
      </button>

      <button
        className="btn btn-sm"
        onClick={() => onPageChange(totalPages - 1)}
        disabled={currentPage === totalPages}
      >
        {'»'}
      </button>
    </div>
  );
}

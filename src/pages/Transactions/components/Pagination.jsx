function Pagination({ count, page, setPage, pageSize }) {
  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-end mt-4">
      <nav className="flex items-center gap-1">
        <button
          className="px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-purple-700"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded ${page === idx + 1 ? "bg-purple-700 text-white" : "bg-gray-800 text-gray-300 hover:bg-purple-700"}`}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-purple-700"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          &gt;
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
import React from "react";
import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (
      (i === currentPage - 2 && currentPage > 3) ||
      (i === currentPage + 2 && currentPage < totalPages - 2)
    ) {
      pages.push("...");
    }
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={currentPage === 1}
        onClick={() => handlePageClick(currentPage - 1)}
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className="pagination-ellipsis">…</span>
        ) : (
          <button
            key={i}
            className={`pagination-btn ${p === currentPage ? "active" : ""}`}
            onClick={() => handlePageClick(p)}
            style={{
                width: p > 1000 ? "55px":(
                    p > 100 ? "45px" : "35px"
                ),
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        className="pagination-btn"
        disabled={currentPage === totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
      >
        →
      </button>
    </div>
  );
}

export default Pagination;

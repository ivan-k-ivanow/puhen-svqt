import "./Pagination.css";

function Chevron({ direction }) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
        </svg>
    );
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="pagination" aria-label="Страници">
            <button
                type="button"
                className="pagination-arrow"
                aria-label="Предишна страница"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <Chevron direction="left" />
            </button>

            {pages.map((page) => (
                <button
                    type="button"
                    key={page}
                    className={`pagination-page ${page === currentPage ? "active" : ""}`}
                    aria-label={`Страница ${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                className="pagination-arrow"
                aria-label="Следваща страница"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <Chevron direction="right" />
            </button>
        </nav>
    );
}

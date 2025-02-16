const PaginationComponent = ({ pageInfo, handelPageChange }) => {
  return (
    <>
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${!pageInfo.has_pre ? 'disabled' : ''}`}>
              <button
                type="button"
                onClick={() => handelPageChange(pageInfo.current_page - 1)}
                className="page-link"
              >
                上一頁
              </button>
            </li>
            {Array.from({ length: pageInfo.total_pages }).map((_, index) => {
              return (
                <li
                  className={`page-item ${
                    pageInfo.current_page === index + 1 ? 'active' : ''
                  }`}
                  key={index}
                >
                  <button
                    type="button"
                    onClick={() => handelPageChange(index + 1)}
                    className="page-link"
                  >
                    {index + 1}
                  </button>
                </li>
              );
            })}

            <li className={`page-item ${!pageInfo.has_next ? 'disabled' : ''}`}>
              <button
                type="button"
                onClick={() => handelPageChange(pageInfo.current_page + 1)}
                className="page-link"
              >
                下一頁
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default PaginationComponent;

import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import classes from "./Pagination.module.css";

const Pagination = ({
  tableDataCount,
  perPage,
  setPerPage,
  currentPagination,
  setCurrentPagination,
  perPageOption,
}) => {
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  perPage = +query.get("per") || perPageOption?.[0] || 5;
  setPerPage(perPage);
  currentPagination = +query.get("curr") || 1;
  setCurrentPagination(currentPagination);

  const paginationItems = [];
  paginationItems.push(
    <li
      key="laquo"
      className={`page-item ${
        currentPagination === 1 && `disabled ${classes.disabled}`
      }`}
      onClick={() => {
        if (currentPagination !== 1) {
          const queryParams = new URLSearchParams(location.search);
          if (queryParams.get("tab")) {
            queryParams.set("tab", queryParams.get("tab"));
          }
          queryParams.set("curr", 1);
          queryParams.set("per", perPage);
          setCurrentPagination(1);
          history.push({
            pathname: location.pathname,
            search: queryParams.toString(),
            hash: location.hash,
          });
        }
        return;
      }}
    >
      <span className="page-link" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </span>
    </li>
  );
  paginationItems.push(
    <li
      key="lsaquo"
      className={`page-item ${
        currentPagination === 1 && `disabled ${classes.disabled}`
      }`}
      onClick={() => {
        if (currentPagination !== 1) {
          const queryParams = new URLSearchParams(location.search);
          if (queryParams.get("tab")) {
            queryParams.set("tab", queryParams.get("tab"));
          }
          queryParams.set("curr", currentPagination - 1);
          queryParams.set("per", perPage);
          setCurrentPagination(currentPagination - 1);
          history.push({
            pathname: location.pathname,
            search: queryParams.toString(),
            hash: location.hash,
          });
        }
        return;
      }}
    >
      <span className="page-link" aria-label="Previous">
        <span aria-hidden="true">&lsaquo;</span>
      </span>
    </li>
  );
  let paginationItemsCount =
    tableDataCount % perPage === 0
      ? tableDataCount / perPage
      : tableDataCount / perPage + 1;
  paginationItemsCount = Math.floor(paginationItemsCount);
  for (let i = 1; i <= paginationItemsCount; i++) {
    paginationItems.push(
      <li
        key={i}
        className={`page-item ${currentPagination === i && "active"}`}
        onClick={() => {
          const queryParams = new URLSearchParams(location.search);
          if (queryParams.get("tab")) {
            queryParams.set("tab", queryParams.get("tab"));
          }
          queryParams.set("curr", i);
          queryParams.set("per", perPage);
          setCurrentPagination(i);
          history.push({
            pathname: location.pathname,
            search: queryParams.toString(),
            hash: location.hash,
          });
          return;
        }}
      >
        <span className="page-link">{i}</span>
      </li>
    );
  }
  paginationItems.push(
    <li
      key="rsaquo"
      className={`page-item ${
        (currentPagination === paginationItemsCount || tableDataCount === 0) &&
        `disabled ${classes.disabled}`
      }`}
      onClick={() => {
        if (currentPagination !== paginationItemsCount && tableDataCount > 0) {
          const queryParams = new URLSearchParams(location.search);
          if (queryParams.get("tab")) {
            queryParams.set("tab", queryParams.get("tab"));
          }
          queryParams.set("curr", +currentPagination + 1);
          queryParams.set("per", perPage);
          setCurrentPagination(currentPagination + 1);
          history.push({
            pathname: location.pathname,
            search: queryParams.toString(),
            hash: location.hash,
          });
        }
        return;
      }}
    >
      <span className="page-link" aria-label="Previous">
        <span aria-hidden="true">&rsaquo;</span>
      </span>
    </li>
  );
  paginationItems.push(
    <li
      key="raquo"
      className={`page-item ${
        (currentPagination === paginationItemsCount || tableDataCount === 0) &&
        `disabled ${classes.disabled}`
      }`}
      onClick={() => {
        if (currentPagination !== paginationItemsCount && tableDataCount > 0) {
          const queryParams = new URLSearchParams(location.search);
          if (queryParams.get("tab")) {
            queryParams.set("tab", queryParams.get("tab"));
          }
          queryParams.set("curr", paginationItemsCount);
          queryParams.set("per", perPage);
          setCurrentPagination(paginationItemsCount);
          history.push({
            pathname: location.pathname,
            search: queryParams.toString(),
            hash: location.hash,
          });
        }
        return;
      }}
    >
      <span className="page-link" aria-label="Previous">
        <span aria-hidden="true">&raquo;</span>
      </span>
    </li>
  );
  const perPageChangeHandler = (event) => {
    setPerPage(event.target.value);
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("tab")) {
      queryParams.set("tab", queryParams.get("tab"));
    }
    queryParams.set("curr", 1);
    queryParams.set("per", event.target.value);
    setCurrentPagination(1);
    history.push({
      pathname: location.pathname,
      search: queryParams.toString(),
      hash: location.hash,
    });
    return;
  };
  const pageRange = (page, pageCount) => {
    let start = page - 2,
      end = page + 2;
    if (end > pageCount) {
      start -= end - pageCount;
      end = pageCount;
    }
    if (start <= 0) {
      end += (start - 1) * -1;
      start = 1;
    }
    end = end > pageCount ? pageCount : end;
    return { start: start, end: end };
  };
  const { start, end } = pageRange(currentPagination, paginationItemsCount);
  return (
    <div className={classes.pagination}>
      <div className={classes.container}>
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            {paginationItems.slice(0, 2)}
            {paginationItems.slice(start + 1, end + 2)}
            {paginationItems.slice(
              paginationItemsCount + 2,
              paginationItemsCount + 4
            )}
          </ul>
        </nav>
        <label>
          Per Page
          <select
            className={`${classes.perPage} form-select`}
            aria-label="Default select example"
            value={perPage}
            onChange={perPageChangeHandler}
          >
            {perPageOption
              ? perPageOption.map((el, idx) => <option key={idx}>{el}</option>)
              : [5, 10, 15, 20].map((el, idx) => (
                  <option key={idx}>{el}</option>
                ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default Pagination;

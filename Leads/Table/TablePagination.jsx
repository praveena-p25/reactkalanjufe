import React, { useEffect, useState } from "react";

import Pagination from "../../projects/Pagination/Pagination";
import Table from "../../projects/Table/Table";

import classes from "./TablePagination.module.css";

const TablePagination = ({
  data,
  dataCount,
  passPaginationUp = () => {},
  perPageParent,
  currentPaginationParent,
  editHandler,
  deleteHandler,
}) => {
  //USESTATE FOR CURRENT PAGINATION
  const [perPage, setPerPage] = useState(5);
  const [currentPagination, setCurrentPagination] = useState(1);
  useEffect(() => {
    passPaginationUp({ currentPagination, perPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPagination, perPage]);
  return (
    <div className={classes.tablePagination}>
      <Table
        data={data}
        perPage={perPage}
        editHandler={editHandler}
        deleteHandler={deleteHandler}
        currentPagination={1}
        style={{ textAlign: "left" }}
        bordered={true}
      />
      <Pagination
        tableDataCount={dataCount}
        perPage={perPage}
        setPerPage={setPerPage}
        currentPagination={currentPagination}
        setCurrentPagination={setCurrentPagination}
      />
    </div>
  );
};

export default TablePagination;

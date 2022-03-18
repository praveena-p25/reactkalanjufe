import React from "react";
import Table from "../../ShowCompany/Table/Table";
import classes from "./Documents.module.css";

const Documents = ({ data }) => {
  return (
    <div className={classes.documents}>
      <Table data={data} />
    </div>
  );
};

export default Documents;

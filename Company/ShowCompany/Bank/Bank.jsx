import React from "react";
import Table from "../../../common/Table/Table";
import classes from "./Bank.module.css";

const Bank = ({ data }) => {
  return (
    <div className={classes.contacts}>
      <h5 className={classes.bankhead}>Bank Details</h5>
      <Table data={data} />
    </div>
  );
};

export default Bank;

import React from "react";
import Table from "../../../Company/ShowCompany/Table/Table";
import classes from "./BranchContact.module.css";

const BranchContact = ({ data }) => {
  return (
    <div className={`${classes.documents} ${classes.contactTable}`}>
      <Table data={data} mode={"edit"} tabletype={"contact"} page="contact" />
    </div>
  );
};

export default BranchContact;

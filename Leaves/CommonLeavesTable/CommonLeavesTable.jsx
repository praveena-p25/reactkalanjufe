import React from "react";
import { Spinner, Table } from "react-bootstrap";
import LeavesTableRow from "../LeavesTableRow/LeavesTableRow";
import classes from "./CommonLeavesTable.module.css";

const CommonLeavesTable = ({
  data,
  formData,
  approveLeave,
  rejectLeave,
  loading = false,
}) => {
  return (
    <Table responsive>
      <thead className={classes.boldText}>
        <tr>
          <td>S No</td>
          <td>Name</td>
          <td>Mobile</td>
          <td>Date</td>
          <td>Type</td>
          <td>Branch</td>
          <td>Status</td>
          <td>Action</td>
        </tr>
      </thead>
      <tbody>
        {loading === true && !data?.length && (
          <tr>
            <td colSpan="8">
              <div className="loadingRow">
                <Spinner animation="border" />
              </div>
            </td>
          </tr>
        )}
        {loading === false && !data?.length && (
          <tr>
            <td colSpan="8">
              <div className="loadingRow">No Records Available</div>
            </td>
          </tr>
        )}
        {data?.map((rows, idx) => (
          <LeavesTableRow
            formData={formData}
            rowData={rows}
            approveLeave={approveLeave}
            rejectLeave={rejectLeave}
            key={idx}
            idx={rows.s_no}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default CommonLeavesTable;

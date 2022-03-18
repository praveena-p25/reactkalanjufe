import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import pencilsquareimg from "../../../assets/pencil-square.svg";
import trashimg from "../../../assets/trash-fill.svg";
import DeleteDialogBox from "../../../pages/AccessManagementPage/DeleteDialogBox/DeleteDialogBox";

import classes from "./AccessmanagementTable.module.css";

const AccessmanagementTable = ({ data, perPage, currentPagination, url }) => {
  const [show, setShow] = useState(false);
  const handleModal = () => setShow(!show);
  const history = useHistory();
  const startIndex = currentPagination * perPage - perPage;
  const endIndex = currentPagination * perPage;
  const filteredDataBody = data.body.slice(startIndex, endIndex);
  return (
    <div className={classes.table}>
      <div className={`${classes.container} table-responsive`}>
        <table className="table table-borderless">
          <thead>
            <tr>
              {data.head.map((el, idx) => {
                return (
                  <th key={idx} scope="col">
                    {el}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredDataBody.map((row, idx) => {
              return (
                <tr key={idx}>
                  {row.map((col, idx) => {
                    switch (col.type) {
                      case "role":
                        return (
                          <td key={idx}>
                            <Link to={`/role/${col.id}`}>{col.name}</Link>
                          </td>
                        );
                      case "actionIcon":
                        return (
                          <td key={idx}>
                            <img
                              src={pencilsquareimg}
                              alt="user_img"
                              width="14px"
                              height="16px"
                              onClick={() => history.push(url)}
                              style={{ cursor: "pointer" }}
                            />

                            <img
                              src={trashimg}
                              alt="user_img"
                              width="14px"
                              height="16px"
                              style={{ marginLeft: "30px" }}
                              onClick={handleModal}
                            />
                          </td>
                        );
                      default:
                        return <td key={idx}>{col}</td>;
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <DeleteDialogBox handleModal={handleModal} show={show} />
      </div>
    </div>
  );
};

export default AccessmanagementTable;

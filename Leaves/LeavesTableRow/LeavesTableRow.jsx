/* eslint-disable array-callback-return */
import ModalCommon from "components/common/Modal/Modal";
import { Button, Modal } from "react-bootstrap";
import { useAuth } from "context/auth/authProvider";
import React, { useState } from "react";
import { dateFormat } from "utils/dateFormat";
import classes from "./LeavesTableRow.module.css";
const LeavesTableRow = ({
  rowData,
  idx,
  formData,
  approveLeave,
  rejectLeave,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [show, setShow] = useState(false);
  const auth = useAuth();
  const view = rowData.to_mail.includes(auth.user.email);
  // const [view, setView] = useState(false);
  // useEffect(() => {
  //   let tomail = rowData.to_mail;
  //   if (tomail.includes(auth.user.email)) {
  //     setView(true);
  //   }
  // }, [rowData]);
  return (
    <>
      <tr>
        <td>{idx}</td>
        <td>
          <span className={classes.modalLink} onClick={() => setShow(true)}>
            {rowData.resource_name}
          </span>
        </td>
        <td>{rowData.mobile}</td>
        <td>{`${dateFormat(",", rowData.from_date)} - ${dateFormat(
          ",",
          rowData.to_date
        )}`}</td>
        {/* <td>{`${dateFormat("-", rowData.from_date)
                    .split("-")
                    .reverse()
                    .join("/")} - ${dateFormat("-", rowData.to_date)
                    .split("-")
                    .reverse()
                    .join("/")}`}</td> */}
        <td>{rowData.leave_type}</td>
        <td>{rowData.branch}</td>
        <td style={{ textTransform: "capitalize" }}>{rowData.status}</td>
        <td>
          <div className={classes.actionColumn}>
            <div className={classes.icons} onClick={() => setShow(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path
                  style={{ fill: "#0d6efd" }}
                  d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"
                />
              </svg>
            </div>
            {approveLeave && view && (
              <div
                className={classes.icons}
                onClick={() => {
                  if (
                    rowData.days > 5 &&
                    !rowData.status.toString().includes("cancel")
                  ) {
                    setShowConfirm(true);
                  } else {
                    approveLeave(rowData.id);
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                >
                  <path
                    style={{ fill: "#00FF00" }}
                    d="M0 0v24h24v-24h-24zm10.041 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591z"
                  />
                </svg>
              </div>
            )}
            {rejectLeave && view && (
              <div
                className={classes.icons}
                onClick={() => rejectLeave(rowData.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                >
                  <path
                    style={{ fill: "#FF0000" }}
                    d="M0 0v24h24v-24h-24zm16.597 17.954l-4.591-4.55-4.555 4.596-1.405-1.405 4.547-4.592-4.593-4.552 1.405-1.405 4.588 4.543 4.545-4.589 1.416 1.403-4.546 4.587 4.592 4.548-1.403 1.416z"
                  />
                </svg>
              </div>
            )}
          </div>
        </td>
      </tr>
      <ModalCommon
        show={show}
        setShow={setShow}
        title="Leave Details"
        save={null}
        cancel={null}
      >
        <div className={classes.leaveInfo}>
          <div className={`${classes.container} ${classes.form}`}>
            {formData.map((d, i) => {
              let dataRow = rowData[d.state];
              if (d.state === "to_mail")
                dataRow = dataRow.split(",").map((mail) => (
                  <>
                    {mail}
                    <br />
                  </>
                ));
              if (d.infoType === "date")
                dataRow = dateFormat("-", dataRow)
                  .split("-")
                  .reverse()
                  .join("-");
              if (d.displayCondition?.(rowData) === false) return;
              return (
                <label
                  key={i}
                  style={{
                    gridColumn: d.type === "textarea" && "span 2",
                    maxWidth: "100%",
                  }}
                >
                  {d.label === "Days" &&
                  (rowData.leave_type === "Maternity Leave" ||
                    rowData.leave_type === "Paternity Leave" ||
                    rowData.leave_type === "Maternity Leave : MC")
                    ? "Count"
                    : d.label}
                  <p>{dataRow || "N/A"}</p>
                </label>
              );
            })}
          </div>
        </div>
      </ModalCommon>
      <Modal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Approve Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          The number of days is greater than 5 , Are you sure , you want to
          approve?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              approveLeave(rowData.id);
              setShowConfirm(false);
            }}
          >
            Approve
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeavesTableRow;

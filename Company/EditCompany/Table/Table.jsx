import BranchContact from "components/Company/ShowCompany/Branch/BranchContact";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import downArrowSvg from "../../../../assets/arrow-down.svg";
import upArrowSvg from "../../../../assets/arrow-up.svg";
import { BranchContactData } from "../../../../pages/Company/ShowCompany/data";
import classes from "./Table.module.css";

const Table = ({ data }) => {
  const shows = [];

  const [show, setShow] = useState(false);

  const modalSaveHandler = () => {
    setShow(false);
  };

  for (let i = 0; i < data.body.length; i++) {
    shows.push(false);
  }

  const [state, setState] = useState(shows);
  const handleState = (idx) => {
    setState((prev) => {
      const updatedShows = [...prev];
      updatedShows[idx] = !updatedShows[idx];
      return updatedShows;
    });
  };
  return (
    <div className={classes.table}>
      <div className={`${classes.container} table-responsive`}>
        <table className="table">
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
            {data.body.map((row, idx1) => {
              return (
                <>
                  <tr key={idx1}>
                    {row.map((col, idx2) => {
                      switch (col.type) {
                        case "downArrow":
                          return (
                            <td key={idx2}>
                              <img
                                src={state[idx1] ? upArrowSvg : downArrowSvg}
                                alt="down arrow"
                                onClick={() => handleState(idx1)}
                                style={{ cursor: "pointer" }}
                              />
                            </td>
                          );

                        default:
                          return <td key={idx2}>{col}</td>;
                      }
                    })}
                  </tr>
                  <tr
                    style={{
                      display: state[idx1] === false && "none",
                      width: "100%",
                    }}
                    className={classes.innerTable}
                  >
                    <td colSpan={9}>
                      <BranchContact
                        style={{ width: "100%" }}
                        data={BranchContactData}
                      />
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-primary"
                          onClick={() => setShow(true)}
                        >
                          Add Contact
                        </button>
                        <Modal
                          show={show}
                          setShow={setShow}
                          title="Add Contact"
                          cancel="Cancel"
                          save="Confirm"
                          onSave={modalSaveHandler}
                        >
                          kjngjkdfngjdng
                        </Modal>
                      </div>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      {JSON.stringify(data.body) === "[]" && (
        <p style={{ textAlign: "center" }}>No Data Found</p>
      )}
    </div>
  );
};

export default Table;

import React, { useState } from "react";
import downArrowSvg from "../../../../assets/arrow-down.svg";
import upArrowSvg from "../../../../assets/arrow-up.svg";
import pencilSquareImg from "../../../../assets/pencil-square.svg";
import classes from "./Table.module.css";

const Table = ({ data, mode, tabletype }) => {
  const shows = [];
  const [, setShow] = useState(false);

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
                              <div style={{ display: "flex" }}>
                                <img
                                  src={pencilSquareImg}
                                  alt="Edit"
                                  onClick={() => setShow(true)}
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "10px",
                                  }}
                                />
                              </div>
                              {tabletype === "branch" && (
                                <img
                                  src={state[idx1] ? upArrowSvg : downArrowSvg}
                                  alt="down arrow"
                                  onClick={() => handleState(idx1)}
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                            </td>
                          );

                        default:
                          return <td key={idx2}>{col}</td>;
                      }
                    })}
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

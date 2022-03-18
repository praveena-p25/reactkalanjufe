import BranchEditContact from "components/Company/EditCompany/Branch/BranchContact";
import BranchContact from "components/Company/ShowCompany/Branch/BranchContact";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import downArrowSvg from "../../../../assets/arrow-down.svg";
import upArrowSvg from "../../../../assets/arrow-up.svg";
import pencilSquareImg from "../../../../assets/pencil-square.svg";
import {
  BranchContactData as BranchEditContactData,
  BranchContactFormData as BCform,
} from "../../../../pages/Company/EditCompany/data";
import { BranchContactData } from "../../../../pages/Company/ShowCompany/data";
import DeleteIcon from "../../../common/DeleteIcon/DeleteIcon";
import FormContainer from "../../EditCompany/FormikFormContainer/FormContainer";
import classes from "./Table.module.css";

const Table = ({
  data,
  mode,
  tabletype,
  page,
  editFormdata,
  addContactHandler = () => {},
  deleteContactHandler = () => {},
  editContactHandler = () => {},
}) => {
  const [BranchContactFormData, setBranchContactFormData] = useState(BCform);
  const shows = [];
  const [editshow, seteditShow] = useState(false);
  const handleeditClose = () => seteditShow(false);
  for (let i = 0; i < data.body?.length; i++) {
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

  const fieldsObj = {};
  (editFormdata || []).forEach((field) => {
    fieldsObj[field.state] = field.value ? field.value : "";
  });
  const [editstate, seteditState] = useState(fieldsObj);
  const [editData, seteditData] = useState({});
  const [contact, setcontact] = useState(false);
  const [addcontact, setaddcontact] = useState({
    name: "",
    designation: "",
    email: "",
    phone: "",
    status: "",
    remarks: "",
    contacts: [],
  });

  useEffect(() => {
    const fieldsObj = {};
    (editFormdata || []).forEach((field) => {
      fieldsObj[field.state] = field.value ? field.value : "";
    });
    seteditState(fieldsObj);
  }, [editFormdata]);

  useEffect(() => {
    const fieldsObj = {};
    (BranchContactFormData || []).forEach((field) => {
      fieldsObj[field.state] = field.value ? field.value : "";
    });
    seteditState(fieldsObj);
  }, [BranchContactFormData]);
  //EDIT HANDLER
  const editHandler = async (data, files) => {
    let res = await editData.editHandler(data, editData.data, files);
    if (res) {
      handleeditClose();
    }
  };

  //ADD CONTACT FUNCTION
  const addContactFuntion = async (state) => {
    state.branch_id = addcontact.branch_id;
    let res = await addContactHandler(state);
    if (res) {
      setcontact(false);
      setaddcontact({
        branch_id: null,
        name: "",
        designation: "",
        email: "",
        phone: "",
        status: "",
        remarks: "",
      });
    }
  };
  return (
    <div className={classes.table}>
      <div className={`${classes.container} table-responsive`}>
        <table className="table">
          <thead>
            <tr>
              {data.head.map((el, idx) => {
                return (
                  <th key={`${idx}${el}`} scope="col">
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
                  <tr key={`${idx1}1`}>
                    {row.map((col, idx2) => {
                      switch (col?.type) {
                        case "doc":
                          return (
                            <td key={`${idx2}2`}>
                              <a href={col.url} download>
                                {col.name}{" "}
                              </a>
                            </td>
                          );
                        case "downArrow":
                          return (
                            <td key={`${idx2}2`}>
                              <div style={{ display: "flex" }}>
                                {mode === "edit" && (
                                  <>
                                    <img
                                      src={pencilSquareImg}
                                      alt="Edit"
                                      onClick={() => {
                                        seteditShow(true);
                                        if (page === "contact") {
                                          setBranchContactFormData((prev) => {
                                            return prev.map((d) => {
                                              return {
                                                ...d,
                                                value: col.data[d.state],
                                              };
                                            });
                                          });
                                          seteditData(col);
                                          // editcontact
                                        } else {
                                          seteditData(col);
                                          seteditState((prev) => {
                                            let updateData = { ...prev };
                                            for (let i in col.data) {
                                              updateData[i] = col.data[i];
                                            }
                                            return updateData;
                                          });
                                        }
                                      }}
                                      style={{
                                        cursor: "pointer",
                                        marginRight: "8px",
                                      }}
                                    />
                                  </>
                                )}
                                {mode === "edit" && (
                                  <>
                                    <DeleteIcon
                                      onClick={(e) => {
                                        // if(page === 'contact'){
                                        //   console.log(col)
                                        // }else{
                                        col.deleteHandler(col.data);
                                        // }
                                      }}
                                    />
                                  </>
                                )}
                                {tabletype === "branch" && (
                                  <img
                                    src={
                                      state[idx1] ? upArrowSvg : downArrowSvg
                                    }
                                    alt="down arrow"
                                    onClick={() => handleState(idx1)}
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "8px",
                                    }}
                                  />
                                )}
                              </div>
                            </td>
                          );

                        default:
                          return <td key={`${idx2}2`}>{col}</td>;
                      }
                    })}
                  </tr>

                  <tr
                    key={`${idx1}11`}
                    className={classes.innerTable}
                    style={{
                      display: state[idx1] === true ? "" : "none",
                      width: "100%",
                    }}
                  >
                    {row.map((col, idx3) => {
                      return (
                        <>
                          {tabletype === "branch" && col?.type === "downArrow" && (
                            <td
                              colSpan={9}
                              key={`${idx3}3`}
                              style={{ borderBottom: "none" }}
                              className="px-4"
                            >
                              {mode === "show" && (
                                <BranchContact
                                  style={{ width: "100%" }}
                                  data={
                                    {
                                      ...BranchContactData,
                                      body: col.data?.contacts.map((d) => {
                                        let updatedArr = [];
                                        updatedArr.push(d["name"]);
                                        updatedArr.push(d["designation"]);
                                        updatedArr.push(d["phone"]);
                                        updatedArr.push(d["email"]);
                                        updatedArr.push(
                                          d["status"] === 1
                                            ? "Active"
                                            : "Inactive"
                                        );
                                        updatedArr.push(d["remarks"]);
                                        return updatedArr;
                                      }),
                                    } || []
                                  }
                                />
                              )}
                              {mode === "edit" && (
                                <BranchEditContact
                                  style={{ width: "100%" }}
                                  data={
                                    {
                                      ...BranchEditContactData,
                                      body: col.data?.contacts.map((d) => {
                                        let updatedArr = [];
                                        updatedArr.push(d["name"]);
                                        updatedArr.push(d["designation"]);
                                        updatedArr.push(d["phone"]);
                                        updatedArr.push(d["email"]);
                                        updatedArr.push(
                                          d["status"] === 1
                                            ? "Active"
                                            : "Inactive"
                                        );
                                        updatedArr.push(d["remarks"]);
                                        updatedArr.push({
                                          type: "downArrow",
                                          data: d,
                                          deleteHandler: deleteContactHandler,
                                          editHandler: editContactHandler,
                                        });
                                        return updatedArr;
                                      }),
                                    } || []
                                  }
                                />
                              )}
                            </td>
                          )}
                        </>
                      );
                    })}
                  </tr>

                  <tr key={`${idx1}12`}>
                    {row.map((col, idx4) => {
                      return (
                        <>
                          {tabletype === "branch" && col?.type === "downArrow" && (
                            <td
                              colSpan={9}
                              key={`${idx4}4`}
                              style={{ borderBottom: "none" }}
                            >
                              <div className="d-flex justify-content-center">
                                {mode === "edit" && (
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                      setaddcontact((prev) => {
                                        return {
                                          ...prev,
                                          contacts: col.data?.contacts || [],
                                          branch_id: col.data.id,
                                        };
                                      });
                                      setcontact(true);
                                    }}
                                  >
                                    Add Contact
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </>
                      );
                    })}
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>

        {/* EDIT MODAL */}
        <Modal
          show={editshow}
          onHide={handleeditClose}
          animation={false}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit {page}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormContainer
              data={
                page === "contact"
                  ? BranchContactFormData.map((d) => {
                      return {
                        ...d,
                        value: editstate[d.state],
                      };
                    })
                  : (editFormdata || []).map((d) => {
                      return {
                        ...d,
                        value: editstate[d.state],
                      };
                    }) || []
              }
              saveButtonName={"Update "}
              formSubmitHandler={editHandler}
              cancelHandler={handleeditClose}
            />
          </Modal.Body>
        </Modal>

        {/* ADD CONTACT MODAL */}
        <Modal
          size="lg"
          show={contact}
          onHide={() => {
            setcontact(false);
          }}
          animation={false}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BranchContact
              style={{ width: "100%" }}
              data={
                {
                  ...BranchContactData,
                  body: (addcontact.contacts || []).map((d) => {
                    let updatedArr = [];
                    updatedArr.push(d["name"]);
                    updatedArr.push(d["designation"]);
                    updatedArr.push(d["phone"]);
                    updatedArr.push(d["email"]);
                    updatedArr.push(d["status"] === 1 ? "Active" : "Inactive");
                    updatedArr.push(d["remarks"]);
                    return updatedArr;
                  }),
                } || []
              }
            />
            <div className="m-5"></div>
            <FormContainer
              data={
                BranchContactFormData.map((d) => {
                  return {
                    ...d,
                    value: editstate[d.state],
                  };
                }) || []
              }
              formSubmitHandler={addContactFuntion}
              cancelHandler={() => {
                setcontact(false);
              }}
            />
          </Modal.Body>
        </Modal>
      </div>
      {JSON.stringify(data.body) === "[]" && (
        <p style={{ textAlign: "center" }}>No Data Found</p>
      )}
    </div>
  );
};

export default Table;

import SearchFilter from "components/projects/SearchFilter/SearchFilter.jsx";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import FormContainer from "../../EditCompany/FormikFormContainer/FormContainer";
import Table from "../../ShowCompany/Table/Table";
import classes from "./Branch.module.css";

const Branch = ({
  data,
  BranchFormData,
  addHandler,
  addContactHandler,
  deleteContactHandler,
  editContactHandler,
}) => {
  const [show, setShow] = useState(false);
  const [displayData, setDisplayData] = useState({ head: [], body: [] });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fieldsObj = {};
  BranchFormData.forEach((field) => {
    fieldsObj[field.state] = field.value ? field.value : "";
  });
  const [, setState] = useState(fieldsObj);

  useEffect(() => {
    setDisplayData(data);
  }, [data]);

  useEffect(() => {
    const fieldsObj = {};
    BranchFormData.forEach((field) => {
      fieldsObj[field.state] = field.value ? field.value : "";
    });
    setState(fieldsObj);
  }, [BranchFormData]);
  //SUBMIT HANDLER
  const submitHandler = async (state) => {
    let res = await addHandler(state);
    if (res) {
      setState((prev) => {
        let updatedData = { ...prev };
        for (let i in prev) {
          updatedData[i] = "";
        }
        return updatedData;
      });
      handleClose();
    }
  };

  //SEARCH FILTER FIELDS
  const searchFilterFields = [
    {
      type: "input",
      placeholder: "Search By Name",
      state: "name",
      value: "",
    },
  ];
  const alterDisplayData = (fieldState, updatedState) => {
    setDisplayData({
      ...data,
      body: data.body.filter((d) => {
        return (
          d[0]?.toUpperCase().indexOf(updatedState?.name.toUpperCase()) > -1
        );
      }),
    });
  };

  return (
    <div className={classes.contacts}>
      <div className={classes.searchbranch}>
        <SearchFilter
          fields={searchFilterFields}
          setDisplayData={alterDisplayData}
          page="company"
        />
      </div>
      <Table
        data={displayData}
        mode={"edit"}
        tabletype={"branch"}
        page="Branch"
        editFormdata={BranchFormData}
        addContactHandler={addContactHandler}
        editContactHandler={editContactHandler}
        deleteContactHandler={deleteContactHandler}
      />

      <button className="btn btn-primary" onClick={handleShow}>
        Add Branch
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Branch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormContainer
            data={BranchFormData}
            formSubmitHandler={submitHandler}
            cancelHandler={handleClose}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Branch;

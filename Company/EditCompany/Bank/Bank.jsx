import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import FormContainer from "../../EditCompany/FormikFormContainer/FormContainer";
import Table from "../../ShowCompany/Table/Table";
import classes from "./Bank.module.css";

const Bank = ({ data, BankFormData, addHandler }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const fieldsObj = {};
  BankFormData.forEach((field) => {
    fieldsObj[field.state] = field.value ? field.value : "";
  });
  const [, setState] = useState(fieldsObj);

  useEffect(() => {
    const fieldsObj = {};
    BankFormData.forEach((field) => {
      fieldsObj[field.state] = field.value ? field.value : "";
    });
    setState(fieldsObj);
  }, [BankFormData]);

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
  //STATUS FILTER OPTIONS
  return (
    <div className={classes.contacts}>
      <h5 className={classes.bankhead}>Bank Details</h5>
      <Table data={data} mode="edit" page="Bank" editFormdata={BankFormData} />
      <button className="btn btn-primary" onClick={handleShow}>
        Add Bank
      </button>
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Bank</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormContainer
            data={BankFormData}
            cancelHandler={handleClose}
            formSubmitHandler={submitHandler}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Bank;

import React, { useEffect, useState } from "react";
// import { Button, Modal } from "react-bootstrap";
import {
  adminDisableAllGroupIdMap,
  disableProjectAccessCondition,
} from "utils/disableCheckboxesutils";
import classes from "./EditDesignation.module.css";

const EditDesignation = ({ accesses, setAccesses, structure }) => {
  const [accessesStruct, setAccessesStruct] = useState([]);
  const [originalStruct, setOriginalStruct] = useState(structure);
  // const [currentaccess, setCurrentAccess] = useState("");
  // const [show, setShow] = useState(false);
  const addOrRemoveAccess = (accessId) => {
    if (accesses.includes(accessId)) {
      setAccesses(accesses.filter((access) => access !== accessId));
    } else {
      setAccesses((prevState) => [...prevState, accessId]);
    }
  };
  // const checkboxHandler = () => {
  //   console.log(currentaccess);
  // };
  // const submitHandler = () => {
  //   setShow(false);
  // };

  useEffect(() => {
    setOriginalStruct(structure);
  }, [structure]);

  useEffect(() => {
    disableFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accesses]);

  useEffect(() => {
    disableFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalStruct]);

  const disableFields = () => {
    const struct = originalStruct.map((accsStruct) => {
      // if condition for project group, disables checkboxes in project group
      if (accsStruct.group === "Project") {
        const changedAccess = accsStruct.accesses.map((accessGroup) => {
          if (disableProjectAccessCondition(accessGroup.id, accesses)) {
            return { ...accessGroup, status: accessGroup.status ? 0 : 1 }; // toggles status if not project admin
          }
          return accessGroup;
        });
        // setShow(true);
        return { group: accsStruct.group, accesses: changedAccess };
      }

      // condition for groups which should disable boxes on clicking admin
      if (accesses.includes(adminDisableAllGroupIdMap[accsStruct.group])) {
        const changedAccess = accsStruct.accesses.map((access) => {
          if (access.id === adminDisableAllGroupIdMap[accsStruct.group]) {
            return access; // returns object with admin id without changes
          }
          return { ...access, status: access.status ? 0 : 1 }; // toggles status of other objects
        });
        return { group: accsStruct.group, accesses: changedAccess };
      }
      return accsStruct;
    });
    setAccessesStruct(struct);
    // setCurrentAccess(console.log("check=="));
    // setShow(true);
  };

  const checkAccesses = (accessId) => {
    if (accesses.includes(accessId)) {
      return true;
    }
    return false;
  };

  return (
    <div>
      {accessesStruct.map((info, idx) => {
        return (
          <div key={idx} className={classes.add}>
            <div className={classes.addTitle} style={{ fontWeight: "bold" }}>
              {info.group}
            </div>
            {/* {info.group} */}

            <div className={classes.container}>
              {info.accesses.map((access, idx) => {
                return (
                  <label key={idx}>
                    <input
                      style={{ marginRight: "10px" }}
                      onChange={() => addOrRemoveAccess(access.id)}
                      type="checkbox"
                      // onClick={() => setShow(true)}
                      checked={checkAccesses(access.id)}
                      disabled={access.status === 0 ? true : false}
                    />
                    {access.name.split("_")[1]}
                  </label>
                );
              })}
            </div>
            <br />
          </div>
        );
      })}
      {/* <Modal
        animation={false}
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Access Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to access? </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-danger"
            onClick={() => {
              setShow(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={submitHandler}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default EditDesignation;

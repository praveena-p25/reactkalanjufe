import accessManagementService from "Api/AccessManagement";
import { axiosCancel } from "Api/httpRequest";
import React, { useEffect, useState } from "react";
import {
  adminDisableAllGroupIdMap,
  disableProjectAccessCondition,
} from "utils/disableCheckboxesutils";

import classes from "./AddDesignation.module.css";

const AddDesignation = ({
  accesses,
  setAccesses,
  setValidationAccessStructure,
}) => {
  const [accessesStruct, setAccessesStruct] = useState([]);
  const [originalStruct, setOriginalStruct] = useState(accessesStruct);

  //ADD OR REMOVE ACCESS
  const addOrRemoveAccess = (accessId) => {
    if (accesses.includes(accessId)) {
      setAccesses(accesses.filter((access) => access !== accessId));
    } else {
      setAccesses((prevState) => [...prevState, accessId]);
    }
  };

  const getStructure = async () => {
    const struct = await accessManagementService.getAccessStructure();

    setOriginalStruct(struct);
    setAccessesStruct(struct);
  };

  useEffect(() => {
    getStructure();
    return () => {
      axiosCancel.cancel();
    };
  }, []);

  useEffect(() => {
    disableFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accesses]);

  const disableFields = () => {
    const struct = originalStruct.map((accsStruct) => {
      // if condition for project group, disables checkboxes in project group
      if (accsStruct.group === "Project") {
        const changedAccess = accsStruct.accesses.map((access) => {
          if (disableProjectAccessCondition(access.id, accesses)) {
            return { ...access, status: access.status ? 0 : 1 }; // toggles status if not project admin
          }
          return access; // returns same in case of project admin
        });
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
    setValidationAccessStructure(struct);
  };

  const checkAccesses = (accessId) => {
    if (accesses.includes(accessId)) {
      return true;
    }
    return false;
  };

  if (accessesStruct.length !== 0) {
    return (
      <div>
        {accessesStruct.map((info, idx) => {
          return (
            <div key={idx} className={classes.add}>
              {info.group}

              <div className={classes.container}>
                {info.accesses.map((access, idx) => {
                  return (
                    <label key={idx}>
                      <input
                        style={{ marginRight: "10px" }}
                        onChange={() => addOrRemoveAccess(access.id)}
                        type="checkbox"
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
      </div>
    );
  }
  return <></>;
};

export default AddDesignation;

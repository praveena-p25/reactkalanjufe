import React, { useEffect, useState } from "react";
import { getdocuments } from "../../../../Api/masterdata";
import { DocumentFormData } from "../../../../pages/Company/EditCompany/data";
import FormContainer from "../../../common/FormikFormContainer/FormContainer";
import Table from "../../ShowCompany/Table/Table";
import classes from "./Documents.module.css";

const Documents = ({ data, addHandler }) => {
  //STATUS FILTERS
  const [statusOptions, setStatusOptions] = useState([
    { id: "1", value: "Aadhar", label: "Aadhar" },
    { id: "0", value: "PAN", label: "PAN" },
    { id: "0", value: "Marksheet", label: "Marksheet" },
  ]);
  useEffect(() => {
    (async () => {
      let res = await getdocuments();
      setStatusOptions(
        res.map((d) => {
          return {
            value: d.name,
            label: d.name,
          };
        })
      );
    })();
  }, []);
  return (
    <div className={classes.documents}>
      <Table
        data={data}
        mode="edit"
        page="Document"
        editFormdata={DocumentFormData.map((d) => {
          if (d.state === "name") {
            return {
              ...d,
              options: statusOptions,
            };
          }

          return d;
        })}
      />
      <div className={classes.documentupload}>
        <h5>Document Upload</h5>
        <div class="d-flex justify-content-start">
          <FormContainer
            data={DocumentFormData.map((d) => {
              if (d.state === "name") {
                return {
                  ...d,
                  options: statusOptions,
                };
              }
              return d;
            })}
            formSubmitHandler={async (state, files) => {
              let stateCpy = { ...state };
              stateCpy.file = files.url;
              let res = await addHandler(stateCpy);
              if (res) {
              }
            }}
          />
        </div>
        <br />
      </div>
    </div>
  );
};

export default Documents;

/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { uploadBulk } from "../../../Api/masterdata";
import { useParams } from "react-router-dom";
import showNotification from "../../../utils/showNotification";
import classes from "../Campus.module.css";
import { CSVLink } from "react-csv";
import { useHistory } from "react-router-dom";

function ExcelToJson(params) {
  const hiddenFileInput = React.useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const { id } = useParams();

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [duplicate, setDuplicate] = useState([]);
  const [path, setpath] = useState("");

  const duplicatelink = () => {
    const headerData = [
      "Candidate Name",
      "Contact Number",
      "Mail Id",
      "Branch",
      "Location",
    ];
    let csv = [];
    duplicate.map((data) => {
      csv.push({
        "Candidate Name": data.name,
        "Contact Number": data.contact,
        "Mail Id": data.mail,
        Branch: data.branch,
        Location: data.location,
      });
    });
    const csvReport = {
      filename: "DuplicateList.csv",
      headers: headerData,
      data: csv,
    };

    const csvTemplateReport = {
      filename: "ReportTemplate.csv",
      headers: headerData,
      data: "",
    };

    if (duplicate.length > 0) {
      return (
        <CSVLink
          style={{ float: "right", marginRight: "2%", marginTop: "2%" }}
          {...csvReport}
        >
          Duplicate Data Report
        </CSVLink>
      );
    } else {
      return (
        <CSVLink
          style={{ float: "right", marginRight: "2%", marginTop: "2%" }}
          {...csvTemplateReport}
        >
          Report Template
        </CSVLink>
      );
    }
  };
  // process CSV data
  const processData = async (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
      setpath("");
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));
    setData(list);
    setColumns(columns);
    if (list.length > 0) {
      const res = await uploadBulk(list, id);

      if (res.data.duplicate.length > 0) {
        showNotification("Duplicate Data Found", "warning");
        // console.log(res);
        setDuplicate(res.data.duplicate);
      } else {
        showNotification("Successfully Added Candidates", "success");
      }
      params.getallcampus();
    } else {
      showNotification("No Data Found", "error");
    }
  };

  // handle file upload
  const handleFileUpload = (e) => {
    setDuplicate([]);
    setpath(e.target.value);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };
  const history = useHistory();

  return (
    <div>
      <button
        className={`btn btn-primary ms-2 my-1 ${classes.button}`}
        onClick={() => history.push(`/Campus`)}
      >
        Back
      </button>
      <button
        className={`btn btn-primary my-1 ${classes.button}`}
        onClick={handleClick}
        disabled={params.disabled}
      >
        Upload Candidates
      </button>
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
        value={path}
        style={{ display: "none" }}
        ref={hiddenFileInput}
      />
      {duplicatelink()}
    </div>
  );
}

export default ExcelToJson;

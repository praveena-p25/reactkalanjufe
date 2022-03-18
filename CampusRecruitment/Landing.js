/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
// import { inputCSS } from "react-select/src/components/Input";
import classes from "./Campus.module.css";
import Table from "./Table";
import { useState, useEffect } from "react";
import { useAuth } from "context/auth/authProvider";
import React from "react";
import moment from "moment";
import { CSVLink } from "react-csv";
import Select from "react-select";
import { useHistory, useLocation } from "react-router";
import {
  updateRecruit,
  getAllCampus,
  sendTaskMail,
  sendReportTo,
  updatecutoff,
} from "../../Api/masterdata";
import Dashbody from "../dashboard/dash-body/DashBody";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAxiosLoader } from "Api/httpRequest";
import { createCandidateAccess } from "utils/projectAccesses";
import PageTitle from "../../components/CampusRecruitment/PageTitle/PageTitle";
import { httpRequest } from "../../Api/httpRequest";
import Searchbar from "components/common/SearchBar/Searchbar";
import SearchFilterNav from "components/common/SearchFilterNav/SearchFilterNav";
import { noValidate } from "utils/textValidation";
import Loading from "../../pages/Loading/Loading";
import ExcelToJson from "./campusupload/ExcelToJson";
import { allAccesses } from "utils/accesses";
import Pagination from "../projects/Pagination/Pagination.jsx";
import showNotification from "../../utils/showNotification";
import { useDebounce } from "use-debounce";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";

function CampusRecruitment() {
  const { roleAccess } = useAuth();
  const [load] = useAxiosLoader();
  const location = useLocation();
  const [details, setDetails] = useState([]);
  const [tablevalue, setTableValue] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [recruiter, setrecruiter] = useState("");

  //QUERY PARAMS AND PAGINATION USESTATES
  const query = new URLSearchParams(location.search);
  const [perPage, setPerPage] = useState(query.get("per") || 5);
  const [currentPagination, setCurrentPagination] = useState(
    +query.get("curr") || 1
  );

  const [nameFilter, setNameFilter] = useState(
    query.get("name") ? query.get("name") : ""
  );
  const [technologyFilter, setTechnologyFilter] = useState(
    query.get("tech") ? query.get("tech") : ""
  );
  const [hrFilter, setHrFilter] = useState(
    query.get("hr") ? query.get("hr") : ""
  );
  const [interviewFilter, setInterviewFilter] = useState(
    query.get("inf") ? query.get("inf") : ""
  );
  const [roundFilter, setRoundFilter] = useState(
    query.get("round") ? query.get("round") : ""
  );
  const [statusFilter, setStatusFilter] = useState(
    query.get("sts") ? query.get("sts") : ""
  );
  const [offset, setOffset] = useState("");

  const [refresh, setRefresh] = useState(false);
  const [name] = useDebounce(nameFilter, 1000);
  // const [dateRange, setDateRange] = useState([null, null]);
  // const [startDate, endDate] = dateRange;

  const [hrOptions, setHrOptions] = useState([]);
  const [pannelistOption, setPannelistOption] = useState([]);
  const [technologyOption, settechnologyOption] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);
  const { id } = useParams();
  const history = useHistory();

  //State for CSV download
  const [csvdata, setcsvdata] = useState([]);

  const [sendTaskData, setSendTaskData] = useState([]);
  const [campusData, setCampusData] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [inProgress, setInProgress] = useState(true);
  const [select, setSelect] = useState(true);
  const [total, setTotal] = useState(true);

  //ROUND OPTIONS
  const roundoptions = [
    { id: 1, value: "1", label: "One Round" },
    { id: 2, value: "2", label: "Two Rounds" },
    { id: 3, value: "3", label: ">Two Rounds" },
  ];
  //STATUS OPTIONS
  const statusoptions = [
    { value: "Selected", label: "Selected" },
    { value: "Rejected", label: "Rejected" },
    { value: "In Progress", label: "In Progress" },
    { value: "On Hold", label: "On Hold" },
    { value: "Yet to Start", label: "Yet to Start" },
  ];

  function handleRefresh() {
    setRefresh(!refresh);
  }

  //FETCH DATA FUNCTION
  const getallcampus = async () => {
    try {
      // let start = startDateFilter != null ? "" : startDateFilter;
      // let end = endDateFilter != null ? "" : endDateFilter;
      let mydata = await getAllCampus(
        currentPagination,
        hrFilter,
        nameFilter,
        roundFilter,
        statusFilter,
        technologyFilter,
        offset,
        perPage,
        interviewFilter,
        id
      );
      let isInProgress = mydata.results.find((d) => d.status === "In Progress");
      isInProgress ? setInProgress(false) : setInProgress(true);
      let isSelect = mydata.results.find((d) => d.status === "Selected");
      isSelect ? setSelect(false) : setSelect(true);
      setTableValue(mydata.pageLength);
      mydata.pageLength ? setTotal(false) : setTotal(true);
      setDisplayData(mydata.results);
      setDetails(mydata.details);
      setround1_cutoff(mydata.details[0].round1_cutoff);
      setround2_cutoff(mydata.details[0].round2_cutoff);
      let data =
        mydata.skills &&
        mydata.skills.map((re, key) => {
          return {
            value: re.name,
            label: re.name,
            id: key,
            type: re.label,
          };
        });

      settechnologyOption(data);

      //interviewer
      let interviewerdata = mydata.interviewer.map((resource, key) => {
        return {
          value: resource.id.toString(),
          label: `${resource.name + "-I" + resource.id}`,
          id: resource.id,
          key: key,
        };
      });
      setPannelistOption(interviewerdata);

      //hr
      let hrdata = mydata.hr.map((re, key) => {
        return {
          value: re.id.toString(),
          label: `${re.name + "-H" + re.id}`,
          id: re.id,
        };
      });
      setHrOptions(hrdata);

      let taskdata = mydata.task.map((re, key) => {
        return {
          value: re.id.toString(),
          label: re.task,
          type: re.skill,
        };
      });
      setTaskOptions(taskdata);

      let csv = [];
      mydata.csvdata.map((data, index) => {
        csv.push({
          "S.No": index + 1,
          "Candidate Name": data.candidatename,
          "Contact Number": data.phone,
          "Mail Id": data.email,
          Recruiter: data.recruiter,
          "Evaluated By": data.evaluatedby,
          Role: data.role,
          Skill: data.requirement_base,
          "Round1 Score": data.round1_score,
          "Round1 Remarks": data.round1_remarks,
          "Round2 Score": data.round2_score,
          "Consolidated Score": data.consoli_score,
          Remarks: parse(data.remarks),
          Status: data.status,
        });
      });
      setcsvdata(csv);
    } catch (err) {
      showNotification(err.message);
    }
  };

  const sendReport = async (button) => {
    try {
      if (button === "college") {
        let res = await sendReportTo(2, placemail, id);
        if (res.data.success) {
          showNotification(res.data.message, "success");
        } else {
          showNotification(res.data.message, "error");
        }
      } else if (button === "approval") {
        let res = await sendReportTo(1, "", id);
        if (res.data.success) {
          showNotification(res.data.message, "success");
        } else {
          showNotification(res.data.message, "error");
        }
      } else if (button === "resume") {
        let resumeSelects = displayData.filter(
          (d) => d.status === "In Progress"
        );
        resumeSelects = resumeSelects.map((d) => {
          return d.email;
        });
        let res = await sendReportTo(3, resumeSelects.toString(), id);
        if (res.data.success) {
          showNotification(res.data.message, "success");
        } else {
          showNotification(res.data.message, "error");
        }
      }
    } catch (err) {
      showNotification(err.message);
    }
  };

  const style = {
    color: "blue",
    textDecoration: "underline",
    cursor: "pointer",
  };

  useEffect(() => {
    query.set("curr", currentPagination);
    query.set("per", perPage);
    history.push({
      pathname: location.pathname,
      search: query.toString(),
    });
  }, [currentPagination, perPage]);

  useEffect(() => {
    if (
      nameFilter === "" &&
      technologyFilter === "" &&
      hrFilter === "" &&
      interviewFilter === "" &&
      statusFilter === "" &&
      roundFilter === ""
    ) {
      if (
        query.get("name") ||
        query.get("tech") ||
        query.get("hr") ||
        query.get("inf") ||
        query.get("round") ||
        query.get("sts")
      ) {
        query.set("name", "");
        query.set("tech", "");
        query.set("hr", "");
        query.set("inf", "");
        query.set("round", "");
        query.set("sts", "");
        history.push({
          pathname: location.pathname,
          search: query.toString(),
        });
      }
      return;
    }
    if (
      nameFilter === query.get("name") &&
      technologyFilter === query.get("tech") &&
      hrFilter === query.get("hr") &&
      interviewFilter === query.get("inf") &&
      statusFilter === query.get("sts") &&
      roundFilter === query.get("round")
    ) {
      return;
    }
    query.set("curr", 1);
    setCurrentPagination(1);
    query.set("name", nameFilter ? nameFilter : "");
    query.set("tech", technologyFilter ? technologyFilter : "");
    query.set("hr", hrFilter ? hrFilter : "");
    query.set("inf", interviewFilter ? interviewFilter : "");
    query.set("sts", statusFilter ? statusFilter : "");
    query.set("round", roundFilter ? roundFilter : "");
    history.push({
      pathname: location.pathname,
      search: query.toString(),
    });
  }, [
    nameFilter,
    technologyFilter,
    hrFilter,
    interviewFilter,
    statusFilter,
    // endDateFilter,
    roundFilter,
    // startDateFilter,
  ]);

  useEffect(async () => {
    if (query.get("curr") && query.get("per")) {
      await setNameFilter(query.get("name") ? query.get("name") : "");
      await setTechnologyFilter(query.get("tech") ? query.get("tech") : "");
      await setHrFilter(query.get("hr") ? query.get("hr") : "");
      await setInterviewFilter(query.get("inf") ? query.get("inf") : "");
      await setStatusFilter(query.get("sts") ? query.get("sts") : "");
      await setRoundFilter(query.get("round") ? query.get("round") : "");
      getallcampus();
    }
  }, [
    query.get("curr"),
    query.get("per"),
    query.get("name"),
    query.get("tech"),
    query.get("hr"),
    query.get("inf"),
    query.get("sts"),
    query.get("round"),
    refresh,
  ]);

  //Generte CSV report
  const headerData = [
    "S.No",
    "Candidate Name",
    "Contact Number",
    "Mail Id",
    "Recruiter",
    "Evaluated By",
    "Role",
    "Skill",
    "Round1 Score",
    "Round1 Remarks",
    "Round2 Score",
    "Consolidated Score",
    "Remarks",
    "Status",
  ];
  const csvReport = {
    filename: "CampusRecruitmentList.csv",
    headers: headerData,
    data: csvdata,
  };
  var collegename = "",
    year = "",
    selected = 0,
    placemail = "",
    month = "",
    officername = "";
  var header = "";
  const [round1_cutoff, setround1_cutoff] = useState();
  const [round2_cutoff, setround2_cutoff] = useState();

  if (details.length > 0) {
    collegename = details[0].collegename;
    year = details[0].year;
    selected = details[0].selected;
    placemail = details[0].officermail;
    officername = details[0].officername;
    month = new Date(details[0].created_at);
    month = month.toLocaleString("default", { month: "long" });

    header = collegename + " - " + month + " " + year + " - " + selected;
  }
  const updateRecruiter = async (id, values, campusid) => {
    try {
      const res = await updateRecruit(values, id, campusid);
      if (res) {
        getallcampus();
        showNotification("Updated Successfully", "success");
      }
    } catch {
      showNotification("Something went wrong", "error");
    }
  };

  const sendMail = async () => {
    try {
      if (sendTaskData.length !== 0) {
        const res = await sendTaskMail(sendTaskData);
        let data = campusData;
        if (data) {
          data.map((d) => (d.selected = false));
        }
        setCampusData(data);
        setSendTaskData([]);
        setCheckAll(false);
        if (res.data.success) {
          showNotification(res.data.message, "success");
        } else {
          showNotification(res.data.message, "error");
        }
      } else {
        showNotification("Select candidates to send mail", "error");
      }
    } catch (e) {
      showNotification("Something went wrong", "error");
    }
  };

  const update_cutoff = async () => {
    try {
      if (round1_cutoff > 100 || round2_cutoff > 100) {
        showNotification("Enter Valid Cutoff", "error");
        return;
      }
      const res = await updatecutoff(
        parseInt(round1_cutoff),
        parseInt(round2_cutoff),
        id
      );
      if (res.success) {
        showNotification("Cut-Off Updated Successfully", "success");
        getallcampus();
        return;
      } else {
        showNotification("Something Went Wrong", "Error");
        return;
      }
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const addPermission = () => {
    const accessesProvided = [
      allAccesses["special_super-admin"],
      allAccesses["campus_create"],
      allAccesses["campus_admin"],
    ];
    if (accessesProvided.some((access) => roleAccess.includes(access))) {
      return true;
    }
    return false;
  };

  const editPermission = () => {
    const accessesProvided = [
      allAccesses["special_super-admin"],
      allAccesses["campus_update"],
      allAccesses["campus_admin"],
    ];
    if (accessesProvided.some((access) => roleAccess.includes(access))) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className="px-3 py-3 row">
        <div className=" px-2 py-2 col-sm-12 col-md-7 ">
          <PageTitle title={header} />
        </div>
        <div className="col-sm-12 col-md-5">
          <ExcelToJson
            getallcampus={getallcampus}
            disabled={!addPermission()}
          ></ExcelToJson>
        </div>
      </div>
      <div className="px-3 py-3 mt-3" style={{ backgroundColor: "#fff" }}>
        <form className={classes.handleForm}>
          <label htmlFor="placementOfficer">Placement Officer </label>
          <input
            disabled
            type="text"
            name="placementOfficer"
            value={officername}
          />
          <label htmlFor="MailId">Mail Id </label>
          <input
            disabled
            type="email"
            className="mb-2"
            name="MailId"
            value={placemail}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!addPermission()}
            onClick={() => history.push(`/Campus/${id}/new`)}
          >
            Add Candidates
          </button>
        </form>

        <div className={classes.head + " row mt-1 px-3"}>
          <button
            type="button"
            style={{ height: "40px" }}
            className="btn btn-primary col-lg-2 col-md-3 col-sm-10"
            onClick={() => sendMail()}
            disabled={!editPermission()}
          >
            Send Task Mail
          </button>
          <p className="d-inline ms-2 mt-2 col-lg-3 col-md-6 col-sm-10 row">
            Round 1 Cutoff :{" "}
            <input
              type="number"
              className="col-6"
              min="0"
              max="100"
              placeholder="CutOff in %"
              value={round1_cutoff}
              onChange={(e) => {
                setround1_cutoff(e.target.value);
              }}
              disabled={!editPermission()}
            />
          </p>
          <p className="d-inline ms-2 mt-2 col-lg-3 col-md-6 col-sm-10 row">
            Round 2 Cutoff :{" "}
            <input
              type="number"
              min="0"
              max="100"
              placeholder="CutOff in %"
              className="col-6"
              value={round2_cutoff}
              onChange={(e) => {
                setround2_cutoff(e.target.value);
              }}
              disabled={!editPermission()}
            />
          </p>
          <button
            type="submit"
            className="btn btn-primary col-lg-2 col-md-3 col-sm-6"
            style={{ height: "40px" }}
            onClick={() => update_cutoff()}
            disabled={!editPermission()}
          >
            Update Cut-Off
          </button>
        </div>
        <hr className="mb-5" />

        <SearchFilterNav>
          <Searchbar
            placeholder="Name / ✆ / ✉"
            search={nameFilter}
            // value={name}
            setSearch={setNameFilter}
            setCurrPage={setCurrentPagination}
            validationFunction={noValidate}
          />

          <Select
            onChange={(e) => {
              setCurrentPagination(1);
              setInterviewFilter(e ? e.value : "");
            }}
            value={
              interviewFilter !== ""
                ? pannelistOption.filter((hr) => hr.value === interviewFilter)
                : ""
            }
            isClearable
            isSearchable={true}
            options={pannelistOption}
            placeholder="Evaluator"
            className={classes.selectStyle}
          />
          <Select
            onChange={(e) => {
              setCurrentPagination(1);
              setTechnologyFilter(e ? e.value : "");
            }}
            value={
              technologyFilter
                ? technologyOption.filter(
                    (tech) => tech.value === technologyFilter
                  )
                : ""
            }
            isClearable
            isSearchable={true}
            options={technologyOption}
            placeholder={"Technology"}
            className={classes.selectStyle}
          />
          <Select
            onChange={(e) => {
              setCurrentPagination(1);
              setHrFilter(e ? e.value : "");
              // console.log(interviewFilter)
            }}
            value={
              hrFilter
                ? hrOptions.filter((tech) => tech.value === hrFilter)
                : ""
            }
            isClearable
            isSearchable={true}
            options={hrOptions}
            placeholder={"Recruiter"}
            className={classes.selectStyle}
          />

          <Select
            onChange={(e) => {
              setCurrentPagination(1);
              setRoundFilter(e ? e.value : "");
            }}
            value={
              roundFilter
                ? roundoptions.filter((tech) => tech.value === roundFilter)
                : ""
            }
            isClearable
            isSearchable={false}
            options={roundoptions}
            placeholder={"Rounds"}
            className={classes.selectStyle}
          />
          <Select
            onChange={(e) => {
              setCurrentPagination(1);
              setStatusFilter(e ? e.value : "");
            }}
            value={
              statusFilter
                ? statusoptions.filter((tech) => tech.value === statusFilter)
                : ""
            }
            // value={statusFilter ? statusFilter : ""}
            isClearable
            isSearchable={false}
            options={statusoptions}
            placeholder={"Status"}
            className={classes.selectStyle}
          />
          {(name !== "" ||
            hrFilter !== "" ||
            roundFilter !== "" ||
            technologyFilter !== "" ||
            interviewFilter !== "" ||
            statusFilter !== "") && (
            <span
              style={style}
              onClick={() => {
                setInterviewFilter("");
                setHrFilter("");
                setNameFilter("");
                setRoundFilter("");
                setTechnologyFilter("");
                setStatusFilter("");
              }}
            >
              Clear All
            </span>
          )}
        </SearchFilterNav>
        <div>
          <Table
            data={displayData}
            interviewerdata={pannelistOption}
            recruiterdata={hrOptions}
            skilldata={technologyOption}
            taskdata={taskOptions}
            details={details[0]}
            setrecruiter={setrecruiter}
            recruiter={recruiter}
            updateRecruiter={updateRecruiter}
            sendTaskData={sendTaskData}
            setSendTaskData={setSendTaskData}
            campusData={campusData}
            setCampusData={setCampusData}
            checkAll={checkAll}
            setCheckAll={setCheckAll}
            perPage={perPage}
            currentPagination={currentPagination}
            handleRefresh={handleRefresh}
            roleAccess={roleAccess}
          />
          <Pagination
            tableDataCount={tablevalue}
            perPage={perPage}
            setPerPage={setPerPage}
            currentPagination={currentPagination}
            setCurrentPagination={setCurrentPagination}
            perPageOption={[5, 10, 15, 20]}
          />
          {load && <Loading />}
        </div>
        <div className="mt-2 mb-4">
          <button
            className="btn btn-primary mb-3 me-3"
            onClick={() => sendReport("approval")}
            disabled={!editPermission() || total}
          >
            Send Report For Approval
          </button>

          <button className="btn btn-primary me-3 mb-3">
            <CSVLink
              style={{ color: "white", textDecoration: "none" }}
              {...csvReport}
            >
              Download Report
            </CSVLink>
          </button>

          <button
            className="btn btn-primary me-3 mb-3"
            onClick={() => sendReport("resume")}
            disabled={inProgress || !editPermission()}
          >
            Request resume from Candidates
          </button>

          <button
            className="btn btn-primary mb-3"
            onClick={() => sendReport("college")}
            disabled={select || !editPermission()}
          >
            Send Mail To Placement Officer
          </button>
        </div>
      </div>
    </>
  );
}
export default CampusRecruitment;

/* eslint-disable react-hooks/exhaustive-deps */
import { useAxiosLoader } from "Api/httpRequest";
import leavehistory from "Api/leavehistory";
import Pagination from "components/projects/Pagination/Pagination";
import LoadingPage from "pages/Loading/Loading";
import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import showNotification from "utils/showNotification.js";
import SearchFilterNav from "./../../common/SearchFilterNav/SearchFilterNav";
import classes from "./leavesHistory.module.css";
import LeavesBalanceTable from "./tables/LeavesBalanceTable";
import LeavesHistoryTable from "./tables/LeavesHistoryTable";
import LeavesTakenTable from "./tables/LeavesTakenTable";
const LeavesHistory = () => {
  //ALL RESPONSE STATES
  const [resourcesnamesoptions, setResourcesnameoptions] = useState([]);
  const [leavehistorytable, setLeavehistorytable] = useState([]);
  const [leavetakentable, setLeavetakentable] = useState([]);
  const [leavebalancetable, setLeavebalancetable] = useState([]);
  // OTHER STATES
  const Input = (props) => <components.Input {...props} maxLength={5} />;
  const [load] = useAxiosLoader();
  const [yearoptions, setYearoptions] = useState([]);
  //FILTER STATES
  const [namefilter, setNamefilter] = useState("");
  // Leave History table Filters
  const [leavehistoryleavetypefilter, setLeavehistoryleavetypefilter] =
    useState("");
  const [leavehistorystatusfilter, setLeavehistorystatusfilter] = useState("");
  const [leavehistoryquarterfilter, setLeavehistoryquarterfilter] = useState(
    {}
  );
  const [leavehistoryyearfilter, setLeavehistoryyearfilter] = useState("");
  //Pagination for Leave History table
  const [lhpage, setLhpage] = useState(1);
  const [lhperpage, setLhperpage] = useState(5);
  const [lhtotal, setLhtotal] = useState(0);
  // Leave Taken table Filters
  const [leavetakenquarterfilter, setLeavetakenquarterfilter] = useState({});
  const [leavetakenyearfilter, setLeavetakenyearfilter] = useState("");
  //Pagination for Leave Taken table
  const [ltpage, setLtpage] = useState(1);
  const [ltperpage, setLtperpage] = useState(5);
  const [lttotal, setLttotal] = useState(0);
  // Leave balance table Filters
  const [leavebalancequarterfilter, setLeavebalancequarterfilter] = useState(
    {}
  );
  const [leavebalanceyearfilter, setLeavebalanceyearfilter] = useState("");
  //Pagination for Leave Balance table
  const [lbpage, setLbpage] = useState(1);
  const [lbperpage, setLbperpage] = useState(5);
  const [lbtotal, setLbtotal] = useState(0);
  //USE EFFECTS
  useEffect(() => {
    getResourceNames();
    yearfilterfunction();
  }, []);
  useEffect(() => {
    namefilterchange();
  }, [namefilter]);
  useEffect(() => {
    if (namefilter === "") {
      return;
    } else if (
      leavehistoryleavetypefilter === "" &&
      leavehistoryquarterfilter === {} &&
      leavehistorystatusfilter === "" &&
      leavehistoryyearfilter === ""
    ) {
      return;
    }
    setLhpage(1);
    getLeaveHistory();
  }, [
    leavehistoryleavetypefilter,
    leavehistoryquarterfilter,
    leavehistorystatusfilter,
    leavehistoryyearfilter,
  ]);
  useEffect(() => {
    if (namefilter === "") {
      return;
    }
    getLeaveHistory();
  }, [lhpage, lhperpage]);
  useEffect(() => {
    if (namefilter === "") {
      return;
    }
    getLeaveTaken();
  }, [leavetakenquarterfilter, leavetakenyearfilter, ltpage, ltperpage]);
  useEffect(() => {
    if (namefilter === "") {
      return;
    }
    getLeaveBalance();
  }, [lbpage, lbperpage]);
  useEffect(() => {
    if (namefilter === "") {
      return;
    } else if (
      leavebalancequarterfilter === {} &&
      leavebalanceyearfilter === ""
    ) {
      return;
    }
    setLbpage(1);
    getLeaveBalance();
  }, [leavebalancequarterfilter, leavebalanceyearfilter]);
  //DB RETRIVAL
  const getLeaveHistory = async () => {
    try {
      const response = await leavehistory.getLeaveHistory(
        lhpage,
        lhperpage,
        leavehistorystatusfilter || "",
        leavehistoryquarterfilter || "",
        leavehistoryleavetypefilter || "",
        leavehistoryyearfilter || "",
        namefilter || ""
      );
      setLhtotal(response.total);
      setLeavehistorytable(response.result);
    } catch (error) {
      showNotification(error.message, "error");
    }
  };
  const getLeaveTaken = async () => {
    try {
      const response = await leavehistory.getLeaveTaken(
        ltpage,
        ltperpage,
        leavetakenquarterfilter || "",
        leavetakenyearfilter || "",
        namefilter || ""
      );
      setLttotal(response.total);
      setLeavetakentable(response.result);
    } catch (error) {
      showNotification(error.message, "error");
    }
  };
  const getLeaveBalance = async () => {
    try {
      const response = await leavehistory.getLeaveBalance(
        lbpage,
        lbperpage,
        leavebalancequarterfilter || "",
        leavebalanceyearfilter || "",
        namefilter || ""
      );
      setLbtotal(response.total);
      setLeavebalancetable(response.result);
    } catch (error) {
      showNotification(error.message, "error");
    }
  };
  const getResourceNames = async () => {
    try {
      const response = await leavehistory.getResourcesNames();
      const resourcesnames = response.name.map((option) => {
        return {
          label: option.name,
          value: option.id,
        };
      });
      setResourcesnameoptions(resourcesnames);
    } catch (error) {
      showNotification(error.message, "error");
    }
  };
  //FUNCTIONS
  const yearfilterfunction = () => {
    let year = [];
    let currentyear = new Date().getFullYear();
    for (let i = currentyear; i >= 2014; i--) {
      year.push(i);
    }
    let options = year.map((option) => {
      return {
        label: option,
        value: option,
      };
    });
    setYearoptions(options);
  };
  const namefilterchange = () => {
    setLeavehistoryleavetypefilter("");
    setLeavehistoryquarterfilter({});
    setLeavehistorystatusfilter("");
    setLeavehistoryyearfilter("");
    setLeavetakenquarterfilter({});
    setLeavebalancequarterfilter({});
    setLeavebalancetable([]);
    setLeavebalanceyearfilter("");
    setLeavetakenyearfilter("");
    setLeavehistorytable([]);
    setLeavetakentable([]);
    setLhpage(1);
    setLhperpage(5);
    setLhtotal(0);
    setLtpage(1);
    setLtperpage(5);
    setLttotal(0);
    setLbpage(1);
    setLbperpage(5);
    setLbtotal(0);
  };
  const changeleavebalancefilters = () => {
    setLeavebalanceyearfilter("");
    setLeavebalancequarterfilter({});
  };
  const changeleavehistoryfilters = () => {
    setLeavehistoryyearfilter("");
    setLeavehistoryquarterfilter({});
    setLeavehistoryleavetypefilter("");
    setLeavehistorystatusfilter("");
  };
  const changeleavetakenfilters = () => {
    setLeavetakenyearfilter("");
    setLeavetakenquarterfilter({});
  };
  //FILTER OPTIONS
  const statusOptions = [
    { value: "applied", label: "Applied" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "cancel requested", label: "Cancel Requested" },
    { value: "cancelled", label: "Cancelled" },
    { value: "cancel approved", label: "Cancel Approved" },
    { value: "cancel rejected", label: "Cancel Rejected" },
  ];
  const leaveTypeOptions = [
    { value: "loss of pay", label: "Loss Of Pay" },
    { value: "casual leave", label: "Casual Leave" },
    { value: "earned leave", label: "Earned Leave" },
    { value: "comp off", label: "Comp-Off" },
    { value: "maternity leave : mc", label: "Maternity Leave : MC" },
    { value: "official out", label: "Officially Out" },
    { value: "paternity leave", label: "Paternity Leave" },
    { value: "maternity leave", label: "Maternity Leave" },
    { value: "restricted leave", label: "Restricted Leave" },
    { value: "parental leave", label: "Parental Leave" },
  ];
  const quarter = [
    { value: { start: 1, end: 3 }, label: "Jan - Mar" },
    { value: { start: 4, end: 6 }, label: "Apr - Jun" },
    { value: { start: 7, end: 9 }, label: "Jul - Sep" },
    { value: { start: 10, end: 12 }, label: "Oct - Dec" },
  ];
  return (
    <div className="Container">
      <br></br>
      <SearchFilterNav>
        <div style={{ width: "220px" }}>
          <Select
            options={resourcesnamesoptions}
            value={
              namefilter !== ""
                ? resourcesnamesoptions.filter((h) => h.value === namefilter)
                : ""
            }
            components={{ Input }}
            isClearable
            placeholder={"Name"}
            onChange={(e) => {
              setNamefilter(e ? e.value : "");
            }}
          />
        </div>
      </SearchFilterNav>
      <div>
        <div className={classes.history}>
          <h5>Leaves Balance</h5>
          <br />
          <SearchFilterNav>
            <div style={{ width: "200px" }}>
              <Select
                options={quarter}
                components={{ Input }}
                value={
                  leavebalancequarterfilter !== {}
                    ? quarter.filter(
                        (h) =>
                          JSON.stringify(h.value) ===
                          JSON.stringify(leavebalancequarterfilter)
                      )
                    : {}
                }
                placeholder={"Quarter"}
                isClearable
                onChange={(e) => {
                  setLeavebalancequarterfilter(e ? e.value : {});
                }}
              />
            </div>
            <div style={{ width: "200px" }}>
              <Select
                options={yearoptions}
                components={{ Input }}
                isClearable
                placeholder={"Year"}
                value={
                  leavebalanceyearfilter !== ""
                    ? yearoptions.filter(
                        (h) => h.value === leavebalanceyearfilter
                      )
                    : ""
                }
                onChange={(e) => {
                  setLeavebalanceyearfilter(e ? e.value : "");
                }}
              />
            </div>
            {JSON.stringify(leavebalancequarterfilter) !== JSON.stringify({}) ||
            leavebalanceyearfilter !== "" ? (
              <p
                className={classes.clearAll}
                onClick={changeleavebalancefilters}
              >
                Clear All
              </p>
            ) : null}
          </SearchFilterNav>
          <LeavesBalanceTable data={leavebalancetable} />
          <Pagination
            tableDataCount={lbtotal}
            perPage={lbperpage}
            setPerPage={(data) => {
              setLbperpage(data);
            }}
            currentPagination={lbpage}
            setCurrentPagination={(data) => {
              setLbpage(data);
            }}
            perPageOption={[5, 10, 15, 20]}
          />
        </div>
      </div>
      <div>
        <div className={classes.history}>
          <h5>Leaves Taken</h5>
          <br />
          <SearchFilterNav>
            <div style={{ width: "200px" }}>
              <Select
                options={quarter}
                components={{ Input }}
                value={
                  leavetakenquarterfilter !== {}
                    ? quarter.filter(
                        (h) =>
                          JSON.stringify(h.value) ===
                          JSON.stringify(leavetakenquarterfilter)
                      )
                    : {}
                }
                placeholder={"Quarter"}
                isClearable
                onChange={(e) => {
                  setLeavetakenquarterfilter(e ? e.value : {});
                }}
              />
            </div>
            <div style={{ width: "200px" }}>
              <Select
                options={yearoptions}
                components={{ Input }}
                isClearable
                placeholder={"Year"}
                value={
                  leavetakenyearfilter !== ""
                    ? yearoptions.filter(
                        (h) => h.value === leavetakenyearfilter
                      )
                    : ""
                }
                onChange={(e) => {
                  setLeavetakenyearfilter(e ? e.value : "");
                }}
              />
            </div>
            {JSON.stringify(leavetakenquarterfilter) !== JSON.stringify({}) ||
            leavetakenyearfilter !== "" ? (
              <p className={classes.clearAll} onClick={changeleavetakenfilters}>
                Clear All
              </p>
            ) : null}
          </SearchFilterNav>
          <LeavesTakenTable data={leavetakentable} />
          <Pagination
            tableDataCount={lttotal}
            perPage={ltperpage}
            setPerPage={(data) => {
              setLtperpage(data);
            }}
            currentPagination={ltpage}
            setCurrentPagination={(data) => {
              setLtpage(data);
            }}
            perPageOption={[5, 10, 15, 20]}
          />
        </div>
      </div>
      <div>
        <div className={classes.history}>
          <h5>Leaves History</h5>
          <br />
          <SearchFilterNav>
            <div style={{ width: "200px" }}>
              <Select
                components={{ Input }}
                options={leaveTypeOptions}
                value={
                  leavehistoryleavetypefilter !== ""
                    ? leaveTypeOptions.filter(
                        (h) => h.value === leavehistoryleavetypefilter
                      )
                    : ""
                }
                isClearable
                placeholder={"Leave Type"}
                onChange={(e) => {
                  setLeavehistoryleavetypefilter(e ? e.value : "");
                }}
              />
            </div>
            <div style={{ width: "200px" }}>
              <Select
                options={statusOptions}
                components={{ Input }}
                value={
                  leavehistorystatusfilter !== ""
                    ? statusOptions.filter(
                        (h) => h.value === leavehistorystatusfilter
                      )
                    : ""
                }
                isClearable
                placeholder={"Status"}
                onChange={(e) => {
                  setLeavehistorystatusfilter(e ? e.value : "");
                }}
              />
            </div>
            <div style={{ width: "200px" }}>
              <Select
                options={quarter}
                components={{ Input }}
                value={
                  leavehistoryquarterfilter !== {}
                    ? quarter.filter(
                        (hr) =>
                          JSON.stringify(hr.value) ===
                          JSON.stringify(leavehistoryquarterfilter)
                      )
                    : ""
                }
                isClearable
                placeholder={"Quarter"}
                onChange={(e) => {
                  setLeavehistoryquarterfilter(e ? e.value : {});
                }}
              />
            </div>
            <div style={{ width: "200px" }}>
              <Select
                components={{ Input }}
                options={yearoptions}
                isClearable
                placeholder={"Year"}
                value={
                  leavehistoryyearfilter !== ""
                    ? yearoptions.filter(
                        (hr) => hr.value === leavehistoryyearfilter
                      )
                    : ""
                }
                onChange={(e) => {
                  setLeavehistoryyearfilter(e ? e.value : "");
                }}
              />
            </div>
            {JSON.stringify(leavehistoryquarterfilter) !== JSON.stringify({}) ||
            leavehistoryyearfilter !== "" ||
            leavehistorystatusfilter !== "" ||
            leavehistoryleavetypefilter !== "" ? (
              <p
                className={classes.clearAll}
                onClick={changeleavehistoryfilters}
              >
                Clear All
              </p>
            ) : null}
          </SearchFilterNav>
          <LeavesHistoryTable data={leavehistorytable} />
          <Pagination
            tableDataCount={lhtotal}
            perPage={lhperpage}
            setPerPage={(data) => {
              setLhperpage(data);
            }}
            currentPagination={lhpage}
            setCurrentPagination={(data) => {
              setLhpage(data);
            }}
            perPageOption={[5, 10, 15, 20]}
          />
        </div>
      </div>
      {load && <LoadingPage />}
    </div>
  );
};

export default LeavesHistory;

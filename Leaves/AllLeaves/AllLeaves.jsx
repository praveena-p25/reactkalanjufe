/* eslint-disable react-hooks/exhaustive-deps */
import { getAllLeaves } from "Api/Leaves";
import Searchbar from "components/common/SearchBar/Searchbar";
import SearchFilterNav from "components/common/SearchFilterNav/SearchFilterNav";
import Pagination from "components/projects/Pagination/Pagination";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Select from "react-select";
import showNotification from "utils/showNotification";
import { validateTextWithoutNumbers } from "utils/textValidation";
import CommonLeavesTable from "../CommonLeavesTable/CommonLeavesTable";
import classes from "./AllLeaves.module.css";
const filterDefaults = {
  name: "",
  status: "",
  leave_type: "",
  from: "",
  to: "",
  branch: "",
};

const calanderRedirectFilters = {
  WA: { status: 0 },
  LOP: { leave_type: 0, status: 1 },
  CL: { leave_type: 1, status: 1 },
  EL: { leave_type: 2, status: 1 },
  COF: { leave_type: 3, status: 1 },
  OFO: { leave_type: 4, status: 1 },
  PL: { leave_type: 5, status: 1 },
  ML: { leave_type: 6, status: 1 },
  RL: { leave_type: 8, status: 1 },
  MLMC: { leave_type: 7, status: 1 },
  CLE: { leave_type: 9, status: 1 },
  EXL: { leave_type: 10, status: 1 },
};

const AllLeaves = ({ formData, filterOptions }) => {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);

  //LOADER
  const [loader, setloader] = useState(false);

  //LEAVES AND BRANCHES
  const [leaves, setLeaves] = useState([]);
  const [branches, setBranches] = useState([]);

  // SET BASIC FILTERS
  function setQueryFilters() {
    const status_type = query.get("status_type");
    const filter_calander = calanderRedirectFilters[status_type];
    const newFilter = { ...filterDefaults };
    if (status_type && filter_calander) {
      if (status_type !== "WA") {
        newFilter.leave_type =
          filterOptions.leave_type[filter_calander.leave_type] ||
          newFilter.leave_type;
      }
      newFilter.status =
        filterOptions.status[filter_calander.status] || newFilter.status;
      newFilter.from = query.get("start");
      newFilter.to = query.get("end");
    } else {
      Object.keys(newFilter).forEach((filterKey) => {
        if (filterKey === "status")
          newFilter[filterKey] =
            filterOptions.status.find(
              (st) => st.value === query.get(filterKey)
            ) || "";
        else if (filterKey === "leave_type")
          newFilter[filterKey] =
            filterOptions.leave_type.find(
              (st) => st.value === query.get(filterKey)
            ) || "";
        else if (filterKey === "branch" && query.get(filterKey))
          newFilter[filterKey] = branches.find(
            (st) => st.value === query.get(filterKey)
          ) || { value: +query.get(filterKey), id: +query.get(filterKey) };
        else newFilter[filterKey] = query.get(filterKey) || "";
      });
    }
    return newFilter;
  }
  //FILTERS
  const [filters, setFilters] = useState(setQueryFilters);
  //LEAVES COUNT
  const [leavesCount, setLeavesCount] = useState(0);
  //PAGINATION USESTATE
  const [perPage, setPerPage] = useState(+query.get("per") || 5);
  const [currPage, setCurrPage] = useState(+query.get("curr") || 1);

  //FILTER SET HANDLER
  const filterSetHandler = (filterKey, e) => {
    const queryParams = new URLSearchParams(location.search);
    const newQuery = {};
    if (queryParams.get("curr")) newQuery.curr = queryParams.get("curr");
    if (queryParams.get("per")) newQuery.per = queryParams.get("per");
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (typeof value === "string") newQuery[key] = value;
        else if (typeof value === "object") newQuery[key] = value.value;
      }
    });
    if (e) {
      if (typeof e === "string") newQuery[filterKey] = e;
      else if (typeof e === "object") newQuery[filterKey] = e.value;
    } else {
      delete newQuery[filterKey];
    }
    history.replace({
      pathname: location.pathname,
      hash: location.hash,
      search: new URLSearchParams(newQuery).toString(),
    });
    setFilters((prev) => {
      return {
        ...prev,
        [filterKey]: e,
      };
    });
    setCurrPage(1);
  };

  //FETCH ALL LEAVES
  const fetchAllLeaves = async () => {
    setloader(true);
    try {
      const responseData = await getAllLeaves({
        name: filters.name || undefined,
        status: filters.status?.value || undefined,
        leave_type: filters.leave_type?.value || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
        branch: filters.branch?.value || undefined,
        currPage: +currPage || 1,
        perPage: +perPage || 5,
      });
      setLeaves([...responseData.data]);
      setLeavesCount(responseData.count);
      setBranches(responseData.branches);
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setloader(false);
    }
  };

  // USE EFFECT FOR FILTERS
  useEffect(() => {
    fetchAllLeaves();
  }, [filters, currPage, perPage, history]);
  console.log(filters.from, "Filters Inital date");

  return (
    <div className={classes.AllLeaves}>
      <SearchFilterNav>
        <Searchbar
          search={filters.name}
          setSearch={(e) => filterSetHandler("name", e ? e : "")}
          setCurrPage={setCurrPage}
          validationFunction={validateTextWithoutNumbers}
          placeholder="Name"
        />
        <div style={{ width: "200px" }}>
          <Select
            placeholder="Leave Type"
            value={filters.leave_type}
            options={filterOptions.leave_type}
            onChange={(e) => filterSetHandler("leave_type", e ? e : "")}
            isClearable
          />
        </div>
        <div style={{ width: "200px" }}>
          <Select
            placeholder="Status"
            value={filters.status}
            options={filterOptions.status}
            onChange={(e) => filterSetHandler("status", e ? e : "")}
            isClearable
          />
        </div>
        <div>
          <input
            className={`form-control ${classes.borderBox}`}
            type={filters.from ? "date" : "text"}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) =>
              filters.from ? (e.target.type = "date") : (e.target.type = "text")
            }
            autoComplete="off"
            value={filters.from}
            placeholder="From Date"
            onChange={(e) => {
              if (!e.target.value) {
                e.target.type = "text";
              }
              filterSetHandler("from", e.target.value);
            }}
            style={{
              width: "180px",
            }}
          />
        </div>
        <div>
          <input
            className={`form-control ${classes.borderBox}`}
            type={filters.to ? "date" : "text"}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) =>
              filters.to ? (e.target.type = "date") : (e.target.type = "text")
            }
            autoComplete="off"
            value={filters.to}
            placeholder="To Date"
            onChange={(e) => filterSetHandler("to", e.target.value)}
            style={{
              width: "180px",
            }}
          />
        </div>
        <div style={{ width: "200px" }}>
          <Select
            placeholder="Branch"
            value={
              filters.branch?.value !== ""
                ? branches.filter((h) => h.value === filters.branch?.value)
                : ""
            }
            // value={branches.find((st) => st.value === filters.branch?.value)}
            options={branches}
            onChange={(e) => filterSetHandler("branch", e ? e : "")}
            isClearable
          />
        </div>
        {Object.values(filters).find((filter) => !!filter) && (
          <span
            className={`text-primary ${classes.clearAll}`}
            onClick={() => {
              setFilters(filterDefaults);
              setCurrPage(1);
              history.replace({
                pathname: location.pathname,
                hash: location.hash,
              });
            }}
          >
            Clear All
          </span>
        )}
      </SearchFilterNav>
      <CommonLeavesTable formData={formData} data={leaves} loading={loader} />
      <Pagination
        tableDataCount={leavesCount}
        perPage={perPage}
        setPerPage={setPerPage}
        currentPagination={currPage}
        setCurrentPagination={setCurrPage}
        perPageOption={[5, 10, 15, 20]}
      />
    </div>
  );
};

export default AllLeaves;

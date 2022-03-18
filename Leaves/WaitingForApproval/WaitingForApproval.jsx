/* eslint-disable react-hooks/exhaustive-deps */
import { approveLeave, getWaitingLeaves, rejectLeave } from "Api/Leaves";
import Searchbar from "components/common/SearchBar/Searchbar";
import SearchFilterNav from "components/common/SearchFilterNav/SearchFilterNav";
import Pagination from "components/projects/Pagination/Pagination";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Select from "react-select";
import showNotification from "utils/showNotification";
import { validateTextWithoutNumbers } from "utils/textValidation";
import CommonLeavesTable from "../CommonLeavesTable/CommonLeavesTable";
import classes from "./WaitingForApproval.module.css";

const filterDefaults = {
  name: "",
  leave_type: "",
  branch: "",
};

const Waitingforapproval = ({ formData, filterOptions }) => {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);

  //LOADER
  const [loader, setloader] = useState(false);

  const [leaves, setLeaves] = useState([]);
  const [branches, setBranches] = useState([]);
  // SET BASIC FILTERS
  function setQueryFilters() {
    const newFilter = { ...filterDefaults };
    Object.keys(newFilter).forEach((filterKey) => {
      if (filterKey === "leave_type")
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
    return newFilter;
  }
  const [filters, setFilters] = useState(setQueryFilters);
  const [leavesCount, setLeavesCount] = useState(0);
  const [perPage, setPerPage] = useState(+query.get("per") || 5);
  const [currPage, setCurrPage] = useState(+query.get("curr") || 1);

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
  const fetchWaitingLeaves = async () => {
    setloader(true);
    try {
      const queryParams = new URLSearchParams({
        name: filters.name || "",
        leave_type: filters.leave_type?.value || "",
        branch: filters.branch?.value || "",
        curr: currPage,
        per: perPage,
      });
      history.push(location, {
        pathname: location.pathname,
        search: queryParams.toString(),
        hash: location.hash,
      });
      const responseData = await getWaitingLeaves({
        name: filters.name || undefined,
        leave_type: filters.leave_type?.value || undefined,
        branch: filters.branch?.value || undefined,
        currPage: +currPage || 1,
        perPage: +perPage || 5,
      });
      setLeaves(responseData.data);
      setLeavesCount(responseData.count);
      setBranches(responseData.branches);
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setloader(false);
    }
  };

  // use effect for filters
  useEffect(() => {
    fetchWaitingLeaves();
  }, [filters, currPage, perPage, history]);

  const approveLeaveAction = async (leaveId) => {
    try {
      const response = await approveLeave(leaveId);
      showNotification(response.message, "success");
      fetchWaitingLeaves();
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const rejectLeaveAction = async (leaveId) => {
    try {
      const response = await rejectLeave(leaveId);
      showNotification(response.message, "success");
      fetchWaitingLeaves();
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <div className={classes.Waitingforapproval}>
      <SearchFilterNav>
        <Searchbar
          search={filters.name}
          setSearch={(e) => filterSetHandler("name", e ? e : "")}
          validationFunction={validateTextWithoutNumbers}
          setCurrPage={setCurrPage}
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
            placeholder="Branch"
            value={
              filters.branch?.value !== ""
                ? branches.filter((h) => h.value === filters.branch?.value)
                : ""
            }
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
      <CommonLeavesTable
        formData={formData}
        data={leaves}
        loading={loader}
        approveLeave={approveLeaveAction}
        rejectLeave={rejectLeaveAction}
      />
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

export default Waitingforapproval;

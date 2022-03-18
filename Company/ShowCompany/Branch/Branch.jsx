import SearchFilter from "components/projects/SearchFilter/SearchFilter.jsx";
import React, { useEffect, useState } from "react";
import Table from "../Table/Table";
import classes from "./Branch.module.css";

const Branch = ({ data }) => {
  const [displayData, setDisplayData] = useState({ head: [], body: [] });
  useEffect(() => {
    setDisplayData(data);
  }, [data]);
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
    <div className={classes.leaves}>
      <div className={classes.searchbranch}>
        <SearchFilter
          fields={searchFilterFields}
          setDisplayData={alterDisplayData}
          page="company"
        />
      </div>
      <Table data={displayData} mode={"show"} tabletype={"branch"} />
    </div>
  );
};

export default Branch;

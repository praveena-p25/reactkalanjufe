import React from "react";

import classes from "./PageTitle.module.css";

const PageTitle = ({ title }) => {
  return (
    <div className={`row ${classes.container}`}>
      <div className="col-12 col-sm-12 col-md-6 col-lg-12">
        <h1 className={classes.title}>{title}</h1>
      </div>
    </div>
  );
};

export default PageTitle;

import React from "react";
import { useHistory } from "react-router-dom";
import classes from "./AccessPageTitle.module.css";

const AccessPageTitle = ({ title, button, url, secondButton, url2 }) => {
  const history = useHistory();
  return (
    <div className={classes.pageTitle}>
      <div className={classes.container}>
        <h1 className={classes.title}>{title}</h1>
        <div>
          {secondButton ? (
            <button
              style={{ marginRight: "10px" }}
              className={`btn btn-primary ${classes.button}`}
              onClick={() => history.push(url2)}
            >
              {secondButton}
            </button>
          ) : null}

          {button ? (
            <button
              className={`btn btn-primary ${classes.button}`}
              onClick={() => history.push(url)}
            >
              {button}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AccessPageTitle;

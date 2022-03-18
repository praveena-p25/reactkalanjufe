import React from "react";
import classes from "../../../components/projects/ShowProject/BasicInfo/BasicInfo.module.css";

const BasicInfo = ({ data }) => {
  return (
    <div className={classes.basicInfo}>
      <div className={classes.container}>
        {data.map((item) => {
          return (
            <label
              style={{ gridColumn: item.type === "description" && "span 2" }}
            >
              {item.label}
              <p>{item.detail}</p>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default BasicInfo;

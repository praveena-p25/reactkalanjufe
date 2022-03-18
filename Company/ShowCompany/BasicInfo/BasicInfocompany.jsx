import React from "react";
import classes from "./BasicInfo.module.css";

const BasicInfo = ({ data }) => {
  return (
    <div className={classes.basicInfo}>
      <div className={classes.container}>
        {data.map((item, i) => {
          if (item.field === "logo") {
            return (
              <label
                key={i}
                style={{
                  gridColumn: item.type === "description" && "span 2",
                  gridRow: "span 4",
                }}
              >
                {item.label}
                <img
                  style={{
                    height: "140px",
                    width: "140px",
                    display: "block",
                    borderRadius: "50%",
                  }}
                  src={window.storagebucket(item.detail)}
                  alt="img"
                ></img>
              </label>
            );
          }
          return (
            <label
              key={i}
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

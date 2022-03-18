import React from "react";
import classes from "./Select.module.css";

const Select = ({ label, required, options, value, onChange }) => {
  return (
    <div className={`form-group ${classes.select}`}>
      <label>
        {label}
        {required && " *"}
        <select className="form-control" value={value} onChange={onChange}>
          {options.map((option, idx) => {
            return <option key={idx}>{option}</option>;
          })}
        </select>
      </label>
    </div>
  );
};

export default Select;

import React from "react";
import "./Input.module.css";
import classes from "./Input.module.css";

const Input = ({
  type,
  label,
  placeholder,
  required,
  value,
  onChange,
  pattern,
  accept,
  autoComplete,
}) => {
  return (
    <div className={`form-group ${classes.input}`}>
      <label>
        {label}
        {required && " *"}
        <input
          type={type}
          pattern={pattern}
          accept={accept}
          className={`form-control`}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          value={value}
          onChange={onChange}
        />
      </label>
    </div>
  );
};

export default Input;

import React from "react";
import classes from "./Select.module.css";

const Select = ({
  label,
  required,
  options,
  value,
  onChange,
  placeholder,
  isObject,
  onBlur,
}) => {
  return (
    <div className={`form-group ${classes.select}`}>
      <label>
        {label}
        {required && " *"}
        <select
          onBlur={onBlur}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='grey' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
          }}
          className="form-select"
          value={value}
          onChange={onChange}
          required={required}
        >
          <option key="default" hidden value="">
            {placeholder}
          </option>
          {isObject &&
            options &&
            options.map((option, idx) => {
              return (
                <option value={option.value} key={idx}>
                  {option.name}
                </option>
              );
            })}
          {!isObject &&
            options &&
            options.map((option, idx) => {
              return <option key={idx}>{option}</option>;
            })}
        </select>
      </label>
    </div>
  );
};

export default Select;

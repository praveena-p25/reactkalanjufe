/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import Select from "react-select";

export default ({
  onChange,
  options,
  value,
  className,
  placeholder,
  disabled,
}) => {
  const defaultValue = (options, value) => {
    return options ? options.find((option) => option.value === value) : "";
  };

  return (
    <div className={className}>
      <Select
        placeholder={placeholder}
        value={defaultValue(options, value)}
        onChange={(value) => {
          onChange(value);
        }}
        isClearable
        options={options}
        maxMenuHeight={190}
        isDisabled={disabled}
      />
    </div>
  );
};

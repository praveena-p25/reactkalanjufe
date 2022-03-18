import React from "react";
import FormContainer from "../../../common/FormikFormContainer/FormContainer";
import classes from "./BasicInfo.module.css";

const BasicInfo = ({ data, formSubmitHandler }) => {
  return (
    <div className={classes.basicInfo}>
      <FormContainer
        data={data}
        saveButtonName="Update"
        formSubmitHandler={formSubmitHandler}
      />
    </div>
  );
};

export default BasicInfo;

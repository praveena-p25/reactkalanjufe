import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { CloudUploadFill } from "react-bootstrap-icons";
import Select from "react-select";
import ToggleSwitch from "../../../../components/common/ToggleSwitch/ToggleSwitch";
import classes from "./FormContainer.module.css";
import { debounceForFunction } from "utils/debounce";
const FormContainer = ({
  data,
  saveButtonName,
  style,
  page,
  formSubmitHandler = () => {},
  changeHandler = () => {},
  cancelHandler = () => {},
  hideButtons,
}) => {
  let myRefs = useRef([]);
  const resetRef = useRef();
  const [showLogo, setShowLogo] = useState(false);
  const [files, setfiles] = useState({});
  const fieldsObj = {};
  data.forEach((field) => {
    fieldsObj[field.state] = field.value ? field.value : "";
  });
  const [state, setState] = useState(fieldsObj);

  useEffect(() => {
    const fieldsObj = {};
    data.forEach((field) => {
      if (field.type === "toggle") {
        fieldsObj[field.state] = field.value ? field.value : false;
      } else {
        fieldsObj[field.state] = field.value ? field.value : "";
      }
    });
    setState(fieldsObj);
    resetRef.current.click();
  }, [data]);

  // const cancelHandler = (event) => {
  //   event.preventDefault();
  //   history.goBack();
  // };

  const reset = (resetForm, setFieldValue) => {
    resetForm();
    data.forEach((d) => {
      setFieldValue(d.state, d.value);
    });
  };

  const submit = async (values, files, resetForm) => {
    let res = await formSubmitHandler(values, files);
    if (res) {
      resetForm();
    }
  };
  const submitWithDebounce = debounceForFunction(submit, 600);

  let cancelbtnClass = `btn btn-outline-danger ${classes.cancel}`;
  if (page === "client" || page === "address" || page === "payment") {
    cancelbtnClass = classes.hide;
  }
  return (
    <div className={classes.formContainer} style={style}>
      <div className={classes.container}>
        <Formik
          initialValues={state}
          validate={(values) => {
            const errors = {};
            data.forEach((d) => {
              if (
                d.pattern &&
                !new RegExp(d.pattern, "i").test(values[d.state])
              ) {
                errors[d.state] = `Enter a valid ${d.label}`;
              }
              if (d.required && values[d.state] === "") {
                errors[d.state] = `${d.label} is required`;
              }
              if (d.minlength && values[d.state]?.length > d.minlength) {
                errors[
                  d.state
                ] = `${d.label} field should have maximum ${d.minlength} characters`;
              }
              if (d.type === "file" && d.acceptExt && values[d.state] !== "") {
                if (
                  typeof values[d.state] === "string" &&
                  !d.acceptExt.includes(
                    values[d.state]
                      .split(".")
                      [values[d.state].split(".").length - 1]?.toLowerCase()
                  )
                ) {
                  errors[d.state] = `Upload a valid file`;
                }
              }
            });
            return errors;
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            // submit(values, files)
            submitWithDebounce(values, files, resetForm);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            handleSubmit,
            resetForm,
            handleReset,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {data.map((info, idx) => {
                switch (info.type) {
                  case "file":
                    return (
                      <div className={`form-group ${classes.input}`} key={idx}>
                        <label>
                          {info.label}
                          {info.required && " *"}
                          <CloudUploadFill
                            style={{
                              fontSize: "26px",
                              color: "#106DFA",
                              zIndex: "1",
                              display: "block",
                              position: "absolute",
                              margin: "10px",
                            }}
                            onClick={() => {
                              myRefs.current[idx].click();
                            }}
                          />
                          <span
                            style={{
                              marginTop: "10px",
                              display: "block",
                              marginLeft: "45px",
                              textAlign: "start",
                            }}
                          >
                            {typeof values[info.state] == "string"
                              ? values[info.state].includes("\\")
                                ? values[info.state].split("\\")[
                                    values[info.state].split("\\").length - 1
                                  ]
                                : values[info.state]
                              : ""}
                          </span>
                        </label>

                        {state[info.state] && state[info.state] !== "" && (
                          <p
                            onClick={() => {
                              setShowLogo(true);
                            }}
                            style={{
                              textDecoration: "underline",
                              cursor: "default",
                            }}
                            className="text-primary text-center mx-3 mt-2"
                          >
                            {" "}
                            {`View current ${info.label}`}
                          </p>
                        )}

                        <Modal
                          show={showLogo}
                          onHide={() => {
                            setShowLogo(false);
                          }}
                          contentClassName="p-0"
                        >
                          <Modal.Body
                            style={{ padding: "0px", height: "400px" }}
                          >
                            {state[info.state].endsWith(".pdf") ? (
                              <embed
                                width="100%"
                                height="100%"
                                src={`https://docs.google.com/gview?url=${window.storagebucket(
                                  state[info.state]
                                )}&embedded=true`}
                              />
                            ) : (
                              <img
                                width="100%"
                                height="100%"
                                src={window.storagebucket(state[info.state])}
                                alt="img"
                              />
                            )}
                          </Modal.Body>
                        </Modal>

                        <div className={classes.errorMessage}>
                          {errors[info.state] &&
                            touched[info.state] &&
                            errors[info.state]}
                        </div>

                        <input
                          className="form-control d-none"
                          key={idx}
                          name={info.state}
                          ref={(el) => (myRefs.current[idx] = el)}
                          type={info.inputType}
                          label={info.label}
                          accept={info.accept}
                          placeholder={info.placeholder}
                          // value={values[info.state] ? values[info.state] : ""}
                          onChange={(event) => {
                            if (event.target.type === "file") {
                              setfiles((prev) => {
                                let tempVar = {
                                  ...prev,
                                  [info.state]: event.target.files[0],
                                };
                                changeHandler(values, tempVar);
                                handleChange(event);
                                return tempVar;
                              });
                            }
                          }}
                        />
                      </div>
                    );
                  case "input":
                    return (
                      <div className={`form-group ${classes.input}`} key={idx}>
                        <label>
                          {info.label}
                          {info.required && " *"}
                          <input
                            onKeyPress={(e) => {
                              if (info.inputType === "date") {
                                e.preventDefault();
                              }
                            }}
                            name={info.state}
                            onChange={(e) => {
                              let valCopy = { ...values };
                              valCopy[info.state] = e.target.value || "";
                              handleChange(e);
                              changeHandler(valCopy);
                            }}
                            style={info.style}
                            onBlur={handleBlur}
                            value={values[info.state]}
                            min={info.min}
                            max={info.max}
                            className={`form-control ${
                              info.inputType === "date" ? classes.date : ""
                            }`}
                            type={info.inputType}
                            accept={info.accept}
                            autoComplete="off"
                            placeholder={info.placeholder}
                          />
                        </label>
                        <div className={classes.errorMessage}>
                          {errors[info.state] &&
                            touched[info.state] &&
                            errors[info.state]}
                        </div>
                      </div>
                    );
                  case "select":
                    return (
                      <div
                        className={`form-group ${classes.input}`}
                        key={idx}
                        style={{ gridColumn: info.gridColumn }}
                      >
                        <label style={{ width: "100%" }}>
                          {info.label}
                          {info.required && " *"}
                          <Select
                            key={idx}
                            styles={{
                              control: (base, state) => {
                                return {
                                  ...base,
                                  border: "1px solid #ced4da",
                                  boxShadow: "none",
                                  "&:hover": {
                                    border: "1px solid #ced4da",
                                  },
                                };
                              },
                            }}
                            onFocus={(e) => {
                              e.target.parentElement.parentElement.parentElement.parentElement.style.boxShadow =
                                "0 0 0 0.25rem rgb(13 110 253 / 25%)";
                            }}
                            onBlur={(e) => {
                              e.target.parentElement.parentElement.parentElement.parentElement.style.boxShadow =
                                "none";
                              handleBlur(e);
                            }}
                            className={`${classes.select}`}
                            placeholder={info.placeholder}
                            onChange={(val) => {
                              let valCopy = { ...values };
                              valCopy[info.state] = val.value || "";
                              val
                                ? setFieldValue(info.state, val.value)
                                : setFieldValue(info.state, "");
                              changeHandler(valCopy);
                            }}
                            value={
                              (values[info.state] ||
                                values[info.state] === 0) &&
                              values[info.state] !== ""
                                ? {
                                    label: info.options.find(
                                      (opt) => opt.value === values[info.state]
                                    )?.label,
                                    value: values[info.state],
                                  }
                                : ""
                            }
                            name={info.state}
                            options={info.options}
                          />
                        </label>
                        <div className={classes.errorMessage}>
                          {errors[info.state] &&
                            touched[info.state] &&
                            errors[info.state]}
                        </div>
                      </div>
                    );
                  case "textarea":
                    return (
                      <div
                        className={`form-group ${classes.input}`}
                        key={idx}
                        style={{ gridColumn: info.gridColumn }}
                      >
                        <label style={{ width: "100%" }}>
                          {info.label}
                          {info.required && " *"}
                          <textarea
                            className="form-control"
                            placeholder={info.placeholder}
                            name={info.state}
                            value={values[info.state]}
                            onChange={(e) => {
                              let valCopy = { ...values };
                              valCopy[info.state] = e.target.value || "";
                              handleChange(e);
                              changeHandler(valCopy);
                            }}
                            onBlur={handleBlur}
                          />
                        </label>
                        <div className={classes.errorMessage}>
                          {errors[info.state] &&
                            touched[info.state] &&
                            errors[info.state]}
                        </div>
                      </div>
                    );
                  case "toggle":
                    return (
                      <div className={`form-group ${classes.input}`} key={idx}>
                        <label style={{ width: "100%" }}>{info.label}</label>
                        <br />
                        <div className={classes.toggleSwitch}>
                          <ToggleSwitch
                            style={{ marginTop: "6px" }}
                            value={values[info.state]}
                            onChange={(val) => {
                              let valCopy = { ...values };
                              valCopy[info.state] = val.target.checked || false;
                              val
                                ? setFieldValue(info.state, val.target.checked)
                                : setFieldValue(info.state, false);
                              changeHandler(valCopy);
                            }}
                            name={info.state}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
              {hideButtons ? null : (
                <>
                  <div style={{ gridColumn: "span 2" }}>
                    <button
                      onClick={cancelHandler}
                      type="button"
                      className={cancelbtnClass}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`btn btn-primary btn-md ${classes.submit} ${
                        page === "client" && classes.gstSave
                      }`}
                      style={{
                        display: page === "address" ? "none" : null,
                        gridColumn: page === "payment" ? "1" : null,
                        marginLeft: "20px",
                        // width: "82.98px",
                      }}
                    >
                      {saveButtonName ? saveButtonName : "Save"}
                    </button>{" "}
                  </div>
                </>
              )}
              <button
                className="d-none"
                type="button"
                ref={resetRef}
                onClick={(e) => {
                  e.preventDefault();
                  reset(resetForm, setFieldValue);
                }}
              ></button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default FormContainer;

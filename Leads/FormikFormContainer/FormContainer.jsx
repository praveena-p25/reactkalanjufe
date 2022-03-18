/* eslint-disable no-unused-vars */

import { useHistory } from "react-router-dom";
import RichTextEditor from "react-rte";
import Select from "react-select";

import SkillPill from "components/projects/Components/SkillPills/SkillPills";
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Modal, CloseButton, Form, Button } from "react-bootstrap";
import { CloudUploadFill } from "react-bootstrap-icons";
import showNotification from "utils/showNotification";
import ToggleSwitch from "../../common/ToggleSwitch/ToggleSwitch";

import classes from "./FormContainer.module.css";

const maxTextLength = 60;

const FormContainer = ({
  data,
  saveButtonName,
  style,
  page,
  pageClassName = "",
  formSubmitHandler = () => {},
  changeHandler = () => {},
  hideButtons,
  isModal = false,
}) => {
  let myRefs = useRef([]);
  const [showLogo, setShowLogo] = useState(false);
  const resetRef = useRef();
  const [files, setfiles] = useState({});
  const fieldsObj = {};
  data.forEach((field) => {
    if (!field.state) {
      return;
    }
    if (field.type === "toggle") {
      fieldsObj[field.state] = field.value ? field.value : false;
    } else if (field.type === "rte") {
      fieldsObj[field.state] = field.value
        ? field.value
        : RichTextEditor.createEmptyValue();
    } else if (field.type === "multiskill") {
      fieldsObj[field.state] = field.value
        ? {
            ...field.value,
            skills: field.value.skills.map((skill) => {
              return {
                ...skill,
              };
            }),
          }
        : "";
    } else {
      fieldsObj[field.state] = field.value ? field.value : "";
    }
  });
  //USESTATES
  const [state, setState] = useState(fieldsObj);
  const [show, setShow] = useState(false);
  const [reasonButton, setReasonButton] = useState(true);
  const [leadStatus, setLeadStatus] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fieldsObj = {};
    data.forEach((field) => {
      if (!field.state) {
        return;
      }
      if (field.type === "toggle") {
        fieldsObj[field.state] = field.value ? field.value : false;
      } else if (field.type === "rte") {
        fieldsObj[field.state] = field.value
          ? field.value
          : RichTextEditor.createEmptyValue();
      } else if (field.type === "multiskill") {
        fieldsObj[field.state] = field.value
          ? {
              ...field.value,
              skills: field.value.skills.map((skill) => {
                return {
                  ...skill,
                };
              }),
            }
          : "";
      } else {
        fieldsObj[field.state] = field.value ? field.value : "";
      }
    });
    setState(fieldsObj);
    resetRef.current.click();
  }, [data]);
  //CANCEL HANDLER
  const cancelHandler = (event) => {
    event.preventDefault();
    history.goBack();
  };

  const reset = (resetForm, setFieldValue) => {
    resetForm();
    data.forEach((d) => {
      if (!d.state) {
        return;
      }
      if (d.type === "toggle") {
        setFieldValue(d.tate, d.value ? d.value : false);
      } else if (d.type === "rte") {
        setFieldValue(
          d.state,
          d.value ? d.value : RichTextEditor.createEmptyValue()
        );
      } else if (d.type === "multiskill") {
        setFieldValue(
          d.state,
          d.value
            ? {
                ...d.value,
                skills: d.value.skills.map((skill) => {
                  return {
                    ...skill,
                  };
                }),
              }
            : ""
        );
      } else {
        setFieldValue(d.state, d.value ? d.value : "");
      }
    });
  };

  let cancelbtnClass = `btn btn-outline-danger ${classes.cancel}`;
  if (page === "client" || page === "address" || page === "payment") {
    cancelbtnClass = classes.hide;
  }
  return (
    <div className={classes.formContainer} style={style}>
      <div
        className={
          classes.container + (isModal ? " " + classes.modalContainer : "")
        }
      >
        <Formik
          initialValues={state}
          validate={(values) => {
            const errors = {};
            data.forEach((d) => {
              if (d.required && values[d.state] === "") {
                errors[d.state] = `${d.label} is required`;
              }
              if (d.min && values[d.state] < d.min) {
                errors[d.state] = `${d.label} should be greater than ${d.min}`;
              }
              if (
                values[d.state] &&
                d.pattern &&
                !RegExp(d.pattern, "i").test(values[d.state])
              ) {
                errors[d.state] = `Enter a valid ${d.label}`;
              }

              if (d.type === "rte" && d.required) {
                if (
                  values[d.state].toString("html") === "" ||
                  values[d.state].toString("html").trim() === "<p><br></p>"
                ) {
                  errors[d.state] = `${d.label} is required`;
                }
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
            let res = await formSubmitHandler(values, files);
            if (res) {
              resetForm();
            }
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
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className={pageClassName ? classes[pageClassName] : ""}
            >
              {data.map((info, idx) => {
                switch (info.type) {
                  case "file":
                    return (
                      <div className={`form-group ${classes.input}`} key={idx}>
                        <label style={{ pointerEvents: "none" }}>
                          {info.label}
                          {info.required && " *"}
                          <div>
                            <CloudUploadFill
                              style={{
                                fontSize: "26px",
                                color: "#106DFA",
                                zIndex: "1",
                                display: "block",
                                position: "absolute",
                                margin: "10px",
                                pointerEvents: "all",
                              }}
                            />
                          </div>

                          <span
                            style={{
                              marginTop: "10px",
                              display: "block",
                              marginLeft: "45px",
                              textAlign: "start",
                            }}
                          >
                            {files[info.state]?.name ||
                              (typeof values[info.state] == "string"
                                ? values[info.state].replace(/.*\\/g, "") || ""
                                : values[info.state]?.name || "")}
                          </span>

                          <input
                            className="form-control d-none"
                            key={idx}
                            name={info.state}
                            ref={(el) => (myRefs.current[idx] = el)}
                            type={info.inputType}
                            label={info.label}
                            accept={info.accept}
                            placeholder={info.placeholder}
                            defaultValue={
                              values[info.state] ? values[info.state] : ""
                            }
                            onChange={(event) => {
                              if (event.target.type === "file") {
                                const validateFile = info.validate?.(
                                  event.target.files[0]
                                );
                                if (
                                  event.target.files[0] &&
                                  validateFile === false
                                ) {
                                  event.target.value = "";
                                  showNotification(
                                    info.acceptError ||
                                      "Selected file is not valid",
                                    "error"
                                  );
                                  setfiles((prev) => {
                                    let tempVar = {
                                      ...prev,
                                      [info.state]: "",
                                    };
                                    changeHandler(values, tempVar);
                                    handleChange(event);
                                    return tempVar;
                                  });
                                } else {
                                  setfiles((prev) => {
                                    let tempVar = {
                                      ...prev,
                                      [info.state]: event.target.files[0] || "",
                                    };
                                    changeHandler(values, tempVar);
                                    handleChange(event);
                                    return tempVar;
                                  });
                                }
                              }
                            }}
                          />
                        </label>

                        {state[info.state] && state[info.state] !== "" && (
                          <div class="d-flex justify-content-center">
                            <p
                              onClick={() => {
                                setShowLogo(true);
                              }}
                              style={{
                                marginTop: "0px",
                                textDecoration: "underline",
                                cursor: "default",
                              }}
                              className="text-primary text-center mx-3 my-0 mt-2"
                            >
                              {" "}
                              {info.viewLabel || "View current logo"}
                            </p>
                          </div>
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
                                alt="img"
                                width="100%"
                                height="100%"
                                src={window.storagebucket(state[info.state])}
                              />
                            )}
                          </Modal.Body>
                        </Modal>

                        <div
                          className={classes.errorMessage}
                          style={{ marginTop: "24px" }}
                        >
                          {errors[info.state] &&
                            touched[info.state] &&
                            errors[info.state]}
                        </div>
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
                              if (info.lengthCheck) {
                                if (e.target.value.length > info.lengthCheck)
                                  return;
                              } else if (e.target.value.length > maxTextLength)
                                return;
                              let valCopy = { ...values };
                              valCopy[info.state] = e.target.value || "";
                              handleChange(e);
                              changeHandler(valCopy);
                            }}
                            onBlur={handleBlur}
                            value={values[info.state]}
                            disabled={info.disabled}
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
                  case "datalist":
                    return (
                      <div className={`form-group ${classes.input}`} key={idx}>
                        <label>
                          {info.label}
                          {info.required && " *"}
                          <input
                            type="text"
                            list={info.state}
                            name={info.state}
                            onChange={(e) => {
                              if (info.lengthCheck) {
                                if (e.target.value.length > info.lengthCheck)
                                  return;
                              } else if (e.target.value.length > maxTextLength)
                                return;
                              let valCopy = { ...values };
                              valCopy[info.state] = e.target.value || "";
                              handleChange(e);
                              changeHandler(valCopy);
                            }}
                            onBlur={handleBlur}
                            value={values[info.state]}
                            disabled={info.disabled}
                            min={info.min}
                            max={info.max}
                            className={`form-control ${
                              info.inputType === "date" ? classes.date : ""
                            }`}
                            // type={info.inputType}
                            accept={info.accept}
                            autoComplete="off"
                            placeholder={info.placeholder}
                          />
                        </label>
                        <datalist id={info.state}>
                          {info.options.map((d) => (
                            <option value={d}>{d}</option>
                          ))}
                        </datalist>
                        <div className={classes.errorMessage}>
                          {errors[info.state] &&
                            touched[info.state] &&
                            errors[info.state]}
                        </div>
                      </div>
                    );
                  case "select":
                    return (
                      <div className={`form-group ${classes.input}`} key={idx}>
                        <label style={{ width: "100%" }}>
                          {info.label}
                          {info.required && " *"}
                          <Select
                            isClearable={true}
                            key={idx}
                            isDisabled={info.disabled}
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
                              valCopy[info.state] = val?.value || "";
                              val
                                ? setFieldValue(info.state, val.value)
                                : setFieldValue(info.state, "");
                              changeHandler(valCopy);
                            }}
                            value={
                              values[info.state]
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
                  case "custom-select":
                    return (
                      <div className={`form-group ${classes.input}`} key={idx}>
                        <label style={{ width: "100%" }}>
                          {info.label}
                          {info.required && " *"}
                          <Select
                            isClearable={true}
                            key={idx}
                            isDisabled={info.disabled}
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
                              if (
                                val.value === "Disqualified" ||
                                val.value === "Lost" ||
                                val.value === "Closed"
                              ) {
                                setShow(true);
                              } else {
                                valCopy["reason"] = "";
                              }
                              valCopy[info.state] = val?.value || "";
                              val
                                ? setFieldValue(info.state, val.value)
                                : setFieldValue(info.state, "");
                              changeHandler(valCopy);
                            }}
                            value={
                              values[info.state]
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
                  case "rte":
                    return (
                      <div
                        className={`form-group ${classes.input}`}
                        style={{ gridColumn: "span 2" }}
                        key={idx}
                      >
                        <label style={{ width: "100%" }}>
                          {info.label}
                          {info.required && " *"}
                        </label>
                        <br />
                        <RichTextEditor
                          disabled={info.disabled}
                          toolbarConfig={info.toskillDisplayolbarConfig}
                          editorClassName={classes.textBoxRte}
                          value={
                            values[info.state]
                              ? values[info.state]
                              : RichTextEditor.createEmptyValue()
                          }
                          toolbarClassName={classes.rte}
                          onChange={(val) => {
                            let valCopy = { ...values };
                            valCopy[info.state] =
                              val || RichTextEditor.createEmptyValue();
                            val
                              ? setFieldValue(info.state, val)
                              : setFieldValue(
                                  info.state,
                                  RichTextEditor.createEmptyValue()
                                );
                            changeHandler(valCopy);
                          }}
                        />
                        <div className={classes.errorMessage}>
                          {errors[info.state] &&
                            touched[info.state] &&
                            errors[info.state]}
                        </div>
                      </div>
                    );
                  case "spacer":
                    return (
                      <div style={{ gridColumn: `span ${info.gridspan}` }}>
                        <div style={{ width: "100%" }}></div>
                      </div>
                    );
                  case "skillDisplay":
                    return (
                      <div className={classes.skillPillDiv}>
                        {/* {JSON.stringify(data)} */}
                        {values[info.stateSelected].skills.map((skill) => (
                          <SkillPill
                            skill={skill}
                            styles={{
                              backgroundColor: "whitesmoke",
                              color: "black",
                              display: "inline",
                              height: "30px",
                            }}
                            deleteHandler={(id) => {
                              let valCopy = { ...values };
                              valCopy[info.stateSelected].skills = valCopy[
                                info.stateSelected
                              ].skills.filter((skill) => skill.id !== id);
                              setFieldValue(
                                info.stateSelected,
                                valCopy[info.stateSelected]
                              );
                              changeHandler(valCopy);
                            }}
                          />
                        ))}
                      </div>
                    );
                  case "multiskill":
                    return (
                      <div className={classes.multiSkill}>
                        <div
                          className={`form-group ${classes.input}`}
                          style={{ width: "40%" }}
                        >
                          <label style={{ width: "100%" }}>
                            Skill
                            <Select
                              isClearable={true}
                              key={idx}
                              isDisabled={info.disabled}
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
                              className={`${classes.select}`}
                              placeholder={info.placeholder}
                              onChange={(e) => {
                                let valCopy = { ...values };
                                valCopy[info.state].skill = e?.value || "";
                                setFieldValue(info.state, valCopy[info.state]);
                                changeHandler(valCopy);
                              }}
                              value={
                                values[info.state]?.skill
                                  ? {
                                      value: values[info.state]?.skill,
                                      label: values[info.state]?.skill,
                                    }
                                  : info.value.skill
                                  ? {
                                      value: info.value.skill,
                                      label: info.value.skill,
                                    }
                                  : ""
                              }
                              name={info.state}
                              options={info.skills}
                            />
                            {/* <input
                              type="text"
                              list={info.state}
                              name={info.state}
                              onChange={(e) => {
                                if (info.lengthCheck) {
                                  if (e.target.value.length > info.lengthCheck)
                                    return;
                                } else if (
                                  e.target.value.length > maxTextLength
                                )
                                  return;
                                let valCopy = { ...values };
                                valCopy[info.state].skill =
                                  e.target.value || "";
                                setFieldValue(info.state, valCopy[info.state]);
                                changeHandler(valCopy);
                              }}
                              value={
                                values[info.state]?.skill || info.value.skill
                              }
                              className={`form-control ${
                                info.inputType === "date" ? classes.date : ""
                              } ${classes.datalist}`}
                              autoComplete="off"
                              placeholder={info.skillPlaceholder}
                            />
                            <datalist
                              id={info.state}
                              style={{ maxHeight: "10px" }}
                            >
                              {info.skillSuggestions.map((d) => (
                                <option value={d}>{d}</option>
                              ))}
                            </datalist> */}
                          </label>
                        </div>
                        <div
                          className={`form-group ${classes.input}`}
                          style={{ width: "40%" }}
                        >
                          <label style={{ width: "40%" }}>
                            count
                            <input
                              type="number"
                              name={info.state}
                              min={0}
                              max={20}
                              onChange={(e) => {
                                if (info.lengthCheck) {
                                  if (e.target.value.length > info.lengthCheck)
                                    return;
                                } else if (
                                  e.target.value.length > maxTextLength
                                )
                                  return;

                                try {
                                  const number = parseInt(e.target.value);
                                  if (number > 200 || number <= 0) {
                                    throw new Error("Count limit exceeded");
                                  }
                                } catch (error) {
                                  showNotification(error.message, "warning");
                                  return;
                                }
                                let valCopy = { ...values };
                                valCopy[info.state].count =
                                  parseInt(e.target.value) || 0;
                                setFieldValue(info.state, valCopy[info.state]);
                                changeHandler(valCopy);
                              }}
                              value={
                                values[info.state]?.count || info.value.count
                              }
                              className={`form-control ${
                                info.inputType === "date" ? classes.date : ""
                              }`}
                              autoComplete="off"
                              placeholder={info.countPlaceholder}
                            />
                          </label>
                        </div>
                        <div className={`form-group ${classes.input}`}>
                          <div
                            style={{ display: "block", height: "24px" }}
                          ></div>
                          <button
                            className={`btn btn-outline-primary ${classes.submit}`}
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                values[info.state].skill === "" ||
                                values[info.state].count === "" ||
                                values[info.state].count === 0
                              ) {
                                showNotification(
                                  "Skill and count cannot be empty",
                                  "warning"
                                );
                                return;
                              }
                              let valCopy = { ...values };
                              if (
                                valCopy[info.state].skills.find(
                                  (skill) =>
                                    skill.skill === valCopy[info.state].skill
                                )
                              ) {
                                showNotification(
                                  "Skill already added",
                                  "warning"
                                );
                                return;
                              }
                              valCopy[info.state].skills.push({
                                id: valCopy[info.state].idValue,
                                skill: valCopy[info.state].skill,
                                name: `${valCopy[info.state].skill}-${
                                  valCopy[info.state].count
                                }`,
                                count: valCopy[info.state].count,
                              });
                              valCopy[info.state].skill = "";
                              valCopy[info.state].count = "";
                              valCopy[info.state].idValue += 1;
                              setFieldValue(info.state, valCopy[info.state]);
                              changeHandler(valCopy);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              fill="currentColor"
                              className="bi bi-plus"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  case "modal":
                    return (
                      <Modal show={show}>
                        <Modal.Header>
                          <Modal.Title>Add Reason</Modal.Title>
                          <CloseButton
                            onClick={() => {
                              setShow(false);
                            }}
                          ></CloseButton>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Group>
                              <Form.Label>Reason</Form.Label>
                              <Form.Control
                                as="textarea"
                                row={3}
                                defaultValue={values.reason}
                                onChange={(e) => {
                                  let valCopy = { ...values };
                                  console.log(values);
                                  valCopy[info.state] = e.target.value;
                                  changeHandler(valCopy);
                                  if (e.target.value.length >= info.minlength) {
                                    setReasonButton(false);
                                  }
                                }}
                              />
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setShow(false);
                            }}
                          >
                            Close
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => {
                              setShow(false);
                            }}
                            disabled={reasonButton}
                          >
                            Add reason
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    );
                  default:
                    return null;
                }
              })}
              {hideButtons ? null : (
                <>
                  <button
                    onClick={cancelHandler}
                    type="button"
                    className={cancelbtnClass}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary ${classes.submit} ${
                      page === "client" && classes.gstSave
                    }`}
                    style={{
                      display: page === "address" ? "none" : null,
                      gridColumn: page === "payment" ? "1" : null,
                    }}
                  >
                    {saveButtonName ? saveButtonName : "Save"}
                  </button>{" "}
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

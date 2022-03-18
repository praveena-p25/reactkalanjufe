/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import classes from "./Table.module.css";

const ModalData = (props) => {
  const fieldsObj = {};
  props.bodyFields.forEach((field) => {
    fieldsObj[field.state] = field.value || "";
  });

  const [state, setState] = useState(fieldsObj);
  const [touched, setTouched] = useState();
  const [errors, setErrors] = useState();

  var options = [];
  var taskOptions = [];

  useEffect(() => {
    const touch = {};
    const error = {};
    props.bodyFields.forEach((field) => {
      touch[field.state] = false;
      error[field.state] = "";
    });

    setTouched(touch);
    setErrors(error);
  }, [props]);

  const handleClose = () => {
    // console.log("show");
    props.setShow(!props.show);
    Object.keys(fieldsObj).forEach((key) => {
      delete fieldsObj[key];
    });

    setState(fieldsObj);
    taskOptions = [];
  };

  const changeState = (event, fieldstate, index) => {
    setState((prevState) => {
      let updatedState = {
        ...prevState,
        [fieldstate]: event
          ? event.target
            ? event.target.value
            : event.value
          : "",
      };

      if (
        (updatedState?.stress ||
          updatedState?.attitude ||
          updatedState?.communication ||
          updatedState?.techexposure) &&
        !updatedState?.remarks2
      ) {
        var total =
          (updatedState.stress
            ? parseInt(updatedState.stress)
            : fieldsObj.stress
            ? parseInt(fieldsObj.stress)
            : 0) +
          (updatedState?.attitude
            ? parseInt(updatedState?.attitude)
            : fieldsObj.attitude
            ? parseInt(fieldsObj.attitude)
            : 0) +
          (updatedState?.communication
            ? parseInt(updatedState?.communication)
            : fieldsObj.communication
            ? parseInt(fieldsObj.communication)
            : 0) +
          (updatedState?.techexposure
            ? parseInt(updatedState?.techexposure)
            : fieldsObj.techexposure
            ? parseInt(fieldsObj.techexposure)
            : 0);

        updatedState = {
          ...updatedState,
          total: [total],
        };
      }
      return updatedState;
    });

    let updateBody = props.bodyFields;
    updateBody[index].value = event
      ? event.target
        ? event.target.value
        : event.value
      : "";
    props.setBody(updateBody);
    // console.log(updateBody,state);
  };

  const setTaskOption = (e) => {
    if (e && e.value) {
      var data = props.skilldata.find((opt) => {
        return opt.value === e.value;
      });

      if (data) {
        taskOptions = props.taskdata.filter((task) => {
          return task.type === data.type;
        });
      }
    }
  };

  const setOptions = (field) => {
    if (field.state === "skill") {
      setTaskOption(field);
    }
    options =
      field.state === "skill"
        ? props.skilldata
        : field.state === "task"
        ? taskOptions
        : field.state === "eval"
        ? props.evaldata
        : field.state === "round"
        ? props.selectdata
        : [];
  };

  // taskOptions = props.taskdata.filter((task) => {
  //   return task.type === skillType
  // })

  const updateData = () => {
    // console.log(state);
    let updatedData = props.data;
    updatedData.recruiter_id = updatedData.recruiter_id
      ? updatedData.recruiter_id
      : 0;
    updatedData.evaluator_id = updatedData.evaluator_id
      ? updatedData.evaluator_id
      : 0;

    if (props.modalName === "skill") {
      updatedData.requirement_base = state.skill
        ? state.skill
        : updatedData.requirement_base;
      updatedData.task_id = state.task
        ? parseInt(state.task)
        : updatedData.task_id;
    } else if (props.modalName === "eval") {
      updatedData.evaluator_id = state.eval
        ? parseInt(state.eval)
        : updatedData.evaluator_id;
      updatedData.round1_score = state.score1
        ? parseInt(state.score1)
        : updatedData.round1_score;
      updatedData.round1_remarks = state.remarks1
        ? state.remarks1
        : updatedData.round1_remarks;

      updatedData.consoli_score =
        parseInt(updatedData.round1_score) + parseInt(updatedData.round2_score);

      let status = "";
      if (parseInt(updatedData.round2_score)) {
        if (updatedData.round1_score >= props.round1_cutoff) {
          if (updatedData.round2_score >= props.round2_cutoff) {
            status = "Selected";
          } else if (
            updatedData.round2_score >= props.round2_cutoff - 5 &&
            updatedData.round2_score < props.round2_cutoff
          ) {
            status = "On Hold";
          } else {
            status = "Rejected";
          }
        } else {
          status = "Rejected";
        }
        updatedData.rounds = 3;
      } else {
        if (updatedData.round1_score >= props.round1_cutoff) {
          status = "In Progress";
        } else {
          status = "Rejected";
        }
        updatedData.rounds = 2;
      }

      updatedData.status = status;
    } else if (props.modalName === "score") {
      updatedData.stress_score = state.stress
        ? parseInt(state.stress)
        : updatedData.stress_score;
      updatedData.attitude_score = state.attitude
        ? parseInt(state.attitude)
        : updatedData.attitude_score;
      updatedData.comm_score = state.communication
        ? parseInt(state.communication)
        : updatedData.comm_score;
      updatedData.tech_score = state.techexposure
        ? parseInt(state.techexposure)
        : updatedData.tech_score;
      updatedData.remarks = state.remarks2
        ? state.remarks2
        : updatedData.remarks;

      updatedData.round2_score = state.total
        ? parseInt(state.total)
        : updatedData.stress_score +
          updatedData.attitude_score +
          updatedData.comm_score +
          updatedData.tech_score;
      updatedData.consoli_score =
        parseInt(updatedData.round1_score) + parseInt(updatedData.round2_score);

      let status = "";
      if (updatedData.round1_score >= props.round1_cutoff) {
        if (updatedData.round2_score >= props.round2_cutoff) {
          status = "Selected";
        } else if (
          updatedData.round2_score >= props.round2_cutoff - 5 &&
          updatedData.round2_score < props.round2_cutoff
        ) {
          status = "On Hold";
        } else {
          status = "Rejected";
        }
      } else {
        status = "Rejected";
      }
      updatedData.rounds = 3;
      updatedData.status = status;
    } else if (props.modalName === "select") {
      if (updatedData.select_reason) {
        updatedData.select_reason +=
          ", " + state.round + " : " + (state.reason ? state.reason : "");
      } else {
        updatedData.select_reason =
          state.round + " : " + (state.reason ? state.reason : "");
      }

      updatedData.status =
        state.round === "Round 1"
          ? "In Progress"
          : state.round === "Round 2"
          ? "Selected"
          : "";
      updatedData.rounds =
        state.round === "Round 1" ? 2 : state.round === "Round 2" ? 3 : 1;
    }
    // console.log(updatedData);
    else if (props.modalName === "reject") {
      updatedData.status = "Rejected";
    }

    props.updateRecruiter(updatedData.id, updatedData, props.campusId);
    handleClose();
  };

  let flag = 0;

  const checkFields = (state, field) => {
    flag +=
      !(state[field.state] || field.value) ||
      errors["score1"] ||
      errors["stress"] ||
      errors["communication"] ||
      errors["attitude"] ||
      errors["techexposure"]
        ? 0
        : 1;
  };

  let bodylen = props.bodyFields.filter(
    (fields) => fields.type === "input" || fields.type === "select"
  ).length;

  function handleTouch(event, fieldstate) {
    setTouched((prev) => {
      let touch = {
        ...prev,
        [fieldstate]: true,
      };
      return touch;
    });
  }

  const handleErrors = (event, field) => {
    let data = event ? (event.target ? event.target.value : event.value) : "";
    let err = errors;
    if (!data) {
      err[field.state] = "*Field is required";
    } else {
      if (field.state === "score1") {
        if (parseInt(data) > props.totalScore || parseInt(data) < 0) {
          err[field.state] = "*Enter a valid score";
        } else {
          err[field.state] = "";
        }
      } else if (
        field.state === "stress" ||
        field.state === "attitude" ||
        field.state === "communication" ||
        field.state === "techexposure"
      ) {
        let div = props.totalScore / 4;
        if (parseInt(data) > div || parseInt(data) < 0) {
          err[field.state] = "*Enter a valid score";
        } else {
          err[field.state] = "";
        }
      } else {
        err[field.state] = "";
      }
    }

    setErrors(err);
  };

  // console.log(props);
  return (
    <>
      <div id="modal">
        <Modal show={props.show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {props.bodyFields.map((field, idx) => {
              switch (field.type) {
                case "select":
                  return (
                    <>
                      <label className="mb-1"> {field.label}</label>
                      {/* {console.log(state[field.state], field.value)} */}
                      {setOptions(field)}
                      <Select
                        onChange={(e) => {
                          changeState(e, field.state, idx);
                          if (field.state === "skill") {
                            setTaskOption(e);
                          }
                          handleErrors(e, field);
                        }}
                        onBlur={(e) => {
                          handleTouch(e, field.state);
                        }}
                        key={idx}
                        defaultValue={options.filter(
                          (sk) =>
                            sk.value ===
                            (state[field.state]
                              ? state[field.state]
                              : field.value)
                        )}
                        isClearable
                        options={options}
                        placeholder={field.placeholder}
                      />
                      {checkFields(state, field)}
                      {/* {touched[field.state] && !errors[field.state] ? (
                        <p className={classes.errorMessage}>
                          *Field is required
                        </p>
                      ) : (
                        <></>
                      )} */}
                      {
                        <p className={classes.errorMessage}>
                          {errors[field.state]}
                        </p>
                      }
                    </>
                  );
                case "input":
                  return (
                    <div className="row">
                      <label className="col-md-4"> {field.label}</label>
                      <div className="col-md-7">
                        <input
                          key={idx}
                          type={field.infoType}
                          min="0"
                          max="100"
                          className="form-control"
                          placeholder={field.placeholder}
                          value={
                            state[field.state]
                              ? state[field.state]
                              : field.value
                          }
                          disabled={field.disabled}
                          onChange={(event) => {
                            changeState(event, field.state, idx);
                            handleErrors(event, field);
                          }}
                          onBlur={(e) => {
                            handleTouch(e, field.state);
                          }}
                        />
                        {checkFields(state, field)}
                        {
                          <p className={classes.errorMessage}>
                            {errors[field.state]}
                          </p>
                        }
                      </div>
                    </div>
                  );
                case "para":
                  return (
                    <div>
                      <label className="mt-1 mb-2">{field.text}</label>
                    </div>
                  );
                case "rte":
                  if (props.modalName === "select") {
                    return (
                      <div className="row">
                        <label className="col-md-4 mb-2">{field.label}</label>
                        <div>
                          <textarea
                            key={idx}
                            rows={4}
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            placeholder={field.placeholder}
                            value={field.value}
                            maxlength="150"
                            onChange={(event) =>
                              changeState(event, field.state, idx)
                            }
                          ></textarea>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="row">
                      <label className="col-md-4">{field.label}</label>
                      <div className="col-md-8">
                        <textarea
                          key={idx}
                          rows={3}
                          className="form-control"
                          id="exampleFormControlTextarea1"
                          placeholder={field.placeholder}
                          value={field.value}
                          onChange={(event) =>
                            changeState(event, field.state, idx)
                          }
                        ></textarea>
                      </div>
                    </div>
                  );

                default:
                  return <></>;
              }
            })}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={() => handleClose()}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={flag !== bodylen}
              onClick={() => updateData()}
            >
              {props.modalName === "reject" ? "Reject" : "Update"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ModalData;

/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useEffect, useState } from "react";
import { PatchCheckFill } from "react-bootstrap-icons";
import { Link, useHistory, useParams } from "react-router-dom";
import { deleteRecruit } from "Api/masterdata";
import { Table } from "react-bootstrap";
// import moment from "moment";
import Select from "react-select";
import parse from "html-react-parser";
import { allAccesses } from "../../utils/accesses";
import showNotification from "utils/showNotification";
import selecticon from "../../assets/selecticon.svg";
import rejecticon from "../../assets/reject.svg";
import mailicon from "../../assets/mail.svg";
import mailreceived from "../../assets/mailreceived.svg";
import DeleteIcon from "../common/DeleteIcon/DeleteIcon";
import ModalData from "./Modal";

import classes from "./Table.module.css";

const LinkComp = ({ to, children }) => {
  return (
    <Link className={classes.link} to={to}>
      {children}
    </Link>
  );
};

const CandidateComp = ({ candidatename }) => {
  return <div>{candidatename}</div>;
};

const SkillComp = ({ skill, tech }) => {
  return (
    <div>
      {skill}
      <br />
      <p className={`${classes.base} `}>{tech}</p>
    </div>
  );
};
const Action = ({
  campusid,
  id,
  status,
  isReceived,
  deleteHandler,
  editPermission,
  deletePermission,
  showModal,
  ind,
}) => {
  const history = useHistory();
  const selectPointer = status === "Selected" ? "not-allowed" : "pointer";
  const rejectPointer = status === "Rejected" ? "not-allowed" : "pointer";

  return (
    <div className={`${classes.action} my-auto`}>
      {/* {editPermission && (
        <LinkComp to={`/Campus/${campusid}/edit/${id}`}>
          <img
            src={pencilSquareImg}
            alt="Edit"
            onClick={editHandler}
            style={{ cursor: "pointer", paddingRight: "8px" }}
          />
        </LinkComp>
      )} */}
      {editPermission() && (
        <img
          src={selecticon}
          onClick={() => {
            if (selectPointer === "pointer") {
              showModal("select", ind);
            }
          }}
          alt="Force Select"
          style={{ cursor: selectPointer, paddingRight: "8px" }}
        />
      )}
      {editPermission() && (
        <img
          src={rejecticon}
          onClick={() => {
            if (rejectPointer === "pointer") {
              showModal("reject", ind);
            }
          }}
          alt="Reject Candidate"
          style={{ cursor: rejectPointer, paddingRight: "8px" }}
        />
      )}
      {
        <img
          src={isReceived ? mailreceived : mailicon}
          // onClick={() => showModal("select")}
          alt="Send Mail"
          style={{ paddingRight: "8px" }}
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title={isReceived ? "Mail Received" : "Mail Not Received"}
        />
      }
      {deletePermission && (
        <DeleteIcon
          style={{ fontSize: "24px" }}
          onClick={() => deleteHandler(id)}
        />
      )}
    </div>
  );
};

const DataTable = (props) => {
  const campusid = useParams().id;
  const [datatable, setDatatable] = useState([]);

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState([]);
  const [data, setData] = useState({});
  const [modal, setModal] = useState("");
  const [round1Cutoff, setRound1Cutoff] = useState(0);
  const [round2CutOff, setRound2CutOff] = useState(0);
  const [selectOptions, _] = useState([
    {
      value: "Round 1",
      label: "Round 1",
    },
    {
      value: "Round 2",
      label: "Round 2",
    },
  ]);

  // const [campusData, setCampusData] = useState([]);
  //DELETE HANDLER
  const deleteHandler = async (id) => {
    try {
      const response = await deleteRecruit(id);
      if (response) {
        props.handleRefresh();
      }
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const editPermission = () => {
    const accessesProvided = [
      allAccesses["special_super-admin"],
      allAccesses["campus_update"],
      allAccesses["campus_admin"],
    ];
    if (accessesProvided.some((access) => props.roleAccess.includes(access))) {
      return true;
    }
    return false;
  };

  // console.log("props",props);

  const showModal = (modalName, ind) => {
    var data;
    setShow(true);
    // console.log(ind);
    if (ind !== undefined) {
      data = props.data[ind];
      setData(data);
    }

    setRound1Cutoff(
      parseInt(
        props.details
          ? props.details.total_score * (props.details.round1_cutoff / 100)
          : 0
      )
    );
    setRound2CutOff(
      parseInt(
        props.details
          ? props.details.total_score * (props.details.round2_cutoff / 100)
          : 0
      )
    );

    let total = parseInt(props.details ? props.details.total_score : 0);

    setTitle(
      modalName === "skill"
        ? "Skills & Tasks"
        : modalName === "eval"
        ? "Evaluated By & Score"
        : modalName === "score"
        ? "HR & Tech Score"
        : modalName === "select"
        ? "Force Select Candidate"
        : "Reject Candidate"
    );

    if (modalName === "skill") {
      setModal("skill");
      setBody([
        {
          type: "select",
          label: "Skill*",
          placeholder: "Select Skill",
          value: data.requirement_base ? data.requirement_base : "",
          state: "skill",
        },
        {
          type: "select",
          label: "Task*",
          placeholder: "Select Task",
          value: data.task_id ? data.task_id.toString() : "",
          state: "task",
        },
      ]);
    } else if (modalName === "score") {
      setModal("score");
      setBody([
        {
          type: "input",
          infoType: "number",
          value: data.stress_score ? data.stress_score.toString() : "",
          state: "stress",
          label: "Stress*",
          placeholder: "Score out of " + total / 4,
          disabled: false,
        },
        {
          type: "input",
          infoType: "number",
          value: data.attitude_score ? data.attitude_score.toString() : "",
          state: "attitude",
          label: "Attitude*",
          placeholder: "Score out of " + total / 4,
          disabled: false,
        },
        {
          type: "input",
          infoType: "number",
          value: data.comm_score ? data.comm_score.toString() : "",
          state: "communication",
          label: "Comunication*",
          placeholder: "Score out of " + total / 4,
          disabled: false,
        },
        {
          type: "input",
          infoType: "number",
          value: data.tech_score ? data.tech_score.toString() : "",
          state: "techexposure",
          label: "Tech exposure*",
          placeholder: "Score out of " + total / 4,
          disabled: false,
        },
        {
          type: "input",
          infoType: "text",
          value: data.round2_score ? data.round2_score.toString() : "",
          state: "total",
          label: "Total",
          placeholder: "Total score",
          disabled: true,
        },
        {
          type: "rte",
          value: data.remarks ? data.remarks : "",
          state: "remarks2",
          label: "Remarks",
          placeholder: "Remarks here...",
        },
      ]);
    } else if (modalName === "eval") {
      setModal("eval");
      setBody([
        {
          type: "select",
          label: "Evaluated By*",
          state: "eval",
          value: data.evaluator_id ? data.evaluator_id.toString() : "",
          placeholder: "Select Interviewer",
        },
        {
          type: "input",
          infoType: "number",
          value: data.round1_score ? data.round1_score.toString() : "",
          state: "score1",
          label: "Score*",
          placeholder: "Score",
          disabled: false,
        },
        {
          type: "rte",
          value: data.round1_remarks ? data.round1_remarks : "",
          state: "remarks1",
          label: "Remarks",
          placeholder: "Remarks here...",
        },
      ]);
    } else if (modalName === "select") {
      setModal("select");
      setBody([
        {
          type: "select",
          value: "",
          state: "round",
          label: "Force Select From Round*",
          placeholder: "Select Round",
        },
        {
          type: "rte",
          value: "",
          state: "reason",
          label: "Reason",
          placeholder: "Enter Reason to Force Select",
        },
      ]);
    } else if (modalName === "reject") {
      setModal("reject");
      setBody([
        {
          type: "para",
          text: "Are you sure to Reject this Candidate ?",
        },
      ]);
    } else {
      setBody([]);
    }
  };
  // console.log(props.interviewerdata);
  const checkScore = (score) => {
    var total = props.details ? props.details.total_score : 0;
    if (score <= total && score >= 0) {
      console.log(total, "true");
      return true;
    } else {
      return false;
    }
  };

  const modalData = () => {
    return (
      <ModalData
        show={show}
        setShow={setShow}
        campusId={campusid}
        modalName={modal}
        title={title}
        data={data}
        bodyFields={body}
        skilldata={props.skilldata}
        taskdata={props.taskdata}
        evaldata={props.interviewerdata}
        selectdata={selectOptions}
        updateRecruiter={props.updateRecruiter}
        setBody={setBody}
        round1_cutoff={round1Cutoff}
        round2_cutoff={round2CutOff}
        totalScore={props.details ? props.details.total_score : 0}
      />
    );
  };

  const rendercheck = (data) => {
    // console.log(data.status.props.children[0]);
    if (data.status.props.children[0] === "Selected") {
      return classes.bggreen;
    } else if (data.status.props.children[0] === "Rejected") {
      return classes.bgred;
    } else if (data.status.props.children[0] === "In Progress") {
      return classes.bgyellow;
    } else if (data.status.props.children[0] === "On Hold") {
      return classes.bgblue;
    } else {
      return classes.bgnone;
    }
  };
  // console.log("campus", campusData);

  const onCheckAll = (event) => {
    props.campusData.map(
      (data) => (data.selected = !data.disabled ? event.target.checked : false)
    );
    props.setCheckAll(event.target.checked);
    props.setSendTaskData(props.campusData.filter((data) => data.selected));
  };

  const onCheck = (event, item) => {
    props.campusData.map((data) => {
      if (data.id === item.id) {
        data.selected = event.target.checked;
      }
      return data;
    });
    props.setSendTaskData(props.campusData.filter((data) => data.selected));
  };

  //USE EFFECT FOR TABLE DATA
  useEffect(async () => {
    var data = [];
    var temp = [];

    for (let i = 0; i < props.data.length; i++) {
      await temp.push({
        id: props.data[i].id,
        mail: props.data[i].email,
        skill: props.data[i].requirement_base,
        task_id: props.data[i].task_id,
        task_url: props.data[i].attachment
          ? window.storagebucket(props.data[i].attachment)
          : "",
        selected: false,
        disabled:
          props.data[i].requirement_base && props.data[i].task_id
            ? false
            : true,
      });
      await data.push({
        id: props.data[i].id,
        sNo: props.perPage * (props.currentPagination - 1) + i + 1,
        candidateName: (
          <CandidateComp
            candidatename={
              editPermission() ? (
                <LinkComp
                  to={
                    "/Campus/" +
                    props.data[i].campus_id +
                    "/edit/" +
                    props.data[i].id
                  }
                >
                  {props.data[i].candidatename}
                </LinkComp>
              ) : (
                <p>{props.data[i].candidatename}</p>
              )
            }
          />
        ),
        combine: (
          <div>
            {props.data[i].phone}
            <br />
            {props.data[i].email}
          </div>
        ),
        recruiter: props.data[i].recruiter,
        recruiter_id: props.data[i].recruiter_id
          ? props.data[i].recruiter_id.toString()
          : 0,
        eval_id: props.data[i].evaluator_id
          ? props.data[i].evaluator_id.toString()
          : 0,
        eval: editPermission() ? (
          <SkillComp
            skill={
              <a
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => showModal("eval", i)}
              >
                {props.data[i].evaluatedby
                  ? props.data[i].evaluatedby
                  : "Select evaluator"}
              </a>
            }
            tech={"Score : " + props.data[i].round1_score}
          />
        ) : (
          <SkillComp
            skill={
              props.data[i].evaluatedby
                ? props.data[i].evaluatedby
                : "Select evaluator"
            }
            tech={"Score : " + props.data[i].round1_score}
          />
        ),
        role: props.data[i].role,
        base: editPermission() ? (
          <SkillComp
            skill={
              <a
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => showModal("skill", i)}
              >
                {props.data[i].requirement_base
                  ? props.data[i].requirement_base
                  : "Select Skill"}
              </a>
            }
            tech={"Task No : " + props.data[i].task_id}
          />
        ) : (
          <SkillComp
            skill={props.data[i].requirement_base}
            tech={"Task No : " + props.data[i].task_id}
          />
        ),
        hrscore:
          editPermission() && props.data[i].round1_score ? (
            <a
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => showModal("score", i)}
            >
              {props.data[i].stress_score +
                props.data[i].attitude_score +
                props.data[i].comm_score}
            </a>
          ) : (
            props.data[i].stress_score +
            props.data[i].attitude_score +
            props.data[i].comm_score
          ),
        techscore:
          editPermission() && props.data[i].round1_score ? (
            <a
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => showModal("score", i)}
            >
              {props.data[i].tech_score}
            </a>
          ) : (
            props.data[i].tech_score
          ),
        consco: props.data[i].consoli_score,
        remarks: props.data[i].remarks,
        status: (
          <>
            {props.data[i].status ? props.data[i].status : "-"}{" "}
            {props.data[i].status ? (
              props.data[i].status === "Selected" ? (
                <PatchCheckFill style={{ color: "#108810" }} />
              ) : (
                ""
              )
            ) : (
              ""
            )}{" "}
          </>
        ),
        action: (
          <Action
            id={props.data[i].id}
            status={props.data[i].status}
            isReceived={props.data[i].received_mail}
            campusid={campusid}
            deletePermission={[
              allAccesses["special_super-admin"],
              allAccesses["campus_admin"],
              allAccesses["campus_delete"],
            ].some((access) => props.roleAccess.includes(access))}
            editPermission={editPermission}
            deleteHandler={deleteHandler}
            showModal={showModal}
            ind={i}
          />
        ),
      });
    }
    setDatatable(data);
    props.setCampusData(temp);
  }, [props.data]);
  return (
    <>
      <Table responsive="xl" className={classes.table}>
        <thead className={classes.boldText}>
          <tr>
            <td rowSpan={2} style={{ width: "2%" }}>
              <input
                type="checkbox"
                className="form-check-input"
                checked={props.checkAll}
                id="checkall"
                onChange={(e) => onCheckAll(e)}
              />
            </td>
            <td style={{ width: "5%" }} rowSpan={2}>
              S.No
            </td>
            <td rowSpan={2}>Candidate Name</td>
            <td rowSpan={2}>Phone & Email</td>
            <td rowSpan={2}>Recruiter</td>

            <td className="text-center" colspan={2}>
              Round 1
            </td>
            <td className="text-center" colspan={2}>
              Round 2
            </td>
            <td rowSpan={2}>Consolidated Score</td>

            <td rowSpan={2}>Status</td>
            <td rowSpan={2}>Action</td>
          </tr>
          <tr>
            <td style={{ borderBottomColor: "inherit" }}>Skills & Tasks</td>
            <td style={{ borderBottomColor: "inherit" }}>
              Evaluated By & Score
            </td>
            <td style={{ borderBottomColor: "inherit" }}>HR Score</td>
            <td style={{ borderBottomColor: "inherit" }}>Tech Score</td>
          </tr>
        </thead>
        <tbody>
          {datatable.length === 0 ? (
            <tr>
              <td colSpan="11">
                <div className="p-4 text-center">No records found !</div>
              </td>
            </tr>
          ) : (
            datatable.map((data, idx) => (
              <tr key={idx}>
                <td style={{ width: "2%" }}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={
                      props.campusData[idx]
                        ? props.campusData[idx].selected
                        : false
                    }
                    id={idx}
                    disabled={
                      props.campusData[idx]
                        ? props.campusData[idx].disabled
                        : true
                    }
                    onChange={(e) => onCheck(e, props.campusData[idx])}
                  />
                </td>
                <td style={{ width: "5%", textAlign: "center" }}>{data.sNo}</td>
                <td>{data.candidateName}</td>
                <td>{data.combine}</td>
                <td>
                  <Select
                    options={props.recruiterdata}
                    onChange={(e) => {
                      props.setrecruiter(e.value);

                      let updatedData = props.data[idx];
                      updatedData.recruiter_id = parseInt(e.value);
                      updatedData.evaluator_id = updatedData.evaluator_id
                        ? parseInt(updatedData.evaluator_id)
                        : 0;

                      props.updateRecruiter(data.id, updatedData, campusid);
                    }}
                    // value={data.recruiter}
                    value={props.recruiterdata.filter((re) => {
                      return re.value === data.recruiter_id;
                    })}
                    isDisabled={!editPermission()}
                  />
                </td>
                <td>{data.base}</td>
                <td>{data.eval}</td>
                <td>{data.hrscore}</td>
                <td>{data.techscore}</td>
                <td>{data.consco}</td>
                <td className={rendercheck(data)}>{data.status}</td>
                <td style={{ width: "20% !important" }}>{data.action}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {modalData()}
    </>
  );
};

export default DataTable;

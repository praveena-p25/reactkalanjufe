/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Dashbody from "components/dashboard/dash-body/DashBody";
import Dashhead from "components/dashboard/dash-head/DashHead";
import Dashboard from "components/dashboard/DashBoard";
import Tabs from "../../common/Tabs/Tabs";
import { useAuth } from "context/auth/authProvider";
import parse from "html-react-parser";
import { allAccesses } from "utils/accesses";
import BasicInfo from "./BasicInfo";

import classes from "./showrecruit.module.css";
import { getRecruitById } from "Api/masterdata";

const ShowRecruit = () => {
  const history = useHistory();
  const { roleAccess } = useAuth();
  const [candidateInfo, setCandidateInfo] = useState([]);
  const { candidateid, id } = useParams();
  const tabsData = {
    head: ["Candidate Info", "Rounds"],
    body: [
      <div className="mt-3">
        <BasicInfo data={candidateInfo} />
      </div>,
      <div className="mt-3"></div>,
    ],
  };
  useEffect(async () => {
    try {
      var res = await getRecruitById(candidateid, id);
      res = res.data.result;

      console.log(res, "response");
      setCandidateInfo([
        {
          label: "Candidate Name",
          detail: res.candidatename,
        },
        {
          label: "Candidate Phone",
          detail: res.phone,
        },
        {
          label: "Candidate Email",
          detail: res.email,
        },
        {
          label: "Skills",
          detail: res.requirement_base,
        },
        {
          label: "HR Responsible",
          detail: res.evaluatedby,
        },
        {
          label: "Branch",
          detail: res.branch,
        },

        {
          label: "College",
          detail: res.collegename,
        },
        {
          label: "Role",
          detail: res.role,
        },
        {
          label: "Aggregate",
          detail: res.consoli_score,
        },
        {
          label: "Location",
          detail: res.location,
        },
        {
          label: "Status",
          detail: res.status,
        },
        {
          type: "description",
          label: "Comments",
          detail: res.remarks == null ? "-" : parse(res.remarks),
        },
      ]);
    } catch (err) {}
  }, []);
  return (
    <Dashboard>
      <Dashhead>
        <div className={classes.pageTitle}>
          <div className={classes.container}>
            <h1 className={classes.title}>
              {" "}
              {candidateInfo &&
                candidateInfo.length > 0 &&
                candidateInfo[0].detail}{" "}
              - Profile
            </h1>
            <div>
              {[
                allAccesses["special_super-admin"],
                allAccesses["campus_admin"],
              ].some((access) => roleAccess.includes(access)) && (
                <a
                  className="btn btn-primary"
                  target="_blank"
                  className={`btn btn-primary ${classes.button}`}
                  onClick={() =>
                    history.push(`/Campus/${id}/edit/${candidateid}`)
                  }
                >
                  Edit
                </a>
              )}

              <a
                className="btn btn-primary"
                target="_blank"
                className={`btn btn-primary ${classes.button} ${classes.spacing}`}
                onClick={() => history.goBack()}
              >
                Back
              </a>
            </div>
          </div>
        </div>
      </Dashhead>
      <Dashbody>
        <Tabs tabsData={tabsData} />
      </Dashbody>
    </Dashboard>
  );
};

export default ShowRecruit;

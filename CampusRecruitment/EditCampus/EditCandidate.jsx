/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getRecruitByIdFilters } from "../../../Api/masterdata";
import { useAxiosLoader } from "Api/httpRequest";
import Dashbody from "components/dashboard/dash-body/DashBody";
import Dashhead from "components/dashboard/dash-head/DashHead";
import Dashboard from "components/dashboard/DashBoard";
import PageTitle from "../../../components/projects/PageTitle/PageTitle";
import Loading from "../../../pages/Loading/Loading";
import CandidateInfo from "./CandidateInfo";

const EditCandidate = () => {
  const id = useParams().candidateid;
  const campusid = useParams().id;
  const history = useHistory();
  const [load] = useAxiosLoader();
  const [candidateInfo, setcandidateInfo] = useState({});
  const [collegeOptions, setcollegeOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [hrOptions, setHROptions] = useState([]);
  const [skillOptions, setskillOptions] = useState([]);

  const getCandidateDetails = async (id, campusid) => {
    const details = await getRecruitByIdFilters(id, campusid);
    return details.data.result;
  };

  useEffect(() => {
    getCandidateDetails(id, campusid).then((data) => {
      setcandidateInfo(data.recruitmember);

      //college Options
      let temp = [];
      data.collegename.map((campus) => {
        var obj = { value: campus.id.toString(), label: campus.collegename };
        temp.push(obj);
      });
      setcollegeOptions(temp);

      //RoleOptions
      let roleopt = [];
      data.roles.map((role) => {
        var obj = { value: role.name, label: role.name };
        roleopt.push(obj);
      });
      setRoleOptions(roleopt);
    });
  }, []);

  return (
    <Dashboard>
      <Dashhead>
        <PageTitle
          title={`Edit -${
            candidateInfo.candidatename ? candidateInfo.candidatename : ""
          }`}
          button="Back"
          onButtonClick={() => history.push(`/Campus/${campusid}`)}
        />
      </Dashhead>
      {load && <Loading />}

      <Dashbody>
        <div>
          <CandidateInfo
            data={candidateInfo}
            collegeOptions={collegeOptions}
            roleOptions={roleOptions}
          />
        </div>
      </Dashbody>
    </Dashboard>
  );
};

export default EditCandidate;

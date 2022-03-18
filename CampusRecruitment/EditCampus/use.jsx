// /* eslint-disable no-unused-vars */
// /* eslint-disable no-self-assign */
// /* eslint-disable react/jsx-no-duplicate-props */
// /* eslint-disable array-callback-return */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useState } from "react";
// import { Button, Col, Form, Row } from "react-bootstrap";
// import { useHistory, useParams } from "react-router-dom";
// import RichTextEditor from "react-rte";
// // import Dashbody from "components/dashboard/dash-body/DashBody";
// import Dashhead from "components/dashboard/dash-head/DashHead";
// import Dashboard from "components/dashboard/DashBoard";
// import Tabs from "components/common/Tabs/Tabs";
// import PageTitle from "components/projects/PageTitle/PageTitle";
// import Loading from "../../../pages/Loading/Loading"
// import { httpRequest, useAxiosLoader } from "Api/httpRequest";
// import { getCollegeDetails, getdepartment, getskills, getRecruitById} from "../../../Api/masterdata";
// import interviewService from "../../../Api/Interview"
// import { Formik } from "formik";
// import showNotification from "utils/showNotification";
// import * as Yup from "yup";
// import CustomSelect from "./CustomSelect";

// import classes from "./EditCandidate.module.css";

// const toolbarConfig = {
//   // Optionally specify the groups to display (displayed in the order listed).
//   display: ["BLOCK_TYPE_BUTTONS"],
//   INLINE_STYLE_BUTTONS: [
//     { label: "Bold", style: "BOLD", className: "custom-css-class" },
//     { label: "Italic", style: "ITALIC" },
//     { label: "Underline", style: "UNDERLINE" },
//   ],
//   BLOCK_TYPE_DROPDOWN: [
//     { label: "Normal", style: "unstyled" },
//     { label: "Heading Large", style: "header-one" },
//     { label: "Heading Medium", style: "header-two" },
//     { label: "Heading Small", style: "header-three" },
//   ],
//   BLOCK_TYPE_BUTTONS: [
//     { label: "UL", style: "unordered-list-item" },
//     // {label: 'OL', style: 'ordered-list-item'}
//   ],
// };

// //options

// var getcollegeOptions  = async() =>{
//   const campusdata=await getCollegeDetails();
//       let temp =[];
//       campusdata.map((campus) =>{
//           var obj={value:campus.collegename,label:campus.collegename};
//           temp.push(obj);
//       });

//       return temp;
// }
// var getroleOptions  = async() =>{
//     const Role= await getdepartment();
//     let temp =[];
//     Role.map((role) =>{
//         var obj={value:role.name,label:role.name};
//         temp.push(obj);
//     });
//     return temp;
// }
// var gethrOptions =async()=>{
//   const hr= await interviewService.getAllResources();
//   let temp=[];
//   hr.map((hr) =>{
//     var obj={value:hr.name,label:hr.name};
//     temp.push(obj);
//   });
//   return temp;
// }

// var getskillOptions =async()=>{
//   const skill= await getskills();
//   let temp=[];
//   skill.map((skill) =>{
//     var obj={value:skill.name,label:skill.name};
//     temp.push(obj);
//   });
//   return temp;
// }

// const branchOptions = [
//   { value: "CSE", label: "CSE" },
//   { value: "ECE", label: "ECE" },
//   { value: "EEE", label: "EEE" },
//   { value: "IT", label: "IT" },
// ];

// //STATUS OPTIONS
// const statusOptions = [
//   { value: "Offered", label: "Offered" },
//   { value: "Selected", label: "Selected" },
//   { value: "Rejected", label: "Rejected" },
//   { value: "In Progress", label: "In Progress" },
//   { value: "On Hold", label: "On Hold" },
// ];

// const CandidateInfo = (props) => {
//   console.log("Data",props.data);
//   const [collegeOptions,setcollegeOptions]= useState([]);
//   const [roleOptions,setRoleOptions]= useState([]);
//   const [hrOptions,setHROptions]= useState([]);
//   const [skillOptions,setskillOptions]= useState([]);
//   // const [candidateDetails,setCandidateDetails] = useState();
//   const id  = useParams().candidateid;
//   const campusid =useParams().id;

//   useEffect(()=>{
//     getcollegeOptions().then((data) =>{
//       setcollegeOptions(data);
//     });
//     getroleOptions().then((data) =>{
//       setRoleOptions(data);
//     });
//     gethrOptions().then((data) =>{
//       setHROptions(data);
//     });
//     getskillOptions().then((data) =>{
//       setskillOptions(data);
//     });
//     // getCandidateDetails(id,campusid).then((data)=>{
//     //   // setCandidateDetails(data);
//     //   setName(data.candidatename);
//     //   setPhone(data.phone);
//     //   setEmail(data.email);
//     //   setLocation(data.location);
//     //   setHr(data.evaluatedby);
//     //   setBranch(data.branch);
//     //   setSkill(data.requirement_base);
//     //   setRole(data.role);
//     //   setStatus(data.status);
//     //   setAggregate(data.consoli_score);
//     //   setCollege(data.college);

//     // if (data && data.remarks != null) {
//     //   setComments(
//     //     RichTextEditor.createValueFromString(data.remarks, "html")
//     //   );
//     // } else if (data && data.remarks == null) {
//     //   setComments("");
//     // }
//   // });
// },[])

//   // useEffect(() => {}, [props.data]);
//   const [comments, setComments] = useState("");
//   const history = useHistory();

//   //VALIDATION SCHEMA
//   const validationSchema = Yup.object().shape({
//     name: Yup.string()
//       .min(2, "*Names must have at least 2 characters")
//       .max(250, "*Names can't be longer than 250 characters")
//       .matches(
//         /^[A-Za-z]+[A-Za-z\s]{1,250}$/,
//         "*Name must be in a proper format"
//       )
//       .required("*Name is required"),
//     duplicatephone: Yup.boolean(),
//     duplicatemail: Yup.boolean(),
//     phone: Yup.string()
//       .matches(/^[6-9]{1}[0-9]{9}$/gm, "*Phone number is not valid")
//       .required("*Phone number required")
//       .when("duplicatephone", (duplicatephone, validationSchema) => {
//         return validationSchema.test(
//           "duplicatephone",
//           "Phone number already exist",
//           () => {
//             return duplicatephone;
//           }
//         );
//       }),
//     email: Yup.string()
//       .min(2, "*Email must have at least 2 characters")
//       .max(250, "*Email can't be longer than 250 characters")
//       .email("*Must be a valid email address")
//       .required("*Email required")
//       .when("duplicatemail", (duplicatemail, validationSchema) => {
//         return validationSchema.test(
//           "duplicatemail",
//           "Mail Id already exist",
//           () => {
//             return duplicatemail;
//           }
//         );
//       }),
//     resource: Yup.string().required("*Resource is required"),
//     // resource_id: Yup.string().required("*Resource is required"),
//     branch: Yup.string().required("*Branch is required"),
//     requirement_type: Yup.string().required("*Requirement type is required"),
//     refer_name: Yup.string().when("source", (source, validationSchema) => {
//       return source === "Referral"
//         ? validationSchema.required("Referral name is required")
//         : validationSchema;
//     }),
//     requirement_base: Yup.string().required("*Requirement base is required"),
//     no_of_experienced: Yup.string().matches(
//       /^(\d{1,2}\.)?[0-9]{1}[0-2]{0,1}$/gim,
//       "*Enter in proper format"
//     ),
//     location: Yup.string()
//       .min(2, "*Location must have at least 2 characters")
//       .max(40, "*Location can't be longer than 250 characters")
//       .matches(
//         /^[A-Za-z]+[A-Za-z\s]{1,250}$/,
//         "*Location must be in a proper format"
//       )
//       .required("*Location is required"),
//     status: Yup.string(),
//   });
//   const [name,setName]= useState("");
//   const [phone,setPhone]= useState("");
//   const [email,setEmail]= useState("");
//   const [hr,setHr]= useState("");
//   const [college,setCollege]= useState("");
//   const [branch,setBranch]= useState("");
//   const [role,setRole]= useState("");
//   const [skill,setSkill]= useState("");
//   const [aggregate,setAggregate]= useState("");
//   const [location,setLocation]= useState("");
//   const [status,setStatus]= useState("");
//   const [load] = useAxiosLoader();

//   return (
//     <div className={`px-3 py-2 `}>
//           <Dashboard>
//       <Dashhead>
//         <PageTitle
//           title={`Edit - ${name}`}
//           button="Back"
//           onButtonClick={() => history.goBack()}
//         />
//       </Dashhead>
//       {load && <Loading />}

//       {/* <Dashbody>
//         <Tabs tabsData={tabsData} />
//       </Dashbody> */}
//     </Dashboard>
//       <div className="px-3" style={{ backgroundColor: "#fff" }}>
//         <Formik
//           initialValues={{
//             name: name,
//             phone: phone,
//             email: email,
//             skill: skill,
//             hr:hr,
//             college:college,
//             branch:branch,
//             role:role,
//             location: location,
//             status: status,
//             comments: comments,
//             aggregate:aggregate,
//             duplicatephone: true,
//             duplicatemail: true,
//           }}
//           enableReinitialize
//           validationSchema={validationSchema}
//           onSubmit={async (values, { setSubmitting, resetForm }) => {
//             setSubmitting(true);
//             console.log(values);
//             var form_data = new FormData();
//             for (var key in values) {
//               form_data.append(key, values[key]);
//               console.log("hi");
//             }
//             form_data.append("comment", comments.toString("html"));
//             try {
//               console.log("hi",form_data);
//               // const response = await interviewService.editInterview(
//               //   form_data,
//               //   id
//               // );
//               // if (response) {
//               //   resetForm();
//               //   showNotification("Updated Successfully", "success");
//               //   // history.push(`/interview/show/${id}`);
//               // }
//             } catch (error) {
//               showNotification(error.message, "error");
//             }
//             setSubmitting(false);
//           }}
//         >
//           {({
//             values,
//             errors,
//             touched,
//             handleBlur,
//             handleSubmit,
//             isSubmitting,
//           }) => (
//             <Form onSubmit={handleSubmit} autoComplete="off">
//               <Row>
//                 <Col md={12}>
//                   <Row>
//                     <Col md={3}>
//                       <Form.Group controlId="candidateName">
//                         <Form.Label>Candidate Name*</Form.Label>
//                         <Form.Control
//                           name="name"
//                           placeholder="Candidate Name"
//                           type="text"
//                           onChange={e=>setName(e.target.value)}
//                           onBlur={handleBlur}
//                           value={values.name}
//                           className={
//                             touched.name && errors.name ? classes.error : null
//                           }
//                         />

//                         {touched.name && errors.name ? (
//                           <div className={classes.errorMessage}>
//                             {errors.name}
//                           </div>
//                         ) : (
//                           <br />
//                         )}
//                       </Form.Group>
//                     </Col>
//                     <Col md={3}>
//                       <Form.Group controlId="formcandidatephone">
//                         <Form.Label>Candidate Phone*</Form.Label>
//                         <Form.Control
//                           name="phone"
//                           placeholder="Phone Number"
//                           type="text"
//                           onChange={async (e) => {
//                             setPhone(e.target.value);
//                           }}
//                           onBlur={handleBlur}
//                           value={values.phone}
//                           className={
//                             touched.phone && errors.phone ? classes.error : null
//                           }
//                         />
//                         {touched.phone && errors.phone ? (
//                           <div className={classes.errorMessage}>
//                             {errors.phone}
//                           </div>
//                         ) : (
//                           <br />
//                         )}
//                       </Form.Group>
//                     </Col>
//                     <Col md={3}>
//                       <Form.Group controlId="formcandidateemail">
//                         <Form.Label>Candidate Email*</Form.Label>
//                         <Form.Control
//                           name="email"
//                           placeholder="Email"
//                           type="text"
//                           onChange={async (e) => {
//                             setEmail(e.target.value);
//                             // setFieldValue("duplicatemail", true);
//                           }}
//                           onBlur={async (e) => {
//                             handleBlur(e);
//                           }}
//                           value={values.email}
//                           className={
//                             touched.email && errors.email ? classes.error : null
//                           }
//                         />
//                         {touched.email && errors.email ? (
//                           <div className={classes.errorMessage}>
//                             {errors.email}
//                           </div>
//                         ) : (
//                           <br />
//                         )}
//                       </Form.Group>
//                     </Col>
//                     <Col md={3}>
//                       <Form.Group controlId="formhr">
//                         <Form.Label>HR Responsible* </Form.Label>
//                         <CustomSelect
//                           className={
//                             touched.resource && errors.resource
//                               ? classes.error
//                               : null
//                           }
//                           onBlur={handleBlur}
//                           onChange={(value) => {
//                             if (value) {
//                               setHr(value.value)
//                             } else {
//                               setHr("")
//                             }
//                           }}
//                           value={values.hr}
//                           options={hrOptions}
//                           name="resource"
//                           placeholder="HR Responsible"
//                           disabled={false}
//                         />
//                         {touched.resource && errors.resource ? (
//                           <div className={classes.errorMessage}>
//                             {errors.resource}
//                           </div>
//                         ) : (
//                           <br />
//                         )}
//                       </Form.Group>
//                     </Col>
//                     <Col md={3}>
//                       <Form.Group controlId="formCollege">
//                         <Form.Label>College*</Form.Label>
//                         <CustomSelect
//                           className={
//                             touched.college && errors.college
//                               ? classes.error
//                               : null
//                           }
//                           onChange={(value) => {
//                             if (value) {
//                               setCollege( value.value);
//                             } else {
//                               setCollege("");
//                             }
//                           }}
//                           value={values.college}
//                           options={collegeOptions}
//                           placeholder="Select College"
//                           disabled = {true}
//                         />
//                         {touched.college && errors.college ? (
//                           <div className={classes.errorMessage}>
//                             {errors.college}
//                           </div>
//                         ) : (
//                           <br />
//                         )}
//                       </Form.Group>
//                     </Col>
//                     <Col md={3}>
//                       <Form.Group controlId="formBranch">
//                         <Form.Label>Branch*</Form.Label>
//                         <CustomSelect
//                           className={
//                             touched.branch && errors.branch
//                               ? classes.error
//                               : null
//                           }
//                           onChange={(value) => {
//                             if (value && value.value) {
//                               setBranch(value.value);
//                             } else {
//                               setBranch("");
//                             }
//                           }}
//                           value={values.branch}
//                           options={branchOptions}
//                           placeholder="Select Branch"
//                           disabled={false}
//                         />
//                         {touched.branch && errors.branch ? (
//                           <div className={classes.errorMessage}>
//                             {errors.branch}
//                           </div>
//                         ) : (
//                           <br />
//                         )}
//                       </Form.Group>
//                     </Col>
//                     <Col md={3}>
//                       <Form.Group controlId="formRole">
//                         <Form.Label>Role*</Form.Label>
//                         <CustomSelect
//                           className={
//                             touched.role && errors.role
//                               ? classes.error
//                               : null
//                           }
//                           onChange={(value) => {
//                             if (value && value.value) {
//                               setRole(value.value);
//                             } else {
//                               setRole("");
//                             }
//                           }}
//                           value={values.role}
//                           options={roleOptions}
//                           placeholder="Select Role"
//                           disabled={false}
//                         />
//                         {touched.role && errors.role ? (
//                           <div className={classes.errorMessage}>
//                             {errors.role}
//                           </div>
//                         ) : (
//                           <br />
//                         )}
//                       </Form.Group>
//                     </Col>
//                     <Col md={3}>
//                       <Form.Group controlId="formRequirementBase">
//                         <Form.Label>Skill*</Form.Label>
//                         <CustomSelect
//                           className={
//                             touched.skill && errors.skill
//                               ? classes.error
//                               : null
//                           }
//                           onChange={(value) => {
//                             if (value && value.value) {
//                               setSkill(value.value);
//                             } else {
//                               setSkill("");
//                             }
//                           }}
//                           value={values.skill}
//                           options={skillOptions}
//                           placeholder="Select Skill"
//                           disabled={false}
//                         />
//                         {touched.skill && errors.skill ? (
//                           <div className={classes.errorMessage}>
//                             {errors.skill}
//                           </div>
//                         ) : (
//                           <br />
//                         )}
//                       </Form.Group>
//                     </Col>
//                     <Col md={3}>
//                       <Form.Group controlId="formAggregate">
//                         <Form.Label>
//                           Aggregate
//                         </Form.Label>
//                         <Form.Control
//                           name="aggregate"
//                           placeholder="Enter Aggregate"
//                           type="text"
//                           onChange={data=>setAggregate(data.target.value)}
//                           onBlur={handleBlur}
//                           value={values.aggregate}
//                           className={
//                             touched.aggregate &&
//                             errors.aggregate
//                               ? classes.error
//                               : null
//                           }
//                         />
//                         {touched.aggregate &&
//                         errors.aggregate ? (
//                           <div className={classes.errorMessage}>
//                             {errors.aggregate}
//                           </div>
//                         ) : (
//                           <br />
//                         )}
//                       </Form.Group>
//                     </Col>
//                     <Col md={3}>
//                       <Form.Group controlId="formLocation">
//                         <Form.Label>Location*</Form.Label>
//                         <Form.Control
//                           name="location"
//                           placeholder="Enter Location"
//                           type="text"
//                           onChange={e=>setLocation(e.target.value)}
//                           onBlur={handleBlur}
//                           value={values.location}
//                           className={
//                             touched.location && errors.location
//                               ? classes.error
//                               : null
//                           }
//                         />
//                         {touched.location && errors.location ? (
//                           <div className={classes.errorMessage}>
//                             {errors.location}
//                           </div>
//                         ) : (
//                           <br />
//                         )}
//                       </Form.Group>
//                     </Col>
//                     <Col md={3}>
//                       <Form.Group controlId="formStatus">
//                         <Form.Label>Candidate Status</Form.Label>
//                         <CustomSelect
//                           className={
//                             touched.status && errors.status
//                               ? classes.error
//                               : null
//                           }
//                           onChange={(value) => {
//                             if (value && value.value) {
//                               setStatus(value.value);
//                             } else {
//                               setStatus(" ");
//                             }
//                           }}
//                           value={values.status}
//                           options={statusOptions}
//                           placeholder="Select Status"
//                           disabled={false}
//                         />
//                         {touched.status && errors.status ? (
//                           <div className={classes.errorMessage}>
//                             {errors.status}
//                           </div>
//                         ) : (
//                           <br />
//                         )}
//                       </Form.Group>
//                     </Col>
//                     <Col md={3}>
//                       <Form.Group controlId="formComments">
//                         <Form.Label>Comments</Form.Label>
//                         <RichTextEditor
//                           toolbarConfig={toolbarConfig}
//                           value={
//                             comments
//                               ? comments
//                               : RichTextEditor.createEmptyValue()
//                           }
//                           onChange={(value) => {
//                             if (value) {
//                               setComments(value);
//                             } else {
//                               setComments(RichTextEditor.createEmptyValue());
//                             }
//                           }}
//                           className={classes.zInd}
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                 </Col>
//               </Row>
//               <Row className="mt-3">
//                 <Col md={2} xs={6}>
//                   <Button
//                     variant="primary"
//                     type="submit"
//                     disabled={isSubmitting}
//                   >
//                     Update
//                   </Button>
//                 </Col>
//               </Row>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default CandidateInfo;

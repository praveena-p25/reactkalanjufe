/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable no-self-assign */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { getOptionsCampus, addCandidate } from "../../../Api/masterdata";
import { httpRequest } from "Api/httpRequest";
import PageTitle from "components/projects/PageTitle/PageTitle";
import { Formik } from "formik";
import showNotification from "utils/showNotification";
import * as Yup from "yup";
import CustomSelect from "../EditCampus/CustomSelect";

import classes from "./AddInterview.module.css";

const toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ["BLOCK_TYPE_BUTTONS"],
  INLINE_STYLE_BUTTONS: [
    { label: "Bold", style: "BOLD", className: "custom-css-class" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
  ],
  BLOCK_TYPE_DROPDOWN: [
    { label: "Normal", style: "unstyled" },
    { label: "Heading Large", style: "header-one" },
    { label: "Heading Medium", style: "header-two" },
    { label: "Heading Small", style: "header-three" },
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: "UL", style: "unordered-list-item" },
    // {label: 'OL', style: 'ordered-list-item'}
  ],
};

//options

const branchOptions = [
  { value: "CSE", label: "CSE" },
  { value: "ECE", label: "ECE" },
  { value: "EEE", label: "EEE" },
  { value: "IT", label: "IT" },
  { value: "MBA", label: "MBA" },
  { value: "BCA", label: "BCA" },
  { value: "MCA", label: "MCA" },
];

const AddCandidate = () => {
  const id = useParams().id;
  const [evaluatorOptions, setevaluatorOptions] = useState([]);
  const [recruiterOptions, setrecruiterOptions] = useState([]);
  const [collegename, setcollegename] = useState("");
  const [role, setrole] = useState("");
  const getCandidateDetails = async () => {
    const details = await getOptionsCampus(id);
    return details.data.result;
  };

  useEffect(() => {
    getCandidateDetails().then((data) => {
      setcollegename(data.college[0].college);
      setrole(data.college[0].role);
      //   //Evaluator Options
      //   let temp = [];
      //   data.eval.map((evaluator) => {
      //     var obj = { value: evaluator.id.toString(), label: evaluator.name };
      //     temp.push(obj);
      //   });
      //   setevaluatorOptions(temp);

      //   //recruiterOptions
      //   let recruitopt = [];
      //   data.recruiter.map((recruit) => {
      //     var obj = { value: recruit.id, label: recruit.name };
      //     recruitopt.push(obj);
      //   });
      //   setrecruiterOptions(recruitopt);
    });
  }, [collegename, role]);

  //VALIDATION SCHEMA FUNCTIONS
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "*Names must have at least 2 characters")
      .max(250, "*Names can't be longer than 250 characters")
      .matches(
        /^[A-Za-z]+[A-Za-z\s]{1,250}$/,
        "*Name must be in a proper format"
      )
      .required("*Name is required"),
    phone: Yup.string()
      .matches(/^[6-9]{1}[0-9]{9}$/gm, "*Phone number is not valid")
      .required("*Phone number required"),
    email: Yup.string()
      .min(2, "*Email must have at least 2 characters")
      .max(250, "*Email can't be longer than 250 characters")
      .email("*Must be a valid email address")
      .required("*Email required"),

    branch: Yup.string().required("*Branch is required"),
    role: Yup.string().required("*Role is required"),
    college: Yup.string().required("*College is required"),
    location: Yup.string()
      .min(2, "*Location Name must have at least 2 characters")
      .max(250, "*Location Name can't be longer than 250 characters")
      .matches(
        /^[A-Za-z]+[A-Za-z\s]{1,250}$/,
        "*Location must be in a proper format"
      )
      .required("*Location is required"),
    status: Yup.string(),

    offered_ctc: Yup.string().matches(
      /^\d+\.\d{1,2}$/,
      "*CTC must be in a valid format"
    ),
  });
  const history = useHistory();

  return (
    <div className={`px-3 py-3 `}>
      <PageTitle
        title="Add Candidate"
        button="back"
        onButtonClick={() => history.goBack()}
      />
      <div className="px-3 py-3 mt-3" style={{ backgroundColor: "#fff" }}>
        <div className={classes.head}>
          <h5 className={classes.title}>Candidate Info</h5>
        </div>
        <Formik
          initialValues={{
            name: "",
            phone: "",
            email: "",
            branch: "",
            location: "",
            college: collegename,
            role: role,
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            let backup = {
              name: values.name,
              phone: values.phone,
              email: values.email,
              branch: values.branch,
              location: values.location,
              college: values.college,
              role: values.role,
            };

            var form_data = {};
            for (var key in values) {
              form_data[key] = values[key];
            }
            try {
              const response = await addCandidate(form_data, id);
              if (response) {
                resetForm();
                history.push(`/Campus/${id}/edit/${response.data.insertId}`);
                showNotification("Successfully Created", "success");
              }
            } catch (error) {
              values.name = backup.name;
              values.phone = backup.phone;
              values.email = backup.email;
              values.branch = backup.branch;
              values.location = backup.location;
              values.college = backup.college;
              values.role = backup.role;
              showNotification(error.message, "error");
            }
            // Sets setSubmitting to false after form is reset
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            validateOnBlur,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldTouched,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit} autoComplete="off">
              <Row>
                <Col md={12}>
                  <Row>
                    <Col md={3}>
                      <Form.Group controlId="candidateName">
                        <Form.Label>Candidate Name*</Form.Label>
                        <Form.Control
                          name="name"
                          placeholder="Name"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          className={
                            touched.name && errors.name ? classes.error : null
                          }
                        />

                        {touched.name && errors.name ? (
                          <div className={classes.errorMessage}>
                            {errors.name}
                          </div>
                        ) : (
                          <br />
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="formcandidatephone">
                        <Form.Label>Candidate Phone*</Form.Label>
                        <Form.Control
                          name="phone"
                          placeholder="Phone Number"
                          type="text"
                          onChange={async (e) => {
                            setFieldValue("phone", e.target.value);
                          }}
                          onBlur={handleBlur}
                          value={values.phone}
                          className={
                            touched.phone && errors.phone ? classes.error : null
                          }
                        />
                        {touched.phone && errors.phone ? (
                          <div className={classes.errorMessage}>
                            {errors.phone}
                          </div>
                        ) : (
                          <br />
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="formcandidateemail">
                        <Form.Label>Candidate Email*</Form.Label>
                        <Form.Control
                          name="email"
                          placeholder="Email"
                          type="text"
                          onChange={async (e) => {
                            setFieldValue("email", e.target.value);
                          }}
                          value={values.email}
                          className={
                            touched.email && errors.email ? classes.error : null
                          }
                        />
                        {touched.email && errors.email ? (
                          <div className={classes.errorMessage}>
                            {errors.email}
                          </div>
                        ) : (
                          <br />
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group controlId="formCollege">
                        <Form.Label>College*</Form.Label>
                        <Form.Control
                          disabled={true}
                          name="college"
                          placeholder="Enter College"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.college}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group controlId="formRole">
                        <Form.Label>Role*</Form.Label>
                        <Form.Control
                          disabled={true}
                          name="role"
                          placeholder="Enter Role"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.role}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group controlId="formBranch">
                        <Form.Label>Branch*</Form.Label>
                        <CustomSelect
                          className={
                            touched.branch && errors.branch
                              ? classes.error
                              : null
                          }
                          onChange={(value) => {
                            if (value && value.value) {
                              setFieldValue("branch", value.value);
                            } else {
                              setFieldValue("branch", "");
                            }
                          }}
                          value={values.branch}
                          options={branchOptions}
                          placeholder="Select Branch"
                        />
                        {touched.branch && errors.branch ? (
                          <div className={classes.errorMessage}>
                            {errors.branch}
                          </div>
                        ) : (
                          <br />
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="formLocation">
                        <Form.Label>Location*</Form.Label>
                        <Form.Control
                          name="location"
                          placeholder="Enter Location"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.location}
                          className={
                            touched.location && errors.location
                              ? classes.error
                              : null
                          }
                        />
                        {touched.location && errors.location ? (
                          <div className={classes.errorMessage}>
                            {errors.location}
                          </div>
                        ) : (
                          <br />
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={2} xs={6}>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddCandidate;

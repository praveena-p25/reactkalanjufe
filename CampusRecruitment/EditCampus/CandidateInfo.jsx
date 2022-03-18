/* eslint-disable no-unused-vars */
/* eslint-disable no-self-assign */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import RichTextEditor from "react-rte";
// import Dashbody from "components/dashboard/dash-body/DashBody";

import { editRecruit } from "../../../Api/masterdata";
import { Formik } from "formik";
import showNotification from "utils/showNotification";
import * as Yup from "yup";
import CustomSelect from "./CustomSelect";
import classes from "./EditCandidate.module.css";

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

const branchOptions = [
  { value: "CSE", label: "CSE" },
  { value: "ECE", label: "ECE" },
  { value: "EEE", label: "EEE" },
  { value: "IT", label: "IT" },
];

const CandidateInfo = (props) => {
  const id = useParams().candidateid;
  const campusid = useParams().id;
  useEffect(() => {}, [props.data]);

  //VALIDATION SCHEMA
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
    college: Yup.string().required("*College is required"),
    role: Yup.string().required("*Role is required"),
    branch: Yup.string().required("*Branch is required"),
    location: Yup.string()
      .min(2, "*Location must have at least 2 characters")
      .max(40, "*Location can't be longer than 250 characters")
      .matches(
        /^[A-Za-z]+[A-Za-z\s]{1,250}$/,
        "*Location must be in a proper format"
      )
      .required("*Location is required"),
  });

  const history = useHistory();

  return (
    <div className={`px-3 py-2 `}>
      <div className={classes.head}>
        <h5 className={classes.title}>Candidate Info</h5>
      </div>
      <div className="px-3" style={{ backgroundColor: "#fff" }}>
        <Formik
          initialValues={{
            name: props.data.candidatename,
            phone: props.data.phone,
            email: props.data.email,
            branch: props.data.branch,
            college: props.data.college_id,
            role: props.data.role,
            location: props.data.location,
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
              college: values.college,
              role: values.role,
              location: values.location,
            };

            var form_data = {};
            for (var key in values) {
              // console.log(key, values[key]);
              form_data[key] = values[key];
            }
            try {
              const response = await editRecruit(form_data, id, campusid);
              if (response) {
                resetForm();
                showNotification("Updated Successfully", "success");
                history.push(`/Campus/${campusid}`);
              }
            } catch (error) {
              values.name = backup.name;
              values.phone = backup.phone;
              values.email = backup.email;
              values.branch = backup.branch;
              values.college = backup.college;
              values.role = backup.role;
              values.location = backup.location;
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
                          onBlur={async (e) => {
                            handleBlur(e);
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
                        <CustomSelect
                          disabled={true}
                          className={
                            touched.college && errors.college
                              ? classes.error
                              : null
                          }
                          onChange={(value) => {
                            if (value && value.value) {
                              setFieldValue("college", value.value);
                            } else {
                              setFieldValue("college", "");
                            }
                          }}
                          value={
                            values.college ? values.college.toString() : ""
                          }
                          options={props.collegeOptions}
                          placeholder="Select College"
                        />
                        {touched.college && errors.college ? (
                          <div className={classes.errorMessage}>
                            {errors.college}
                          </div>
                        ) : (
                          <br />
                        )}
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
                      <Form.Group controlId="formRole">
                        <Form.Label>Role*</Form.Label>
                        <CustomSelect
                          disabled={true}
                          className={
                            touched.role && errors.role ? classes.error : null
                          }
                          onChange={(value) => {
                            if (value && value.value) {
                              setFieldValue("role", value.value);
                            } else {
                              setFieldValue("role", "");
                            }
                          }}
                          value={values.role}
                          options={props.roleOptions}
                          placeholder="Select Role"
                        />
                        {touched.role && errors.role ? (
                          <div className={classes.errorMessage}>
                            {errors.role}
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
                    Update
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

export default CandidateInfo;

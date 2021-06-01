import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import './Content.css';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { Formik, Form, useField, Field } from 'formik';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: '5px 0px',
      width: '100%',
    },
  },
}));

const MyTextField = ({ type, rows, multiline, placeholder, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  return (
    <TextField
      type={type}
      rows={rows}
      multiline={multiline}
      placeholder={placeholder}
      {...field}
      helperText={errorText}
      variant="outlined"
      error={!!errorText}
    />
  )
}
const validationSchema = Yup.object({
  fullName: Yup.string().required('Full name is requird.'),
  cnic: Yup.string().required('CNIC Number is required.'),
  email: Yup.string().email('Please enter a valid email').required('Email address is required,'),
  mobileNo: Yup.string().required('Mobile No is required.'),
  address: Yup.string().required('House address is required.'),
  cityName: Yup.string().required('City Name is required.'),
  committee: Yup.string().required('Please select anyone committee'),
  photo: Yup.mixed().required('Please upload picture of bank deposite slip')
    .test("size", "Image should be  format", (value) => {
      console.log(value)
      return value && value[0].size <= 500000;
     
    }),
});

function Main() {
  const classes = useStyles();
  const [committee, setCommittee] = useState([{ label:"Please Select committee", value:"" }]);

  useEffect(() => {
    async function getData() {
      const res = await fetch('https://mydreamcommittee.com/v1/committees');
      const body = await res.json();
      setCommittee(body.data.committees);
    }
    getData()
  }, []);

  return (
    <div className="registerFrom">
      <Container>
        <div className="heading">
          <h1>Registration Form</h1>
        </div>
        <div className="rForm">
          <Formik
            initialValues={{
              fullName: '',
              cnic: '',
              email: '',
              mobileNo: '',
              address: '',
              cityName: '',
              photo: '',
              // terms: false,
            }}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting }) => {
              setSubmitting(true);
              //make async call
              console.log(data);
              setSubmitting(false);
            }}
          >
            {({ values, errors, isSubmitting, }) => (
              <Form>
                <Row className="firstRow">
                  <Col xs={12} sm={12} md={6} lg={6} className="coll" className={classes.root}>
                    <label>Name:</label><br />
                    <MyTextField
                      placeholder="Full Name"
                      name="fullName"

                    />
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6} className="coll" className={classes.root}>
                    <label>CNIC:</label><br />
                    <MyTextField
                      placeholder="CNIC"
                      name="cnic"

                    />
                  </Col>
                </Row>
                <Row className="firstRow">
                  <Col xs={12} sm={12} md={6} lg={6} className="coll" className={classes.root}>
                    <label>Email:</label><br />
                    <MyTextField
                      placeholder="Email"
                      name="email"

                    />
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6} className="coll" className={classes.root}>
                    <label>Mobile No:</label><br />
                    <MyTextField
                      placeholder="Mobile No"
                      name="mobileNo"

                    />
                  </Col>
                </Row>
                <Row className="firstRow">
                  <Col xs={12} sm={12} md={6} lg={6} className="coll" className={classes.root}>
                    <label>Address:</label><br />
                    <MyTextField
                      placeholder="Address"
                      name="address"

                    />
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6} className="coll" className={classes.root}>
                    <label>City Name:</label><br />
                    <MyTextField
                      placeholder="City Name"
                      name="cityName"
                      as={TextField}
                      variant='outlined'
                    />
                  </Col>
                </Row>
                <Row className="firstRow">
                  <Col xs={12} sm={12} md={6} lg={6} className="coll" className={classes.root}>
                    <label>Committees:</label><br />
                    <Field
                      name="committee"
                      as={Select}
                      variant='outlined'
                      native
                      type="Select"
                    >
                      {committee.map(item => {
                        return (
                          <option key={item.value} value={item.value}>{item.label}</option>
                        )
                      })}
                    </Field>
                    {/* {errors.committee} */}
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6} className="coll" className={classes.root}>
                    <label>Upload picture of deposite slip:</label><br />
                    <MyTextField
                      type='file'
                      name="photo"
                    />
                  </Col>
                </Row>
                {/* <Row className="firstRow">
                  <Col>
                    <lable>
                      <Field
                        as={Checkbox}
                        name="terms"
                        type="checkbox"
                      />
                    I accept terms and condition.
                    </lable>
                  </Col>
                </Row> */}
                <Row className="btnRow">
                  <Button
                    style={{
                      color: "white",
                      backgroundColor: "rgb(252, 143, 0)",
                      padding: "10px 20px"
                    }}
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Register
                  </Button>
                </Row>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
    </div>
  );
}
export default Main;
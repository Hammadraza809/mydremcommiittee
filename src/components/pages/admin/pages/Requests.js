import React, { useState, useEffect } from 'react';
import { Button, Select, Table, TableCell, TableBody, TableContainer, TableHead, TableRow, makeStyles } from '@material-ui/core';
import ApprovedBtn from './common/ApprovedBtn';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Row, Col } from 'react-bootstrap';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        '& > *': {
            margin: theme.spacing(0),
            width: '100%',
        },
        flexGrow: 1,
    },
    table: {
        minWidth: 650,
    },
    bottom: {
        color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    top: {
        color: '#1a90ff',
        animationDuration: '550ms',
        position: 'absolute',
        left: 0,
    },
    circle: {
        strokeLinecap: 'round',
    },
}));

const validationSchema = Yup.object({
    committee: Yup.string().required('Please select committee'),
})

function Requests() {
    const classes = useStyles();
    const [requests, setRequests] = useState([]);
    const [committee, setCommittee] = useState([]);
    const [loading, setLoading] = useState(false);

    //Fetching Committess for drop down.
    useEffect(() => {
        async function getData() {
            fetch(`https://mydreamcommittee.com/v1/committees`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then(res => res.json())
                .then(result => {
                    setLoading(false)
                    setCommittee(result.data.committees)
                })
                .catch(err => {
                    setLoading(false);
                    alert("Connection timeout please reload the page to load content")
                    console.log(err)
                    return null;
                });
        }
        getData()
    }, []);


    //getting filtered members
    const getMembers = data => {

        setLoading(true)
        fetch(`https://mydreamcommittee.com/v1/controller/user.php?committee=${data}&status=pending`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(result => {
                setLoading(false)
                setRequests(result.data.users)
            })
            .catch(err => {
                setLoading(false);
                alert("Connection timeout please reload the page to load content")
                console.log(err);
                return null;
            });
    }
    
    //fetching all pending members
    useEffect(() => {
        async function getData() {
            fetch(`https://mydreamcommittee.com/v1/users/pending`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then(res => res.json())
                .then(result => {
                    console.log(result)
                    setLoading(false)
                    setRequests(result.data.users)
                })
                .catch(err => {
                    setLoading(false);
                    alert("Connection timeout please reload the page to load content")
                    console.log(err);
                    return null;
                });
        }
        getData()
    }, []);
    
    //after deletion remaining members fetching.
    const getRemMembers = () => {
        fetch(`https://mydreamcommittee.com/v1/users/pending`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(result => {
                setRequests(result.data.users)
            })
            .then(err => {
                setLoading(false);
                alert("Connection timeout please reload the page to load content")
                console.log(err);
                return null;
            });
    }

    //deleting a member
    const onDelete = (id) => {
        fetch(`https://mydreamcommittee.com/v1/users/${id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(result => {
                if (result.statusCode === 200) {
                    window.location.reload(true);
                    setRequests(null);
                    getRemMembers()
                }
            })
            .catch(err => {
                setLoading(false);
                alert("Connection timeout please reload the page to load content")
                console.log(err);
                return null;
            })
    }
    return (
        <div>
            <div>
                <h1><u>Incoming Requests</u></h1>
                <hr />
            </div>
            <div className="filter">
                <Formik
                    initialValues={{
                        committee: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(data, { setSubmitting }) => {
                        setSubmitting(true)
                        getMembers(data.committee);
                    }}
                >
                    {({ errors, isSubmitting, values, handleChange }) => (
                        <Form>
                            <Row>
                                <Col className={classes.root}>
                                    <label>Select Committee:</label>
                                    <Field
                                        as={Select}
                                        name="committee"
                                        variant='outlined'
                                        native
                                    >
                                        <option>Please Select Committee</option>
                                        {committee.map(item => {
                                            return (
                                                <option key={item.value} value={item.value}>{item.label}</option>
                                            )
                                        })}
                                    </Field>

                                </Col>
                                <Col className={classes.root}>
                                    <Button
                                        style={{
                                            color: "white",
                                            backgroundColor: "rgb(252, 143, 0)",
                                            margin: "24px 10px 0 0",
                                            padding: "10px 10px",
                                            width: '20%',
                                        }}
                                        variant="contained"
                                        type="submit"

                                    >
                                        {loading ? <CircularProgress
                                            variant="indeterminate"
                                            disableShrink
                                            className={classes.bottom}
                                            classes={{
                                                circle: classes.circle,
                                            }}
                                            size={30}
                                            thickness={4}
                                            value={100}
                                        /> : 'Filter'}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </div>
            <div className="results">
                <div className="rTable">
                    <TableContainer>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>CNIC</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Mobile No</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>City</TableCell>
                                    <TableCell>Committee</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Referral ID</TableCell>
                                    {/* <TableCell>Image Link</TableCell> */}
                                    <TableCell></TableCell>
                                    <TableCell>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests && requests.map((request, index) => (
                                    <TableRow key={request.id}>
                                        <TableCell>{request.name}</TableCell>
                                        <TableCell>{request.cnic}</TableCell>
                                        <TableCell>{request.email}</TableCell>
                                        <TableCell>{request.mobileno}</TableCell>
                                        <TableCell>{request.address}</TableCell>
                                        <TableCell>{request.city}</TableCell>
                                        <TableCell>{request.committee}</TableCell>
                                        <TableCell>{request.status}</TableCell>
                                        <TableCell>{request.refrenceId}</TableCell>
                                        {/* <TableCell
                                            // component='a'
                                            // href={request.images[0].imageurl}
                                            // target='_blank'
                                            padding='none'
                                        >
                                            <b><u>Click to open image</u></b>
                                        </TableCell> */}
                                        <TableCell><ApprovedBtn request={request} index={index}/></TableCell>
                                        <TableCell>
                                            <IconButton aria-label="delete" onClick={() => { onDelete(request.id) }}>
                                                <DeleteIcon color='error' />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    )
}
export default Requests;
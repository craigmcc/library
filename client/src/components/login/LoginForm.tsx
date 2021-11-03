// LoginForm -----------------------------------------------------------------

// Form for logging in to this application.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import {Formik, FormikValues} from "formik";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";

// Internal Modules ----------------------------------------------------------

import Credentials from "../../models/Credentials";

// Property Details ----------------------------------------------------------

export interface Props {
    autoFocus?: boolean;        // Should the first element receive autfocus? [false]
    handleLogin:                // Handle (credentials) for login request
        (credentials: Credentials) => void;
}

// Component Details ---------------------------------------------------------

export const LoginForm = (props: Props) => {

    const [initialValues] = useState({
        password: "",
        username: ""
    });

    const handleSubmit = async (values: FormikValues) => {
        props.handleLogin({
            password: values.password,
            username: values.username,
        });
    }

    const validationSchema = () => {
        return Yup.object().shape({
            password: Yup.string()
                .required("Password is required"),
            username: Yup.string()
                .required("Username is required")
        })
    }

    return (

        <Container fluid id="LoginForm">

            <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                    handleSubmit(values);
                }}
                validateOnBlur={true}
                validateOnChange={false}
                validationSchema={validationSchema}
            >

                {( {
                       errors,
                       handleBlur,
                       handleChange,
                       handleSubmit,
                       isSubmitting,
                       isValid,
                       touched,
                       values,
                   }) => (

                    <>

                        <Form
                            noValidate
                            onSubmit={handleSubmit}
                        >

                                <Form.Group className="mb-3" controlId="username">
                                    <Form.Label column="sm">Username:</Form.Label>
                                    <Form.Control
                                        autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                                        isInvalid={touched.username && !!errors.username}
                                        isValid={!errors.username}
                                        name="username"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="text"
                                        value={values.username}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Enter your assigned username
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.username}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label column="sm">Password:</Form.Label>
                                    <Form.Control
                                        isInvalid={touched.password && !!errors.password}
                                        isValid={!errors.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="password"
                                        value={values.password}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Enter your assigned password
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>

                            <Row className="mb-3">
                                <Col>
                                    <Button
                                        size="sm"
                                        type="submit"
                                        variant="primary"
                                    >
                                        Log In
                                    </Button>
                                </Col>
                            </Row>

                        </Form>

                    </>

                )}

            </Formik>

        </Container>

    )

}

export default LoginForm;

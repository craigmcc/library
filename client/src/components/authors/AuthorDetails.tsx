// AuthorDetails ----------------------------------------------------------------

// Detail editing form for Author objects.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import {Formik, FormikHelpers, FormikValues} from "formik";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleAuthor, Parent} from "../../types";
import Author from "../../models/Author";
import {validateAuthorNameUnique} from "../../util/AsyncValidators";
import * as ToModel from "../../util/ToModel";
import {toEmptyStrings, toNullValues} from "../../util/Transformations";

// Property Details ----------------------------------------------------------

export interface Props {
    author: Author;                     // Initial values (id<0 for adding)
    autoFocus?: boolean;                // Should the first element receive autofocus? [false]
    handleInsert?: HandleAuthor;        // Handle (Author) insert request [not allowed]
    handleRemove?: HandleAuthor;        // Handle (Author) remove request [not allowed]
    handleReturn: HandleAction;         // Handle return to options view
    handleUpdate?: HandleAuthor;        // Handle (Author) update request [not allowed]
    parent: Parent;                     // Owning parent object
    showPrincipal?: boolean;            // Show the Principal field? [false]
}

// Component Details ---------------------------------------------------------

const AuthorDetails = (props: Props) => {

    const [adding] = useState<boolean>(props.author.id < 0);
    const [initialValues] = useState<any>(toEmptyStrings(props.author));
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const handleSubmit = (values: FormikValues, actions: FormikHelpers<FormikValues>): void => {
        if (adding && props.handleInsert) {
            props.handleInsert(ToModel.AUTHOR(toNullValues(values)));
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(ToModel.AUTHOR(toNullValues(values)));
        }
    }

    const onConfirm = (): void => {
        setShowConfirm(true);
    }

    const onConfirmNegative = (): void => {
        setShowConfirm(false);
    }

    const onConfirmPositive = (): void => {
        setShowConfirm(false);
        if (props.handleRemove) {
            props.handleRemove(props.author)
        }
    }

    const validationSchema = () => {
        return Yup.object().shape({
            active: Yup.boolean(),
            firstName: Yup.string()
                .required("First Name is required"),
            lastName: Yup.string()
                .required("Last Name is required")
                .test("unique-name",
                    "That name is already in use within this Library",
                    async function (this) {
                        return validateAuthorNameUnique(ToModel.AUTHOR(this.parent));
                    }),
            notes: Yup.string(),
        });
    }

    return (

        <>

            {/* Details Form */}
            <Container id="AuthorDetails">

                <Row className="mb-3 ml-1 mr-1">
                    <Col className="text-center">
                        {(adding) ? (
                            <span>Add New</span>
                        ) : (
                            <span>Edit Existing</span>
                        )}
                        &nbsp;Author for {props.parent._model}:&nbsp;
                        <span className="text-info">
                            {props.parent._title}
                        </span>
                    </Col>
                    <Col className="text-end">
                        <Button
                            onClick={() => props.handleReturn()}
                            size="sm"
                            type="button"
                            variant="secondary"
                        >Back</Button>
                    </Col>
                </Row>

                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                        handleSubmit(values, actions);
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

                        <Form
                            id="AuthorDetails"
                            noValidate
                            onSubmit={handleSubmit}
                        >

                            <Row className="g-3 mb-3" id="firstNameLastNameRow">
                                <Form.Group as={Col} controlId="firstName" id="firstNameGroup">
                                    <Form.Label>First Name:</Form.Label>
                                    <Form.Control
                                        autoFocus={props.autoFocus ? props.autoFocus : undefined}
                                        isInvalid={touched.firstName && !!errors.firstName}
                                        isValid={!errors.firstName}
                                        name="firstName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.firstName}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        First Name is required.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.firstName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="lastName" id="lastNameGroup">
                                    <Form.Label>Last Name:</Form.Label>
                                    <Form.Control
                                        isInvalid={touched.lastName && !!errors.lastName}
                                        isValid={!errors.lastName}
                                        name="lastName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.lastName}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Last Name is required and First Name + Last Name must be unique.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.lastName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="g-3 mb-3" id="notesRow">
                                <Form.Group as={Col} controlId="notes" id="notesGroup">
                                    <Form.Label>Notes:</Form.Label>
                                    <Form.Control
                                        isInvalid={touched.notes && !!errors.notes}
                                        isValid={!errors.notes}
                                        name="notes"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.notes}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Miscellaneous notes about this Author.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.notes}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="g-3 mb-3" id="principalActiveRow">
                                {props.showPrincipal ? (
                                    <Form.Group as={Col} controlId="principal" id="principalGroup">
                                        <Form.Check
                                            feedback={errors.principal}
                                            defaultChecked={values.principal}
                                            id="principal"
                                            label="Principal Author?"
                                            name="principal"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                ) : null }
                                <Form.Group as={Col} controlId="active" id="activeGroup">
                                    <Form.Check
                                        feedback={errors.active}
                                        defaultChecked={values.active}
                                        id="active"
                                        label="Active?"
                                        name="active"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Col className="col-11">
                                    <Button
                                        disabled={isSubmitting || !(props.handleInsert || props.handleUpdate)}
                                        size="sm"
                                        type="submit"
                                        variant="primary"
                                    >
                                        Save
                                    </Button>
                                </Col>
                                <Col className="col-1">
                                    <Button
                                        disabled={adding || !props.handleRemove}
                                        onClick={onConfirm}
                                        size="sm"
                                        type="button"
                                        variant="danger"
                                    >
                                        Remove
                                    </Button>
                                </Col>
                            </Row>

                        </Form>

                    )}

                </Formik>

            </Container>

            {/* Remove Confirm Modal */}
            <Modal
                animation={false}
                backdrop="static"
                centered
                dialogClassName="bg-danger"
                onHide={onConfirmNegative}
                show={showConfirm}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>WARNING:  Potential Data Loss</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Removing this Author is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this Author as inactive instead.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onConfirmPositive}
                        size="sm"
                        type="button"
                        variant="danger"
                    >
                        Remove
                    </Button>
                    <Button
                        onClick={onConfirmNegative}
                        size="sm"
                        type="button"
                        variant="primary"
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

        </>

    )

}

export default AuthorDetails;

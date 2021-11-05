// LibraryForm ------------------------------------------------------------------

// Detail editing form for Library objects.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import {Formik,FormikHelpers,FormikValues} from "formik";
import Button from "react-bootstrap/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";

// Internal Modules ----------------------------------------------------------

import {HandleLibrary} from "../../types";
import Library from "../../models/Library";
import {
    validateLibraryNameUnique,
    validateLibraryScopeUnique
} from "../../util/AsyncValidators";
import logger from "../../util/ClientLogger";
import * as ToModel from "../../util/ToModel";
import {toEmptyStrings, toNullValues} from "../../util/Transformations";
import {validateLibraryScope} from "../../util/Validators";

// Incoming Properties ------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    canRemove: boolean;                 // Can remove be performed? [false]
    canSave: boolean;                   // Can save be performed? [false]
    handleInsert: HandleLibrary;        // Handle Library insert request
    handleRemove: HandleLibrary;        // Handle Library remove request
    handleUpdate: HandleLibrary;        // Handle Library update request
    library: Library;                   // Initial values (id < 0 for adding)
}

// Component Details ---------------------------------------------------------

const LibraryForm = (props: Props) => {

    const [adding] = useState<boolean>(props.library.id < 0);
    const [initialValues] = useState(toEmptyStrings(props.library));
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "LibraryForm.useEffect",
            library: props.library,
            values: initialValues,
        });
    }, [props.library, initialValues]);

    const handleSubmit = (values: FormikValues, actions: FormikHelpers<FormikValues>): void => {
        if (adding) {
            props.handleInsert(ToModel.LIBRARY(toNullValues(values)));
        } else {
            props.handleUpdate(ToModel.LIBRARY(toNullValues(values)));
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
        props.handleRemove(props.library);
    }

    const validationSchema = () => {
        return Yup.object().shape({
            active: Yup.boolean(),
            name: Yup.string()
                .required("Name is required")
                .test("unique-name",
                    "That name is already in use",
                    async function (this) {
                        return await validateLibraryNameUnique(ToModel.LIBRARY(this.parent));
                    }
                ),
            notes: Yup.string(),
            scope: Yup.string()
                .required("Scope is required")
                .test("valid-scope",
                    "Only alphanumeric (a-z, A-Z, 0-9) characters are allowed",
                    function(value) {
                        return validateLibraryScope(value);
                    })
                .test("unique-scope",
                    "That scope is already in use",
                    async function(value) {
                        return await validateLibraryScopeUnique(ToModel.LIBRARY(this.parent));
                    }),
        });
    }

    return (

        <>

            {/* Details Form */}
            <Container id="LibraryForm">

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
                            id="LibraryForm"
                            noValidate
                            onSubmit={handleSubmit}
                        >

                            <Row className="g-3 mb-3" id="nameScopeRow">
                                <Form.Group as={Col} controlId="name" id="nameGroup">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control
                                        autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                                        isInvalid={touched.name && !!errors.name}
                                        isValid={!errors.name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.name}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Name of this Library.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="name" id="scopeGroup">
                                    <Form.Label>Scope:</Form.Label>
                                    <Form.Control
                                        isInvalid={touched.scope && !!errors.scope}
                                        isValid={!errors.scope}
                                        name="scope"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.scope}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Scope required to access this Library (must be alphanumeric and unique).
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.scope}
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
                                    <Form.Control.Feedback type="invalid">
                                        {errors.notes}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="g-3 mb-3" id="activeRow">
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

                            <Row className="g-3 mb-3">
                                <Col className="text-start">
                                    <Button
                                        disabled={isSubmitting || !props.canSave}
                                        size="sm"
                                        type="submit"
                                        variant="primary"
                                    >
                                        Save
                                    </Button>
                                </Col>
                                <Col className="text-end">
                                    <Button
                                        disabled={adding || !props.canRemove}
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
                        Removing this Library is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this Library as inactive instead.</p>
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

export default LibraryForm;
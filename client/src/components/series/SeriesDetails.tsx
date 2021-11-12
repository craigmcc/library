// SeriesDetails -------------------------------------------------------------

// Details editing form for Series objects.

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import {Formik, FormikHelpers, FormikValues} from "formik";
import Button from "react-bootstrap/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleSeries, Parent} from "../../types";
import Series from "../../models/Series";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import * as ToModel from "../../util/ToModel";
import {toEmptyStrings, toNullValues} from "../../util/Transformations";

// Property Details ----------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // Should the first element receive autofocus? [false]
    handleInsert?: HandleSeries;        // Handle (Series) insert request [not allowed]
    handleRemove?: HandleSeries;        // Handle (Series) remove request [not allowed]
    handleReturn: HandleAction;         // Handle return to options view
    handleUpdate?: HandleSeries;        // Handle (Series) update request [not allowed]
    parent: Parent;                     // Owning parent object
    series: Series;                     // Initial values (id<0 for adding)
}

// Component Details ---------------------------------------------------------

const SeriesDetails = (props: Props) => {

    const [initialValues, setInitialValues] = useState<any>(toEmptyStrings(props.series));
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    useEffect(() => {
        logger.info({
            context: "SeriesDetails.useEffect",
            series: Abridgers.SERIES(props.series),
        });
        setInitialValues(toEmptyStrings(props.series));
    }, [props.series, props.series.id]);

    const handleSubmit = (values: FormikValues, actions: FormikHelpers<FormikValues>): void => {
        if ((props.series.id < 0) && props.handleInsert) {
            props.handleInsert(ToModel.SERIES(toNullValues(values)));
        } else if ((props.series.id > 0) && props.handleUpdate) {
            props.handleUpdate(ToModel.SERIES(toNullValues(values)));
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
            props.handleRemove(props.series)
        }
    }

    const validationSchema = () => {
        return Yup.object().shape({
            active: Yup.boolean(),
            copyright: Yup.string(),
            name: Yup.string()
                .required("Name is required"),
            notes: Yup.string(),
        });
    }

    return (

        <>

            {/* Details Form */}
            <Container id="SeriesDetails">

                <Row className="mb-3 ml-1 mr-1">
                    <Col className="text-center">
                        {(props.series.id < 0) ? (
                            <span>Add New</span>
                        ) : (
                            <span>Edit Existing</span>
                        )}
                        &nbsp;Series for {props.parent._model}:&nbsp;
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
                            id="SeriesDetails"
                            noValidate
                            onSubmit={handleSubmit}
                        >

                            <Row className="g-3 mb-3" id="nameRow">
                                <Form.Group as={Col} controlId="name" id="nameGroup">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control
                                        autoFocus={props.autoFocus ? props.autoFocus : undefined}
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
                                        Name is required must be unique within a Library.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
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
                                        Miscellaneous notes about this Series.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.notes}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="g-3 mb-3" id="copyrightActiveRow">
                                <Form.Group as={Col} className="col-2" controlId="copyright" id="copyrightGroup">
                                    <Form.Label>Copyright Year:</Form.Label>
                                    <Form.Control
                                        isInvalid={touched.copyright && !!errors.copyright}
                                        isValid={!errors.copyright}
                                        name="copyright"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.copyright}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Copyright year (YYYY) for this Series.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.copyright}
                                    </Form.Control.Feedback>
                                </Form.Group>
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
                                        disabled={(props.series.id < 0) || (!props.handleRemove)}
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
                        Removing this Series is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this Series as inactive instead.</p>
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

export default SeriesDetails;

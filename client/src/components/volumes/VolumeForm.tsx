// VolumeForm ---------------------------------------------------------------

// Detail editing form for Volume objects.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import {Formik, FormikHelpers, FormikValues} from "formik";
import Button from "react-bootstrap/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";

// Internal Modules ----------------------------------------------------------

import {HandleVolume} from "../../types";
import Volume from "../../models/Volume";
import * as ToModel from "../../util/ToModel";
import {VALID_VOLUME_LOCATIONS, VALID_VOLUME_TYPES} from "../../util/ApplicationValidators";
import {toEmptyStrings, toNullValues} from "../../util/Transformations";

// Property Details ----------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // Should the first element receive autofocus? [false]
    canRemove?: boolean;                // Can Remove be performed? [false]
    canSave?: boolean;                  // Can Save be performed? [false]
    handleInsert: HandleVolume;         // Handle (Volume) insert request
    handleRemove: HandleVolume;         // Handle (Volume) remove request
    handleUpdate: HandleVolume;         // Handle (Volume) update request
    volume: Volume;                     // Initial values (id<0 for adding)
}

// Component Details ---------------------------------------------------------

const VolumeForm = (props: Props) => {

    const [adding] = useState<boolean>(props.volume.id < 0);
    const [initialValues] = useState(toEmptyStrings(props.volume));
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const handleSubmit = (values: FormikValues, actions: FormikHelpers<FormikValues>): void => {
        if (adding) {
            props.handleInsert(ToModel.VOLUME(toNullValues(values)));
        } else {
            props.handleUpdate(ToModel.VOLUME(toNullValues(values)));
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
        props.handleRemove(props.volume)
    }

    type ValidLocation = {
        key: string,
        value: string,
    }
    const validLocations = (): ValidLocation[] => {
        const results: ValidLocation[] = [];
        for (let [key, value] of VALID_VOLUME_LOCATIONS) {
            results.push({key: key, value: value});
        }
        return results;
    }

    type ValidType = {
        key: string,
        value: string,
    }
    const validTypes = (): ValidType[] => {
        const results: ValidType[] = [];
        for (let [key, value] of VALID_VOLUME_TYPES) {
            results.push({key: key, value: value});
        }
        return results;
    }

    const validationSchema = () => {
        return Yup.object().shape({
            active: Yup.boolean(),
            copyright: Yup.string(),
            googleId: Yup.string(),
            isbn: Yup.string(),
            location: Yup.string(),
            name: Yup.string()
                .required("Name is required"),
            notes: Yup.string(),
            read: Yup.boolean(),
            type: Yup.string(),
        });
    }

    return (

        <>

            {/* Details Form */}
            <Container id="VolumeForm">

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
                            id="VolumeForm"
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
                                        Name is required and might not be unique.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="g-3 mb-3" id="locationTypeRow">
                                <Form.Group as={Col} controlId="location" id="locationGroup">
                                    <Form.Label>Volume Location:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="location"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        value={values.location}
                                    >
                                        {validLocations().map((validLocation, index) => (
                                            <option key={index} value={validLocation.key}>
                                                {validLocation.value}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    <Form.Control.Feedback type="valid">
                                        Physical location of this volume.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.location}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="type" id="typeGroup">
                                    <Form.Label>Volume Type:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="type"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        value={values.type}
                                    >
                                        {validTypes().map((validType, index) => (
                                            <option key={index} value={validType.key}>
                                                {validType.value}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    <Form.Control.Feedback type="valid">
                                        Type of content in this Volume.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.type}
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
                                        Miscellaneous notes about this Volume.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.notes}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="g-3 mb-3" id="copyrightGoogleIdIsbnRow">
                                <Form.Group as={Col} controlId="copyright" id="copyrightGroup">
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
                                        Copyright year (YYYY) for this volume.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.copyright}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="googleId" id="googleIdGroup">
                                    <Form.Label>Google Books ID:</Form.Label>
                                    <Form.Control
                                        isInvalid={touched.googleId && !!errors.googleId}
                                        isValid={!errors.googleId}
                                        name="googleId"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.googleId}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Google Books unique identifier for this volume.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.googleId}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="isbn" id="isbnGroup">
                                    <Form.Label>ISBN ID:</Form.Label>
                                    <Form.Control
                                        isInvalid={touched.isbn && !!errors.isbn}
                                        isValid={!errors.isbn}
                                        name="isbn"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.isbn}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        International Standard Book Number for this volume.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.isbn}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="g-3 mb-3" id="readActiveRow">
                                <Form.Group as={Col} controlId="read" id="readGroup">
                                    <Form.Check
                                        feedback={errors.read}
                                        defaultChecked={values.read}
                                        id="read"
                                        label="Already Read?"
                                        name="read"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
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
                                        disabled={isSubmitting || !props.canSave}
                                        size="sm"
                                        type="submit"
                                        variant="primary"
                                    >
                                        Save
                                    </Button>
                                </Col>
                                <Col className="col-1">
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
                        Removing this Volume is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this Volume as inactive instead.</p>
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

export default VolumeForm;

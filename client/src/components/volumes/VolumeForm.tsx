// VolumeForm ----------------------------------------------------------------

// Details editing form for Volume objects.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {BackButton, CheckBoxField, SelectField, SelectOption, TextField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleVolume, Parent} from "../../types";
import Volume, {VolumeData} from "../../models/Volume";
import {validateVolumeNameUnique} from "../../util/AsyncValidators";
import * as ToModel from "../../util/ToModel";
import {VALID_VOLUME_LOCATIONS, VALID_VOLUME_TYPES} from "../../util/ApplicationValidators";

// Property Details ----------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // Should the first element receive autofocus? [false]
    handleInsert?: HandleVolume;        // Handle (Volume) insert request [not allowed]
    handleRemove?: HandleVolume;        // Handle (Volume) remove request [not allowed]
    handleReturn: HandleAction;           // Handle return to previous view
    handleUpdate?: HandleVolume;        // Handle (Volume) update request [not allowed]
    parent: Parent;                     // Owning parent object
    volume: Volume;                     // Initial values (id<0 for adding)
}

// Component Details ---------------------------------------------------------

const VolumeForm = (props: Props) => {

    const adding = (props.volume.id < 0);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const onConfirm = (): void => {
        setShowConfirm(true);
    }

    const onConfirmNegative = (): void => {
        setShowConfirm(false);
    }

    const onConfirmPositive = (): void => {
        setShowConfirm(false);
        if (props.handleRemove) {
            props.handleRemove(props.volume)
        }
    }

    const onSubmit: SubmitHandler<VolumeData> = (values) => {
        const theVolume = new Volume({
            ...props.volume,
            ...values,
        });
        if (adding && props.handleInsert) {
            props.handleInsert(theVolume);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theVolume);
        }
    }

    const validLocations = (): SelectOption[] => {
        const results: SelectOption[] = [];
        for (let [key, value] of VALID_VOLUME_LOCATIONS) {
            results.push({value: key, label: value});
        }
        return results;
    }

    const validTypes = (): SelectOption[] => {
        const results: SelectOption[] = [];
        for (let [key, value] of VALID_VOLUME_TYPES) {
            results.push({value: key, label: value});
        }
        return results;
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        copyright: Yup.string()
            .nullable(),
        googleId: Yup.string()
            .nullable(),
        isbn: Yup.string()
            .nullable(),
        location: Yup.string()
            .nullable(),
        name: Yup.string()
            .required("Name is required")
            .test("unique-name",
                "That name is already in use within this Library",
                async function (this) {
                    return validateVolumeNameUnique(ToModel.VOLUME(this.parent));
                }),
        notes: Yup.string()
            .nullable(),
        read: Yup.boolean(),
        type: Yup.string()
            .required("Type is required"),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<VolumeData>({
        defaultValues: new VolumeData(props.volume),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (

        <>

            {/* Details Form */}
            <Container id="VolumeForm">

                <Row className="mb-3">
                    <Col className="text-start">
                        <BackButton
                            handleBack={props.handleReturn}
                        />
                    </Col>
                    <Col className="text-center">
                        <strong>
                        {(adding) ? (
                            <span>Add New</span>
                        ) : (
                            <span>Edit Existing</span>
                        )}
                        &nbsp;Volume for {props.parent._model}:&nbsp;
                        <span className="text-info">
                            {props.parent._title}
                        </span>
                        </strong>
                    </Col>
                    <Col className="text-end">
                    </Col>
                </Row>

                <Form
                    id="VolumeForm"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <Row className="g-3 mb-3" id="nameRow">
                        <TextField
                            autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                            error={errors.name}
                            label="Name:"
                            name="name"
                            register={register}
                            valid="Name of this Volume (must be unique within a Library)."
                        />
                    </Row>

                    <Row className="g-3 mb-3" id="locationTypeRow">
                        <SelectField
                            error={errors.location}
                            label="Location:"
                            name="location"
                            options={validLocations()}
                            register={register}
                            valid="Physical location of this volume."
                        />
                        <SelectField
                            error={errors.type}
                            label="Volume Type:"
                            name="type"
                            options={validTypes()}
                            register={register}
                            valid="Type of content in this Volume."
                        />
                    </Row>

                    <Row className="g-3 mb-3" id="notesRow">
                        <TextField
                            error={errors.notes}
                            label="Notes:"
                            name="notes"
                            register={register}
                            valid="Miscellaneous notes about this Volume."
                        />
                    </Row>

                    <Row className="g-3 mb-3" id="copyrightGoogleIdIsbnRow">
                        <TextField
                            error={errors.copyright}
                            label="Copyright:"
                            name="copyright"
                            register={register}
                            valid="Copyright Year (YYYY) of this Volume."
                        />
                        <TextField
                            error={errors.googleId}
                            label="Google ID:"
                            name="googleId"
                            register={register}
                            valid="Google Books identifier of this Volume."
                        />
                        <TextField
                            error={errors.isbn}
                            label="ISBN:"
                            name="isbn"
                            register={register}
                            valid="International Standard Book Number of this volume."
                        />
                    </Row>

                    <Row className="g-3 mb-3" id="readActiveRow">
                        <CheckBoxField
                            error={errors.read}
                            label="Already Read?"
                            name="read"
                            register={register}
                        />
                        <CheckBoxField
                            error={errors.active}
                            label="Active?"
                            name="active"
                            register={register}
                        />
                    </Row>

                    <Row className="mb-3">
                        <Col className="col-11">
                            <Button
                                disabled={!props.handleInsert && !props.handleUpdate}
                                size="sm"
                                type="submit"
                                variant="primary"
                            >
                                Save
                            </Button>
                        </Col>
                        <Col className="col-1">
                            <Button
                                disabled={adding || (!props.handleRemove)}
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

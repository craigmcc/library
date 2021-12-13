// SeriesDetails -------------------------------------------------------------

// Details editing form for Series objects.

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

// Internal Modules ----------------------------------------------------------

import CheckBoxField from "../general/CheckBoxField";
import TextField from "../general/TextField";
import {HandleAction, HandleSeries, Parent} from "../../types";
import Series from "../../models/Series";
import SeriesData from "../../models/SeriesData";
import {validateSeriesNameUnique} from "../../util/AsyncValidators";
import * as ToModel from "../../util/ToModel";

// Property Details ----------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // Should the first element receive autofocus? [false]
    handleBack: HandleAction;           // Handle return to previous view
    handleInsert?: HandleSeries;        // Handle (Series) insert request [not allowed]
    handleRemove?: HandleSeries;        // Handle (Series) remove request [not allowed]
    handleUpdate?: HandleSeries;        // Handle (Series) update request [not allowed]
    parent: Parent;                     // Owning parent object
    series: Series;                     // Initial values (id<0 for adding)
}

// Component Details ---------------------------------------------------------

const SeriesDetails = (props: Props) => {

    const [adding] = useState<boolean>(props.series.id < 0);
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
            props.handleRemove(props.series)
        }
    }

    const onSubmit: SubmitHandler<SeriesData> = (values) => {
        const theSeries = new Series({
            ...props.series,
            ...values,
        });
        if (adding && props.handleInsert) {
            props.handleInsert(theSeries);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theSeries);
        }
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        copyright: Yup.string()
            .nullable(),
        name: Yup.string()
            .required("Name is required")
            .test("unique-name",
                "That name is already in use within this Library",
                async function (this) {
                    return await validateSeriesNameUnique(ToModel.SERIES(this.parent));
                }),
        notes: Yup.string()
            .nullable(),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<SeriesData>({
        defaultValues: new SeriesData(props.series),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (

        <>

            {/* Details Form */}
            <Container id="SeriesDetails">

                <Row className="mb-3 ml-1 mr-1">
                    <Col className="text-center">
                        {(adding) ? (
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
                            onClick={() => props.handleBack()}
                            size="sm"
                            type="button"
                            variant="secondary"
                        >Back</Button>
                    </Col>
                </Row>

                <Form
                    id="SeriesDetails"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <Row className="g-3 mb-3" id="nameRow">
                        <TextField
                            autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                            errors={errors}
                            label="Name:"
                            name="name"
                            register={register}
                            valid="Name of this Series (must be unique within a Library)."
                        />
                    </Row>

                    <Row className="g-3 mb-3" id="notesRow">
                        <TextField
                            errors={errors}
                            label="Notes:"
                            name="notes"
                            register={register}
                            valid="Miscellaneous notes about this Series."
                        />
                    </Row>

                    <Row className="g-3 mb-3" id="copyrightActiveRow">
                        <TextField
                            errors={errors}
                            label="Copyright:"
                            name="copyright"
                            register={register}
                            valid="Copyright Year (YYYY) of this Series."
                        />
                        <CheckBoxField
                            errors={errors}
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

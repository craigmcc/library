// StoryDetails --------------------------------------------------------------

// Details editing form for Story objects.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import {CaretLeftSquare} from "react-bootstrap-icons";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {CheckBoxField, TextField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleStory, Parent} from "../../types";
import Story, {StoryData} from "../../models/Story";
import {validateStoryNameUnique} from "../../util/AsyncValidators";
import * as ToModel from "../../util/ToModel";

// Property Details ----------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // Should the first element receive autofocus? [false]
    handleInsert?: HandleStory;         // Handle (Story) insert request [not allowed]
    handleRemove?: HandleStory;         // Handle (Story) remove request [not allowed]
    handleReturn: HandleAction;           // Handle return to previous view
    handleUpdate?: HandleStory;         // Handle (Story) update request [not allowed]
    parent: Parent;                     // Owning parent object
    showOrdinal?: boolean;              // Show the Ordinal field? [false]
    story: Story;                       // Initial values (id<0 for adding)
}

// Component Details ---------------------------------------------------------

const StoryDetails = (props: Props) => {

    const adding = (props.story.id < 0);
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
            props.handleRemove(props.story)
        }
    }

    const onSubmit: SubmitHandler<StoryData> = (values) => {
        const theStory = new Story({
            ...props.story,
            ...values,
        });
        if (adding && props.handleInsert) {
            props.handleInsert(theStory);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theStory);
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
                    return validateStoryNameUnique(ToModel.STORY(this.parent));
                }),
        notes: Yup.string()
            .nullable(),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<StoryData>({
        defaultValues: new StoryData(props.story),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (

        <>

            {/* Details Form */}
            <Container id="StoryDetails">

                <Row className="mb-3">
                    <Col className="text-start">
                        <CaretLeftSquare
                            onClick={props.handleReturn}
                            size={32}
                        />
                    </Col>
                    <Col className="text-center">
                        <strong>
                        {(adding) ? (
                            <span>Add New</span>
                        ) : (
                            <span>Edit Existing</span>
                        )}
                        &nbsp;Story for {props.parent._model}:&nbsp;
                        <span className="text-info">
                            {props.parent._title}
                        </span>
                        </strong>
                    </Col>
                    <Col className="text-end">
                    </Col>
                </Row>

                <Form
                    id="StoryDetails"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <Row className="g-3 mb-3" id="nameOrdinalRow">
                        <TextField
                            autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                            errors={errors}
                            label="Name:"
                            name="name"
                            register={register}
                            valid="Name of this Story (must be unique within a Library)"
                        />
                        {props.showOrdinal ? (
                            <TextField
                                className="col-2"
                                errors={errors}
                                label="Ordinal:"
                                name="ordinal"
                                register={register}
                                type="number"
                                valid="Sort order of Stories within a Series"
                            />
                        ) : null }
                    </Row>

                    <Row className="g-3 mb-3" id="notesCopyrightRow">
                        <TextField
                            errors={errors}
                            label="Notes:"
                            name="notes"
                            register={register}
                            valid="Miscellaneous notes about this Story."
                        />
                        <TextField
                            className="col-2"
                            errors={errors}
                            label="Copyright:"
                            name="copyright"
                            register={register}
                            valid="Copyright year (YYYY) for this Story"
                        />
                    </Row>

                    <Row className="g-3 mb-3" id="activeRow">
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
                                disabled={(props.story.id < 0) || (!props.handleRemove)}
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
                        Removing this Story is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this Story as inactive instead.</p>
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

export default StoryDetails;

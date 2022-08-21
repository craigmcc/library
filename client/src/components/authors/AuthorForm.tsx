// AuthorForm ----------------------------------------------------------------

// Detail editing form for Author objects.

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

import {HandleAction, HandleAuthor, Parent} from "../../types";
import Author, {AuthorData} from "../../models/Author";
import {validateAuthorNameUnique} from "../../util/AsyncValidators";
import * as ToModel from "../../util/ToModel";

// Property Details ----------------------------------------------------------

export interface Props {
    author: Author;                     // Initial values (id<0 for adding)
    autoFocus?: boolean;                // Should the first element receive autoFocus? [false]
    handleInsert?: HandleAuthor;        // Handle (Author) insert request [not allowed]
    handleRemove?: HandleAuthor;        // Handle (Author) remove request [not allowed]
    handleReturn: HandleAction;           // Handle return to previous view
    handleUpdate?: HandleAuthor;        // Handle (Author) update request [not allowed]
    parent: Parent;                     // Owning parent object
    showPrincipal?: boolean;            // Show the Principal field? [false]
}

// Component Details ---------------------------------------------------------

const AuthorForm = (props: Props) => {

    const adding = (props.author.id < 0);
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
            props.handleRemove(props.author)
        }
    }

    const onSubmit: SubmitHandler<AuthorData> = (values) => {
        const theAuthor = new Author({
            ...props.author,
            ...values,
        });
        if (adding && props.handleInsert) {
            props.handleInsert(theAuthor);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theAuthor);
        }
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        firstName: Yup.string()
            .nullable()                 // Groan -- Javascript thinks "" is falsy
            .required("First Name is required"),
        lastName: Yup.string()
            .nullable()                 // Groan -- Javascript thinks "" is falsy
            .required("Last Name is required")
            .test("unique-name",
                "That name is already in use within this Library",
                async function (this) {
                    return validateAuthorNameUnique(ToModel.AUTHOR(this.parent));
                }),
        notes: Yup.string()
            .nullable(),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<AuthorData>({
        defaultValues: new AuthorData(props.author),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    })

    return (

        <>

            {/* Details Form */}
            <Container id="AuthorDetails">

                <Row className="mb-3">
                    <Col className="text-start">
                        <CaretLeftSquare
                            data-testid="back"
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
                        &nbsp;Author for {props.parent._model}:&nbsp;
                        <span className="text-info">
                            {props.parent._title}
                        </span>
                        </strong>
                    </Col>
                    <Col className="text-end">
                    </Col>
                </Row>

                <Form
                    id="AuthorDetails"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <Row className="g-3 mb-3" id="firstNameLastNameRow">
                        <TextField
                            autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                            errors={errors}
                            label="First Name:"
                            name="firstName"
                            register={register}
                            valid="First name of this Author"
                        />
                        <TextField
                            errors={errors}
                            label="Last Name:"
                            name="lastName"
                            register={register}
                            valid="Last name of this Author (name must be unique within a Library)"
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

                    <Row className="g-3 mb-3" id="principalActiveRow">
                        {props.showPrincipal ? (
                            <CheckBoxField
                                errors={errors}
                                label="Principal Author?"
                                name="principal"
                                register={register}
                            />
                        ) : null }
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

export default AuthorForm;

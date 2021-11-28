// UserDetails ---------------------------------------------------------------

// Detail editing form for User objects.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Button from "react-bootstrap/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Internal Modules ----------------------------------------------------------

import TextField from "../general/TextField";
import {HandleAction, HandleUser} from "../../types";
import User from "../../models/User";
import {validateUserUsernameUnique} from "../../util/AsyncValidators";
import * as ToModel from "../../util/ToModel";
import {/*toEmptyStrings, */toNullValues} from "../../util/Transformations";

// Incoming Properties ------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleInsert?: HandleUser;          // Handle User insert request [not allowed]
    handleRemove?: HandleUser;          // Handle User remove request [not allowed]
    handleReturn: HandleAction;         // Handle return to options view
    handleUpdate?: HandleUser;          // Handle User update request [not allowed
    user: User;                         // Initial values (id < 0 for adding)
}

// Component Details ---------------------------------------------------------

class UserData {

    constructor (data: any = {}) {
        this.id = data.id ? data.id : -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.name = data.name ? data.name : null;
        this.password = data.password ? data.password : null;
        this.scope = data.scope ? data.scope : null;
        this.username = data.username ? data.username : null;
    }

    id: number;
    active: boolean;
    name: string;
    password: string;
    scope: string;
    username: string;

}

const UserDetails = (props: Props) => {

    const [adding] = useState<boolean>(props.user.id < 0);
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
            props.handleRemove(props.user)
        }
    }

    const onSubmit: SubmitHandler<UserData> = (values) => {
        const theUser = new User({
            ...props.user,
            ...values,
        });
        if (adding && props.handleInsert) {
            props.handleInsert(theUser);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theUser);
        }
    }

    // NOTE - there is no server-side equivalent for this because there is
    // not an individual logged-in user performing the request
    // TODO - needs LoginContext to provide validateScope() method
    const validateRequestedScope = (requested: string | undefined): boolean => {
        return true; // TODO
        /*
                if (!requested || ("" === requested)) {
                    return true;  // Not asking for scope but should be required
                } else {
                    // TODO - deal with log:<level> pseudo-scopes
                    return loginContext.validateScope(requested);
                }
        */
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        name: Yup.string()
            .required("Name is required"),
        password: Yup.string()
            .nullable(), // TODO - required on add, optional on edit
        scope: Yup.string()
            .required("Scope is required")
            .test("allowed-scope",
                "You are not allowed to assign a scope you do not possess",
                function(value) {
                    return validateRequestedScope(value);
                }),
        username: Yup.string()
            .required("Username is required")
            .test("unique-username",
                "That username is already in use",
                async function (this) {
                    return await validateUserUsernameUnique(ToModel.USER(toNullValues(this.parent)))
                }),
        });

    const {formState: {errors}, handleSubmit, register} = useForm<UserData>({
        defaultValues: new UserData(props.user),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (

        <>

            {/* Details Form */}
            <Container id="UserDetails">

                <Row className="mb-3 ms-1 me-1">
                    <Col className="text-center">
                        {(adding)? (
                            <span>Add New</span>
                        ) : (
                            <span>Edit Existing</span>
                        )}
                        &nbsp;User
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

                <Form
                    id="UserDetails"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <Row className="g-3 mb-3" id="nameScopeRow">

                        <TextField
                            autoFocus
                            errors={errors}
                            label="Name:"
                            name="name"
                            register={register}
                            valid="Name of this User."
                        />


{/*
                        <Form.Group as={Col} controlId="name" id="nameGroup">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                autoFocus={props.autoFocus ? props.autoFocus : undefined}
                                isInvalid={!!errors.name}
                                isValid={!errors.name}
                                {...register("name")}
                            />
                            <Form.Control.Feedback type="valid">
                                Name of this User.
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                {errors.name?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
*/}

                        <Form.Group as={Col} controlId="scope" id="scopeGroup">
                            <Form.Label>Scope:</Form.Label>
                            <Form.Control
                                isInvalid={!!errors.scope}
                                isValid={!errors.scope}
                                {...register("scope")}
                            />
                            <Form.Control.Feedback type="valid">
                                Scope(s) granted to this user.
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                {errors.scope?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                    </Row>

                    <Row className="g-3 mb-3" id="usernamePasswordRow">

                        <Form.Group as={Col} controlId="username" id="usernameGroup">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control
                                isInvalid={!!errors.username}
                                isValid={!errors.username}
                                {...register("username")}
                            />
                            <Form.Control.Feedback type="valid">
                                Login username of this User (must be unique).
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                {errors.username?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="password" id="passwordGroup">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                isInvalid={!!errors.password}
                                isValid={!errors.password}
                                {...register("password")}
                            />
                            <Form.Control.Feedback type="valid">
                                Login password of this User (set this ONLY on new Users or if you want to change the password for an existing User).
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                {errors.password?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="g-3 mb-3" id="activeRow">
                            <Form.Group as={Col} controlId="active" id="activeGroup">
                                <Form.Check
                                    feedback={errors.active}
                                    id="active"
                                    label="Active?"
                                    {...register("active")}
                                />
                            </Form.Group>
                        </Row>

                        <Row className="g-3 mb-3">
                            <Col className="text-start">
                                <Button
                                    disabled={!props.handleInsert && !props.handleUpdate}
                                    size="sm"
                                    type="submit"
                                    variant="primary"
                                >
                                    Save
                                </Button>
                            </Col>
                            <Col className="text-end">
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
                        Removing this User is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this User as inactive instead.</p>
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

export default UserDetails;

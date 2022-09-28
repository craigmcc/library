// UserForm ------------------------------------------------------------------

// Detail editing form for User objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {CaretLeftFill} from "react-bootstrap-icons";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {CheckBoxField, SelectField, SelectOption, TextField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import LibraryContext from "../libraries/LibraryContext";
import {HandleAction, HandleUser} from "../../types";
import User, {UserData} from "../../models/User";
import {validateUserUsernameLibraryUnique} from "../../util/AsyncValidators";
import logger from "../../util/ClientLogger";
import * as ToModel from "../../util/ToModel";
import {toNullValues} from "../../util/Transformations";

// Incoming Properties ------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleInsert?: HandleUser;          // Handle User insert request [not allowed]
    handleRemove?: HandleUser;          // Handle User remove request [not allowed]
    handleReturn: HandleAction;         // Handle return to previous view
    handleUpdate?: HandleUser;          // Handle User update request [not allowed]
    user: User;                         // Initial values (id < 0 for adding)
}

// Component Details ---------------------------------------------------------

interface Permission {
    admin: boolean;                     // Grant admin permission?
    regular: boolean;                   // Grant regular permission?
}

class UserDataExtended extends UserData {
    constructor(data: any = {}) {
        super(data);
        this.logLevel = data.logLevel ? data.logLevel : "info";
        this.permissions = [];
    }
    logLevel: string;                   // Preferred logging level
    permissions: Permission[];          // Permissions for available Libraries
}

const LOG_LEVEL_OPTIONS: SelectOption[] = [
    {label: "Trace", value: "trace"},
    {label: "Debug", value: "debug"},
    {label: "Info",  value: "info"},
    {label: "Warn",  value: "warn"},
    {label: "Error", value: "error"},
    {label: "Fatal", value: "fatal"},
];
const LOG_LEVEL_PREFIX = "log:"

const UserForm = (props: Props) => {

    const libraryContext = useContext(LibraryContext);

    const adding = (props.user.id < 0);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const calculateDefaultValues = (): UserDataExtended => {
        let defaultValues = new UserDataExtended(props.user);
        const alloweds = props.user.scope.split(" ");
        libraryContext.libraries.forEach(library => {
            defaultValues.permissions.push({
                admin: alloweds.includes(`${library.scope}:admin`),
                regular: alloweds.includes(`${library.scope}:regular`),
            });
        });
        alloweds.forEach(allowed => {
            if (allowed.startsWith(LOG_LEVEL_PREFIX)) {
                defaultValues.logLevel = allowed.substring(LOG_LEVEL_PREFIX.length);
            }
        })
        return defaultValues;
    }

    const calculateScope = (values: UserDataExtended): string => {
        const alloweds: string[] = [];
        libraryContext.libraries.forEach((library, li) => {
            if (values.permissions[li].admin) {
                alloweds.push(`${library.scope}:admin`);
            }
            if (values.permissions[li].regular) {
                alloweds.push(`${library.scope}:regular`);
            }
        });
        if (values.logLevel !== "") {
            alloweds.push(`${LOG_LEVEL_PREFIX}${values.logLevel}`);
        }
        return alloweds.join(" ");
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
            props.handleRemove(props.user)
        }
    }

    const onSubmit: SubmitHandler<UserDataExtended> = (values) => {
        values.scope = calculateScope(values);
        logger.debug({
            context: "UserForm.onSubmit",
            values: values,
        });
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
    const validateRequestedScope = (requested: string | undefined): boolean => {
        return true; // NOTE - must implement server side somehow
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        googleBooksApiKey: Yup.string()
            .nullable(),
        name: Yup.string()
            .required("Name is required"),
        password: Yup.string()
            .nullable(), // NOTE - required on add, optional on edit
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
                    return validateUserUsernameLibraryUnique(ToModel.USER(toNullValues(this.parent)), libraryContext.library)
                }),
        });

    const {formState: {errors}, handleSubmit, register} = useForm<UserDataExtended>({
        defaultValues: calculateDefaultValues(),
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (

        <>

            {/* Details Form */}
            <Container id="UserDetails">

                <Row className="mb-3">
                    <Col className="text-start">
                        <Button
                            aria-label="Back"
                            data-testid="back"
                            onClick={props.handleReturn}
                            variant="outline-dark"
                        >
                            <CaretLeftFill
                                onClick={props.handleReturn}
                                size={32}
                            />
                        </Button>
                    </Col>
                    <Col className="text-center">
                        <strong>
                        {(adding)? (
                            <span>Add New</span>
                        ) : (
                            <span>Edit Existing</span>
                        )}
                        &nbsp;User
                        </strong>
                    </Col>
                    <Col className="text-end">
                    </Col>
                </Row>

                <Form
                    id="UserDetails"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <Row className="g-3 mb-3" id="nameScopeRow">
                        <TextField
                            autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                            error={errors.name}
                            label="Name:"
                            name="name"
                            register={register}
                            valid="Name of this User."
                        />
                        <TextField
                            disabled={true}
                            error={errors.scope}
                            label="Scope:"
                            name="scope"
                            register={register}
                            valid="Space-separated scope(s) granted to this user."
                        />
                    </Row>

                    <Row className="g-3 mb-3" id="usernamePasswordRow">
                        <TextField
                            error={errors.username}
                            label="Username:"
                            name="username"
                            register={register}
                            valid="Login username of this User (must be unique)."
                        />
                        <TextField
                            error={errors.password}
                            label="Password:"
                            name="password"
                            register={register}
                            valid="Login password of this User (set this ONLY on new Users or if you want to change the password for an existing User)."
                        />
                    </Row>

                    <Row className="g-3 mb-3" id="googleBooksApiKeyActiveRow">
                        <TextField
                            error={errors.googleBooksApiKey}
                            label="Google Books API Key:"
                            name="googleBooksApiKey"
                            register={register}
                            valid="This User's API Key for Google Books (if any)."
                        />
                        <SelectField
                            className="col-3"
                            error={errors.logLevel}
                            header={{label: "(Default)", value: ""}}
                            label="Log Detail Level:"
                            name="logLevel"
                            options={LOG_LEVEL_OPTIONS}
                            register={register}
                        />
                        <CheckBoxField
                            className="col-3"
                            error={errors.active}
                            label="Active?"
                            name="active"
                            register={register}
                        />
                    </Row>

                    <Row className="g-3 mb-3">
                        <Table
                            bordered={true}
                            hover={true}
                            size="sm"
                            striped={true}
                        >
                            <thead>
                            <tr className="table-secondary">
                                <th>Library</th>
                                <th>Permissions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {libraryContext.libraries.map((library, li) => (
                                <tr key={li}>
                                    <td>{library.name}</td>
                                    <td>
                                        <CheckBoxField
                                            label="Admin"
                                            name={`permissions.${li}.admin`}
                                            register={register}
                                        />
                                        <CheckBoxField
                                            label="Regular"
                                            name={`permissions.${li}.regular`}
                                            register={register}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
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

export default UserForm;

// TextField -----------------------------------------------------------------

// Render a <Form.Group> element (from react-bootstrap) for a text input field
// that is processed by react-hook-form.  Field names MUST be unique within
// a single Form.

// External Modules ----------------------------------------------------------

import React, {ElementType} from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import {FieldErrors, UseFormRegister} from "react-hook-form";

// Internal Modules ----------------------------------------------------------

// Incoming Properties -------------------------------------------------------

export interface Props {
    as?: ElementType;                   // Render Form.Group as this component [Col]
    autoFocus?: boolean;                // This field to receive autoFocus? [false]
    className?: string;                 // CSS class(es) for the Form.Group [none]
    disabled?: boolean;                 // Disable this field? [false]
    errors: FieldErrors;                // errors object from useForm()
    label: string;                      // Field label [required]
    name: string;                       // Name of this field [required]
    readOnly?: boolean;                 // Mark field as read only? [false]
    register: UseFormRegister<any>;     // register object from useForm() // NOTE - <any> ???
    type?: "date" | "hidden" | "month" | "number" | "password" | "text" | "time";
                                        // Input field type [text]
    valid?: string;                     // Help message for valid input [none]
}

// Component Details ---------------------------------------------------------

const TextField = (props: Props) => {

    return (
        <Form.Group
            as={props.as ? props.as : Col}
            className={props.className ? props.className : undefined}
            controlId={props.name}
            id={props.name + "Group"}
        >
            <Form.Label>{props.label}</Form.Label>
            <Form.Control
                autoFocus={props.autoFocus ? props.autoFocus : undefined}
                disabled={(props.disabled !== undefined) ? props.disabled : undefined}
                isInvalid={!!props.errors[props.name]}
                isValid={!props.errors[props.name]}
                readOnly={(props.readOnly !== undefined) ? props.readOnly : undefined}
                type={props.type ? props.type : undefined}
                {...props.register(props.name)}
            />
            {(props.valid) ? (
                <Form.Control.Feedback type="valid">
                    {props.valid}
                </Form.Control.Feedback>
            ) : null }
            <Form.Control.Feedback type="invalid">
                {props.errors[props.name]?.message}
            </Form.Control.Feedback>
        </Form.Group>
    )

}

export default TextField;

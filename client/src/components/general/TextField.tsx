// TextField -----------------------------------------------------------------

// Render a <Form.Group> element (from react-bootstrap) for a text input field
// that is processed by react-hook-form.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import {FieldErrors, UseFormRegister} from "react-hook-form";


// Internal Modules ----------------------------------------------------------

// Incoming Properties -------------------------------------------------------

export interface Props {
//    as?: AsProp;                        // Render Form.Group as component [Col]
    autoFocus?: boolean;                // This field to receive autoFocus? [false]
    className?: string;                 // CSS classes for the group [none]
    errors: FieldErrors;                // errors object from useForm()
    label: string;                      // Field label [required]
    name: string;                       // Name of this field [required]
    register: UseFormRegister<any>;     // register object from useForm() // TODO - <any> ???
    valid?: string;                     // Help message for valid input [none]
}

// Component Details ---------------------------------------------------------

const TextField = (props: Props) => {

    return (
        <Form.Group
            as={Col} // TODO - figure out how to make this generic
            className={props.className ? props.className : undefined}
            controlId={props.name}
            id={props.name + "Group"}
        >
            <Form.Label>{props.label}</Form.Label>
            <Form.Control
                autoFocus={props.autoFocus ? props.autoFocus : undefined}
                isInvalid={!!props.errors[props.name]}
                isValid={!props.errors[props.name]}
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

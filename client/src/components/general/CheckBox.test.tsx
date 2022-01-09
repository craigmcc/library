import React from "react";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CheckBox from "./CheckBox";
import {HandleBoolean} from "../../types";

test("renders correctly with maximal properties", () => {

    const CHECKED = "checked";
    const LABEL = "My Label";
    const NAME = "myCheckbox";

    let lastValue = false; // Default should be not checked
    const handleChange: HandleBoolean = (theValue) => {
        lastValue = theValue;
    }
    render(<CheckBox
        autoFocus
        disabled
        handleChange={handleChange}
        label={LABEL}
        name={NAME}
        value={true}
    />);

    const inputElement = screen.getByLabelText(LABEL);
    expect(inputElement).toBeInTheDocument();
    // NOTE - console.log("inputElement", prettyDOM(inputElement));
    // NOTE - autoFocus is a Javascript thing
    expect(inputElement).toHaveAttribute(CHECKED);
    expect(inputElement).toHaveAttribute("disabled");
    expect(inputElement).toHaveAttribute("id", NAME);
    expect(inputElement).toHaveAttribute("type", "checkbox");

    // Cannot click on a disabled element, so do not check for that

});

test("renders correctly with minimal properties", () => {

    const CHECKED = "checked";
    const LABEL_TEXT = "My Label";
    let lastValue = false; // Default should be not checked
    const handleChange: HandleBoolean = (theValue) => {
        lastValue = theValue;
    }
    render(<CheckBox
        handleChange={handleChange}
        label={LABEL_TEXT}
    />);

    const inputElement = screen.getByLabelText(LABEL_TEXT);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).not.toHaveAttribute("autoFocus");
    expect(inputElement).not.toHaveAttribute(CHECKED);
    expect(inputElement).not.toHaveAttribute("disabled");
    expect(inputElement).toHaveAttribute("id", "checkBox"); // Default value
    expect(inputElement).toHaveAttribute("type", "checkbox");

    userEvent.click(inputElement);
    expect(inputElement).toHaveAttribute(CHECKED);
    userEvent.click(inputElement);
    expect(inputElement).not.toHaveAttribute(CHECKED);

});

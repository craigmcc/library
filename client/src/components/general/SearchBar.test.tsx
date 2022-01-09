import React from "react";
import {prettyDOM, render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SearchBar from "./SearchBar";
import {HandleValue} from "../../types";

test("renders correctly with maximal properties", () => {

    const HTML_SIZE=50;
    const LABEL = "My Label:";
    const NAME = "myName";
    const PLACEHOLDER="Enter search text here";
    const VALUE="value";

    let lastChange = "";
    const handleChange: HandleValue = (theChange) => {
        console.log("handleChange", theChange);
        lastChange = theChange;
    }
    let lastValue = "";
    const handleValue: HandleValue = (theValue) => {
        console.log("handleValue", theValue);
        lastValue = theValue;
    }

    render(<SearchBar
        autoFocus
        disabled
        handleChange={handleChange}
        handleValue={handleValue}
        htmlSize={HTML_SIZE}
        label={LABEL}
        name={NAME}
        placeholder={PLACEHOLDER}
    />);

    const inputElement = screen.getByLabelText(LABEL);
    expect(inputElement).toBeInTheDocument();
    console.log("inputElement", prettyDOM(inputElement));
    // NOTE - autoFocus is a Javascript thing
    expect(inputElement).toHaveAttribute("disabled");
    expect(inputElement).toHaveAttribute("id", NAME);
    expect(inputElement).toHaveAttribute("placeholder", PLACEHOLDER);
    expect(inputElement).toHaveAttribute("size", "" + HTML_SIZE);
    expect(inputElement).toHaveAttribute(VALUE, "");

    // TODO - figure out why typing does not trigger event handlers
    //userEvent.keyboard("abc{enter}");
    userEvent.type(inputElement,"abc{enter}");
    console.log("inputElement", prettyDOM(inputElement));

});

test("renders correctly with minimal properties", () => {

    const LABEL = "Search For:";    // Default value

    render(<SearchBar/>);

    const inputElement = screen.getByLabelText(LABEL);
    expect(inputElement).toBeInTheDocument();
    // console.log("inputElement", prettyDOM(inputElement));
    expect(inputElement).toHaveAttribute("id", "searchBar"); // Default value
    expect(inputElement).toHaveAttribute("value", "");

});

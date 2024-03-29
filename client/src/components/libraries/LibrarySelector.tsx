// LibrarySelector ----------------------------------------------------------

// Selector drop-down to choose which Library the user wants to interact with.
// NOTE: any change in the selection will be propagated to LibraryContext,
// as well as to any specified handleLibrary function.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import LibraryContext from "./LibraryContext";
import {HandleLibrary, OnChangeSelect} from "../../types";
import Library from "../../models/Library";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties ------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // Should element receive autoFocus? [false]
    disabled?: boolean;                 // Should element be disabled? [false]
    handleLibrary?: HandleLibrary;      // Handle Library selection [No handler]
    label?: string;                     // Element label [Library:]
    name?: string;                      // Input control name [librarySelector]
    placeholder?: string;               // Placeholder option text [(Select Library)]
}

// Component Details ---------------------------------------------------------

const LibrarySelector = (props: Props) => {

    const libraryContext = useContext(LibraryContext);

    const [index, setIndex] = useState<number>(-1);

    useEffect(() => {
        logger.debug({
            context: "LibrarySelector.useEffect",
            libraries: libraryContext.libraries,
        });
        // Special case for this selector
        let newIndex = -1;
        libraryContext.libraries.forEach((library, theIndex) => {
            if (library.id === libraryContext.library.id) {
                newIndex = theIndex;
            }
        });
        setIndex(newIndex);
    }, [libraryContext, libraryContext.libraries]);

    const onChange: OnChangeSelect = (event) => {
        const theIndex = parseInt(event.target.value, 10);
        const theLibrary = (theIndex >= 0) ? libraryContext.libraries[theIndex] : new Library();
        logger.trace({
            context: "LibrarySelector.onChange",
            index: theIndex,
            library: Abridgers.LIBRARY(theLibrary),
        });
        setIndex(theIndex);
        libraryContext.handleSelect(theLibrary);  // Special case for this selector
        if (props.handleLibrary) {
            props.handleLibrary(theLibrary);
        }
    }

    return (
        <div className="form-inline">
            <label className="me-2" htmlFor={props.name ? props.name : "library"}>
                {props.label ? props.label : "Library:"}
            </label>
            <select
                autoFocus={props.autoFocus ? props.autoFocus : undefined}
                className="form-control-sm"
                disabled={props.disabled ? props.disabled : undefined}
                id={props.name ? props.name : "library"}
                onChange={onChange}
                value={index}
            >
                <option key="-1" value="-1">{props.placeholder ? props.placeholder : "(Select Library)"}</option>
                {libraryContext.libraries.map((library, li) => (
                    <option key={li} value={li}>
                        {library.name}
                    </option>
                ))}
            </select>
        </div>
    )

}

export default LibrarySelector;

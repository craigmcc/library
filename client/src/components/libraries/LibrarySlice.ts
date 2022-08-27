// LibrarySlice --------------------------------------------------------------

// Redux Slice for Library objects.

// External Modules ----------------------------------------------------------

import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "../../Store";

// Internal Modules ----------------------------------------------------------

import Library from "../../models/Library";

// Private Objects -----------------------------------------------------------

const initialState: LibraryState = {
    libraries: [
        new Library({
            id: 1,
            active: true,
            name: "First Library",
            scope: "first",
        }),
        new Library({
            id: 2,
            active: true,
            name: "Second Library",
            notes: "Notes on Second Library",
            scope: "second",
        }),
        new Library({
            id: 3,
            active: true,
            name: "Third Library",
            scope: "third",
        }),
    ],
}

// Public Objects ------------------------------------------------------------

/**
 * Type definition for the State of this slice.
 */
interface LibraryState {
    libraries: Library[],
}

/**
 * Configure this slice.
 */
const LibrarySlice = createSlice({
    name: "libraries",
    initialState,
    reducers: {
    }
});

export default LibrarySlice;

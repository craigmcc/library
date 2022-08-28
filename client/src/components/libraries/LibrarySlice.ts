// LibrarySlice --------------------------------------------------------------

// Redux Slice for Library objects.

// External Modules ----------------------------------------------------------

import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// Internal Modules ----------------------------------------------------------

import Library from "../../models/Library";
import {RootState} from "../../Store";

// Private Objects -----------------------------------------------------------

const initialState: LibraryState = {
    data: [
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

// Type Definitions ----------------------------------------------------------

/**
 * Type definition for the State of this slice.
 */
interface LibraryState {
    data: Library[],
}

// Slice Configuration -------------------------------------------------------

const LibrarySlice = createSlice({
    name: "libraries",
    initialState,
    reducers: {
        insertLibrary: (state, action: PayloadAction<Library>) => {
            state.data.push(action.payload);
        },
    }
});

export default LibrarySlice;

// Selectors -----------------------------------------------------------------

export const selectLibraries = (state: RootState) =>
    state.libraries.data;

export const selectLibraryById = (state: RootState, libraryId: number) =>
    state.libraries.data.find(library => library.id === libraryId);

export const selectLibraryByName = (state: RootState, name: string) =>
    state.libraries.data.find(library => library.name === name);


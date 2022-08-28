// LibrarySlice --------------------------------------------------------------

// Redux Slice for Library objects.

// External Modules ----------------------------------------------------------

import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

// Internal Modules ----------------------------------------------------------

import {RootState} from "../../Store";
import Api from "../../clients/Api";
import Library, {LIBRARIES_BASE} from "../../models/Library";

// Private Objects -----------------------------------------------------------

const initialState: LibraryState = {
    data: [
/*
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
*/
    ],
    error: null,
    status: "idle",
}

// Type Definitions ----------------------------------------------------------

/**
 * Generic status of API slices.
 */
interface Status {
    error: string | null,
    status: "failed" | "idle" | "loading" | "succeeded",
}

/**
 * Type definition for the State of this slice.
 */
interface LibraryState extends Status {
    data: Library[],
}

// Thunks --------------------------------------------------------------------

export const allLibraries = createAsyncThunk("libraries/all", async () => {
    const url = LIBRARIES_BASE;         // TODO - query parameters
    const tryFetch = true;              // TODO - only if logged in
    if (tryFetch) {
        const theLibraries = (await Api.get<Library[]>(url)).data;
        return theLibraries;
    } else {
        return [];
    }

});

// Slice Configuration -------------------------------------------------------

const LibrarySlice = createSlice({
    name: "libraries",
    initialState,
    reducers: {
        libraryAdded: (state, action: PayloadAction<Library>) => {
            state.data.push(action.payload);
        },
        libraryRemoved: (state, action: PayloadAction<number>) => {
            state.data = state.data.filter(library => library.id !== action.payload);
        },
        libraryUpdated: (state, action: PayloadAction<Library>) => {
            const {id: libraryId} = action.payload;
            let existing = state.data.find(library => library.id === libraryId);
            if (existing) {
                existing = action.payload; // TODO - is this seen as a mutation?
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(allLibraries.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(allLibraries.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(allLibraries.rejected, (state, action) => {
                state.error = action.error.message ? action.error.message : null;
                state.status = "failed";
            });
    }
});

export default LibrarySlice;
export const { libraryAdded } = LibrarySlice.actions;

// Selectors -----------------------------------------------------------------

export const selectLibraries = (state: RootState) =>
    state.libraries.data;

export const selectLibraryById = (state: RootState, libraryId: number) =>
    state.libraries.data.find(library => library.id === libraryId);

export const selectLibraryByName = (state: RootState, name: string) =>
    state.libraries.data.find(library => library.name === name);

export const selectLibraryStatus = (state: RootState) => {
    return {
        error: state.libraries.error,
        status: state.libraries.status,
    } as Status;
}


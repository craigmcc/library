// LibrarySlice --------------------------------------------------------------

// Redux Slice for Library objects.

// External Modules ----------------------------------------------------------

import {createAsyncThunk, createSlice/*, PayloadAction*/} from "@reduxjs/toolkit";

// Internal Modules ----------------------------------------------------------

import {RootState} from "../../Store";
import {paginationParams} from "../../types";
import Api from "../../clients/Api";
import Library, {LIBRARIES_BASE} from "../../models/Library";
import {HttpError} from "../../util/HttpErrors";
import {queryParameters} from "../../util/QueryParameters";
import * as ToModel from "../../util/ToModel";

const SLICE_NAME = "libraries";

// Private Objects -----------------------------------------------------------

const initialState: LibraryState = {
    data: [],
    error: null,
    status: "idle",
}

// Type Definitions ----------------------------------------------------------

/**
 * Generic status of API slices.
 */
interface Status {
    error: Error | null,
    status: "executing" | "failed" | "idle" | "loading" | "succeeded",
}

/**
 * Type definition for the State of this slice.
 */
interface LibraryState extends Status {
    data: Library[],
}

// Parameter Types -----------------------------------------------------------

export interface allLibrariesParams
    extends includeLibraryParams, matchLibraryParams, paginationParams {
}

export interface exactLibraryParams {
    name: string;                       // Exact match on name
    params?: includeLibraryParams;      // Other parameters
}

export interface findLibraryParams {
    libraryId: number;                  // ID of the requested Library
    params?: includeLibraryParams;      // Other parameters
}

interface includeLibraryParams {
    withAuthors?: boolean;              // Include child Authors
    withSeries?: boolean;               // Include child Series
    withStories?: boolean;              // Include child Stories
    withVolumes?: boolean;              // Include child Volumes
}

interface matchLibraryParams {
    active?: boolean;                   // Select active Libraries
    name?: string;                      // Wildcard match on name
    scope?: string;                     // Exact match on scope
}

// Thunks --------------------------------------------------------------------

export const allLibraries = createAsyncThunk<
    Library[],                          // Success response type
    allLibrariesParams,                 // Argument type
    {
        rejectValue: HttpError,         // Error response type
    }
    >(
    `${SLICE_NAME}/all`,
    async (params: allLibrariesParams, thunkAPI) => {
        const url = `${LIBRARIES_BASE}${queryParameters(params)}`;
        const tryFetch = true;              // TODO - only if logged in
        if (tryFetch) {
            try {
                return ToModel.LIBRARIES((await Api.get<Library[]>(url)).data);
            } catch (error) {
                return thunkAPI.rejectWithValue(error as HttpError);
            }
        } else {
            return [];
        }
    });

export const exactLibrary = createAsyncThunk<
    Library,                            // Success response type
    exactLibraryParams,                 // Argument type
    {
        rejectValue: HttpError,         // Error response type
    }
    >(
    `${SLICE_NAME}/exact`,
    async (params: exactLibraryParams, thunkAPI) => {
        const url = `${LIBRARIES_BASE}/exact/${params.name}${queryParameters(params)}`;
        try {
            const library = ToModel.LIBRARY((await Api.get<Library>(url)).data);
            // TODO - cache this library by ID?
            return library;
        } catch (error) {
            return thunkAPI.rejectWithValue(error as HttpError);
        }
    });

export const findLibrary = createAsyncThunk<
    Library,                            // Success response type
    findLibraryParams,                  // Argument type
    {
        rejectValue: HttpError,         // Error response type
    }
    >(
    `${SLICE_NAME}/find`,
    async (params, thunkAPI) => {
        const url = `${LIBRARIES_BASE}/${params.libraryId}${queryParameters(params.params)}`;
        try {
            return ToModel.LIBRARY((await Api.get<Library>(url)).data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error as HttpError);
        }
    });

export const insertLibrary = createAsyncThunk<
    Library,                            // Success response type
    Library,                            // Argument type
    {
        rejectValue: HttpError;         // Error response type
    }
    >(
    `${SLICE_NAME}/insert`,
    async (library: Library, thunkAPI) => {
        const url = LIBRARIES_BASE;
        try {
            const inserted = ToModel.LIBRARY((await Api.post<Library>(url, library)).data);
            return inserted;
        } catch (error) {
            return thunkAPI.rejectWithValue(error as HttpError);
        }
    });

export const removeLibrary = createAsyncThunk<
    Library,                            // Success response type
    Library,                            // Argument type
    {
        rejectValue: HttpError,         // Error response type
    }
    >(
    `${SLICE_NAME}/remove`,
    async (library, thunkAPI) => {
        const url = `${LIBRARIES_BASE}/${library.id}`;
        try {
            return ToModel.LIBRARY((await Api.delete<Library>(url)).data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error as HttpError);
        }
    });

export const updateLibrary = createAsyncThunk<
    Library,                            // Success response type
    Partial<Library>,                   // Argument type
    {
        rejectValue: HttpError,         // Error response type
    }
    >(
    `${SLICE_NAME}/update`,
    async (library, thunkAPI) => {
        const url = `${LIBRARIES_BASE}/${library.id}`;
        try {
            return ToModel.LIBRARY((await Api.put<Library>(url, library)).data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error as HttpError);
        }
    });

// Slice Configuration -------------------------------------------------------

const LibrarySlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        /*
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
        */
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
                state.error = new Error(action.error.message!);
                state.status = "failed";
            })
            .addCase(insertLibrary.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            .addCase(removeLibrary.fulfilled, (state,action) => {
                state.data = state.data.filter(library => library.id !== action.payload.id);
            })
            .addCase(updateLibrary.fulfilled, (state, action) => {
                state.data = state.data.filter(library => library.id !== action.payload.id);
                state.data.push(action.payload);
            })
        ;
    },
});

export default LibrarySlice;
//export const { libraryAdded } = LibrarySlice.actions;

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


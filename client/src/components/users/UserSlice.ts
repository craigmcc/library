// UserSlice -----------------------------------------------------------------

// Redux Slice for User objects.

// External Modules ----------------------------------------------------------

import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

// Internal Modules ----------------------------------------------------------

import {RootState} from "../../Store";
import {LOGIN_DATA_KEY} from "../../constants";
import {LoginData, paginationParams} from "../../types";
import Api from "../../clients/Api";
import User, {USERS_BASE} from "../../models/User";
import {HttpError} from "../../util/HttpErrors";
import LocalStorage from "../../util/LocalStorage";
import {queryParameters} from "../../util/QueryParameters";
import * as ToModel from "../../util/ToModel";

const SLICE_NAME = "users";

// Private Objects -----------------------------------------------------------

const initialState: UserState = {
    data: [],
}

// Type Definitions ----------------------------------------------------------

/**
 * Type definition for the State of this slice.
 */
interface UserState {
    data: User[],
}

// Parameter Types -----------------------------------------------------------

export interface allUsersParams
    extends includeUserParams, matchUserParams, paginationParams {
}

export interface exactUserParams {
    username: string;                // Exact match on name
    params?: includeUserParams;      // Other parameters
}

export interface findUserParams {
    userId: number;                  // ID of the requested User
    params?: includeUserParams;      // Other parameters
}

interface includeUserParams {
}

interface matchUserParams {
    active?: boolean;                   // Select active Users
    username?: string;                  // Wildcard match on username
}

// Thunks --------------------------------------------------------------------

export const allUsers = createAsyncThunk<
    User[],                          // Success response type
    allUsersParams,                 // Argument type
    {
        rejectValue: HttpError,         // Error response type
    }
    >(
    `${SLICE_NAME}/all`,
    async (params: allUsersParams, thunkAPI) => {
        const loginData = new LocalStorage<LoginData>(LOGIN_DATA_KEY);
        const isSuperuser = loginData.value.alloweds?.includes("superuser");
        const url = `${USERS_BASE}${queryParameters(params)}`;
        const tryFetch = loginData.value.loggedIn && isSuperuser;
        if (tryFetch) {
            try {
                return ToModel.USERS((await Api.get<User[]>(url)).data);
            } catch (error) {
                return thunkAPI.rejectWithValue(error as HttpError);
            }
        } else {
            return [];
        }
    });

export const exactUser = createAsyncThunk<
    User,                            // Success response type
    exactUserParams,                 // Argument type
    {
        rejectValue: HttpError,         // Error response type
    }
    >(
    `${SLICE_NAME}/exact`,
    async (params: exactUserParams, thunkAPI) => {
        const url = `${USERS_BASE}/exact/${params.username}${queryParameters(params)}`;
        try {
            const user = ToModel.USER((await Api.get<User>(url)).data);
            // TODO - cache this user by ID?
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error as HttpError);
        }
    });

export const findUser = createAsyncThunk<
    User,                            // Success response type
    findUserParams,                  // Argument type
    {
        rejectValue: HttpError,         // Error response type
    }
    >(
    `${SLICE_NAME}/find`,
    async (params, thunkAPI) => {
        const url = `${USERS_BASE}/${params.userId}${queryParameters(params.params)}`;
        try {
            return ToModel.USER((await Api.get<User>(url)).data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error as HttpError);
        }
    });

export const insertUser = createAsyncThunk<
    User,                            // Success response type
    User,                            // Argument type
    {
        rejectValue: HttpError;         // Error response type
    }
    >(
    `${SLICE_NAME}/insert`,
    async (user: User, thunkAPI) => {
        const url = USERS_BASE;
        try {
            const inserted = ToModel.USER((await Api.post<User>(url, user)).data);
            return inserted;
        } catch (error) {
            return thunkAPI.rejectWithValue(error as HttpError);
        }
    });

export const removeUser = createAsyncThunk<
    User,                            // Success response type
    User,                            // Argument type
    {
        rejectValue: HttpError,         // Error response type
    }
    >(
    `${SLICE_NAME}/remove`,
    async (user, thunkAPI) => {
        const url = `${USERS_BASE}/${user.id}`;
        try {
            return ToModel.USER((await Api.delete<User>(url)).data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error as HttpError);
        }
    });

export const updateUser = createAsyncThunk<
    User,                            // Success response type
    Partial<User>,                   // Argument type
    {
        rejectValue: HttpError,         // Error response type
    }
    >(
    `${SLICE_NAME}/update`,
    async (user, thunkAPI) => {
        const url = `${USERS_BASE}/${user.id}`;
        try {
            return ToModel.USER((await Api.put<User>(url, user)).data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error as HttpError);
        }
    });

// Slice Configuration -------------------------------------------------------

const UserSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        /*
                userAdded: (state, action: PayloadAction<User>) => {
                    state.data.push(action.payload);
                },
                userRemoved: (state, action: PayloadAction<number>) => {
                    state.data = state.data.filter(user => user.id !== action.payload);
                },
                userUpdated: (state, action: PayloadAction<User>) => {
                    const {id: userId} = action.payload;
                    let existing = state.data.find(user => user.id === userId);
                    if (existing) {
                        existing = action.payload; // TODO - is this seen as a mutation?
                    }
                }
        */
    },
    extraReducers(builder) {
        builder
            .addCase(allUsers.fulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addCase(insertUser.fulfilled, (state, action) => {
                state.data.push(action.payload);
            })
            .addCase(removeUser.fulfilled, (state,action) => {
                state.data = state.data.filter(user => user.id !== action.payload.id);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.data = state.data.filter(user => user.id !== action.payload.id);
                state.data.push(action.payload);
            })
        ;
    },
});

export default UserSlice;
//export const { userAdded } = UserSlice.actions;

// Selectors -----------------------------------------------------------------

export const selectUsers = (state: RootState) =>
    state.users.data;

export const selectUserById = (state: RootState, userId: number) =>
    state.users.data.find(user => user.id === userId);

export const selectUserByUsername = (state: RootState, username: string) =>
    state.users.data.find(user => user.username === username);

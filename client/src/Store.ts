// Store ---------------------------------------------------------------------

// Global Redux store definition.

// External Modules ----------------------------------------------------------

import {configureStore, Action, ThunkAction} from "@reduxjs/toolkit";

// Internal Modules ----------------------------------------------------------

import LibrarySlice from "./components/libraries/LibrarySlice";
import UserSlice from "./components/users/UserSlice";

// Public Objects ------------------------------------------------------------

export const Store = configureStore({
    reducer: {
        [LibrarySlice.name]: LibrarySlice.reducer,
        [UserSlice.name]: UserSlice.reducer,
    },
});

export type AppDispatch = typeof Store.dispatch;
export type RootState = ReturnType<typeof Store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
    >;

export default Store;

// Store ---------------------------------------------------------------------

// Global Redux store definition.

// External Modules ----------------------------------------------------------

import {configureStore, Action, ThunkAction} from "@reduxjs/toolkit";

// Internal Modules ----------------------------------------------------------

import LibrarySlice from "./components/libraries/LibrarySlice";
import UserSlice from "./components/users/UserSlice";
import {VolumeApi} from "./components/volumes/VolumeApi";

// Public Objects ------------------------------------------------------------

export const Store = configureStore({
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(VolumeApi.middleware);
    },
    reducer: {
        [LibrarySlice.name]: LibrarySlice.reducer,
        [UserSlice.name]: UserSlice.reducer,
        [VolumeApi.reducerPath]: VolumeApi.reducer,
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

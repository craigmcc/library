// Hooks ---------------------------------------------------------------------

// Redux typed hooks for use in Typescript applications.

// External Modules ----------------------------------------------------------

import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

// Internal Modules ----------------------------------------------------------

import type {AppDispatch, RootState} from "./Store";

// Public Objects ------------------------------------------------------------

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

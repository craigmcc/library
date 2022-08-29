// LibraryContext ------------------------------------------------------------

// React Context containing the currently available Libraries, plus the
// current selected one.

// External Modules ----------------------------------------------------------

import React, {createContext, useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {allLibraries, allLibrariesParams, selectLibraries} from "./LibrarySlice";
import LoginContext from "../login/LoginContext";
import {LIBRARIES_KEY, LIBRARY_KEY} from "../../constants";
import {useAppDispatch, useAppSelector} from "../../Hooks";
import {HandleAction, HandleLibrary, Scope} from "../../types";
import useLocalStorage from "../../hooks/useLocalStorage";
import Library from "../../models/Library";
import * as Abridgers from "../../util/Abridgers";
import LocalStorage from "../../util/LocalStorage";
import logger from "../../util/ClientLogger";

// Context Properties --------------------------------------------------------

export interface State {
    libraries: Library[];               // Libraries available to this User
    library: Library;                   // Currently selected Library (dummy if id<0)
    handleRefresh: HandleAction;        // Trigger a refresh of available Libraries
    handleSelect: HandleLibrary;        // Select the currently referenced Library
}

export const LibraryContext = createContext<State>({
    libraries: [],
    library: new Library({name: "Never Selected"}),
    handleRefresh: () => {
        // Will be replaced in the real returned context information
    },
    handleSelect: () => {
        // Will be replaced in the real returned context information
    },
});

// Context Provider ----------------------------------------------------------

export const LibraryContextProvider = (props: any) => {

    const UNSELECTED = new Library({name: "(Please Select)"});

    const loginContext = useContext(LoginContext);
    const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);

    const libraries = new LocalStorage<Library[]>(LIBRARIES_KEY);
    const [library, setLibrary] = useLocalStorage<Library>(LIBRARY_KEY, UNSELECTED);
    const pageSize = 50;
    const [refresh, setRefresh] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const possibles = useAppSelector(selectLibraries)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
    const theLibraries: Library[] = [];
    possibles.forEach(possible => {
        if (loginContext.validateLibrary(possible, Scope.REGULAR)) {
            theLibraries.push(possible);
        }
    });
    libraries.value = theLibraries;

    useEffect(() => {

        logger.info({
            context: "LibraryContext.useEffect",
            isSuperuser: isSuperuser,
            refresh: refresh,
        })

        try {
            const params: allLibrariesParams = {
                active: isSuperuser ? undefined : true,
                limit: pageSize,
                offset: 0,
            }
            dispatch(allLibraries(params));
        } catch (error) {
            alert(`Error fetching Libraries: ${(error as Error).message}`);
        }
        setRefresh(false);

    }, [loginContext, loginContext.data.loggedIn,
        refresh,
        dispatch, isSuperuser]);


    /**
     * Handle a request to refresh the list of available Libraries.
     */
    const handleRefresh: HandleAction = () => {
        logger.debug({
            context: "LibraryContext.handleRefresh",
        });
        setRefresh(true);
    }

    /**
     * Handle a request to select the specified Library.
     *
     * @param theLibrary                The Library to be selected
     */
    const handleSelect: HandleLibrary = (theLibrary) => {
        logger.debug({
            context: "LibraryContext.handleSelect",
            library: Abridgers.LIBRARY(theLibrary),
        });
        if (theLibrary.id < 0) {
            setLibrary(UNSELECTED);
            return;
        }
        let found = false;
        // @ts-ignore
        libraries.value.forEach(aLibrary => {
            if (theLibrary.id === aLibrary.id) {
                setLibrary(aLibrary);
                found = true;
            }
        });
        if (found) {
            return;
        }
        logger.error({
            context: "LibraryContext.handleSelect",
            msg: "Attempt to select unavailable Library is denied",
            library: theLibrary,
        });
        setLibrary(UNSELECTED);
    }

    const libraryContext: State = {
        libraries: libraries.value,
        library: library,
        handleRefresh: handleRefresh,
        handleSelect: handleSelect,
    }

    return (
        <LibraryContext.Provider value={libraryContext}>
            {props.children}
        </LibraryContext.Provider>
    )

};

export default LibraryContext;

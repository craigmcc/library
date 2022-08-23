// LibraryContext ------------------------------------------------------------

// React Context containing the currently available Libraries, plus the
// current selected one.

// External Modules ----------------------------------------------------------

import React, {createContext, useContext, useEffect, useMemo, useState} from "react";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../login/LoginContext";
import {LIBRARIES_KEY, LIBRARY_KEY} from "../../constants";
import {HandleAction, HandleLibrary} from "../../types";
import useFetchLibraries from "../../hooks/useFetchLibraries";
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

    const [active, setActive] = useState<boolean>(true);
    const [library, setLibrary] = useLocalStorage<Library>(LIBRARY_KEY, UNSELECTED);

    /**
     * API interface for fetching all possible Libraries.
     */
    const fetchLibraries = useFetchLibraries({
        active: active,
        currentPage: 1,
        pageSize: 100,
    });

    /**
     * The list of Libraries available to the logged in User.
     */
    const libraries = useMemo(() => {
        const theLibraries: Library[] = [];
        fetchLibraries.libraries.forEach(library => {
            if (loginContext.validateLibrary(library)) {
                theLibraries.push(library);
            }
        });
        logger.debug({
            context: "LibraryContext.calculateLibraries",
            librariesIn: fetchLibraries.libraries,
            librariesOut: theLibraries,
        })
        return theLibraries;
    }, [loginContext, fetchLibraries.libraries]);

    /**
     * Local Storage interface for persisting available Libraries
     */
    const availables = useMemo(() => {
        return new LocalStorage<Library[]>(LIBRARIES_KEY);
    }, []);

    /**
     * Persist the list of available Libraries whenever it changes.
     */
    useEffect(() => {
        availables.value = libraries;
    }, [availables, libraries]);

    /**
     * Handle a request to refresh the list of available Libraries.
     */
    const handleRefresh: HandleAction = () => {
        logger.debug({
            context: "LibraryContext.handleRefresh",
        });
        // Trigger useFetchLibraries to fetch again
        setActive(false);
        setActive(true);
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
        libraries.forEach(aLibrary => {
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
        libraries: libraries,
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

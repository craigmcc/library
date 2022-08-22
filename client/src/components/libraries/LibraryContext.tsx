// LibraryContext ------------------------------------------------------------

// React Context containing the currently available Libraries, plus the
// current selected one.

// External Modules ----------------------------------------------------------

import React, {createContext, useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import LoginContext from "../login/LoginContext";
import {LIBRARIES_KEY, LIBRARY_KEY} from "../../constants";
import {HandleAction, HandleLibrary} from "../../types";
import useFetchLibraries from "../../hooks/useFetchLibraries";
import useLocalStorage from "../../hooks/useLocalStorage";
import Library from "../../models/Library";
import * as Abridgers from "../../util/Abridgers";
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
    const [availables, setAvailables] = useLocalStorage<Library[]>(LIBRARIES_KEY, []);
    const [library, setLibrary] = useLocalStorage<Library>(LIBRARY_KEY, UNSELECTED);

    const fetchLibraries = useFetchLibraries({
        active: active,
        currentPage: 1,
        pageSize: 100,
    });

    useEffect(() => {

        // Offer only those Libraries available to the logged in User
        const theAvailables: Library[] = [];
        if (loginContext.data.loggedIn) {
            fetchLibraries.libraries.forEach(theAvailable => {
                if (loginContext.validateLibrary(theAvailable)) {
                    theAvailables.push(theAvailable);
                }
            });
        }
        logger.debug({
            context: "LibraryContext.useEffect",
            loggedIn: loginContext.data.loggedIn,
            libraries: Abridgers.LIBRARIES(fetchLibraries.libraries),
            availables: Abridgers.LIBRARIES(theAvailables),
        });
        setAvailables(theAvailables);

        // Select or reselect the appropriate Library
        if (theAvailables.length === 1) {
            logger.debug({
                context: "FacilityContext.useEffect",
                msg: "Autoselect the only available Library",
                library: Abridgers.LIBRARY(theAvailables[0]),
            });
            setLibrary(theAvailables[0]);
        } else if (library.id > 0) {
            let found: Library = new Library({id: -1, name: "NOT SELECTED"});
            theAvailables.forEach(option => {
                if (library.id === option.id) {
                    found = option;
                }
            });
            logger.debug({
                context: "LibraryContext.useEffect",
                msg: "Reset to currently selected Library",
                library: Abridgers.LIBRARY(found),
            });
            setLibrary(found);
        }

    }, [active, library.id, fetchLibraries.libraries,
        loginContext, loginContext.data.loggedIn]);

    const handleRefresh: HandleAction = () => {
        logger.debug({
            context: "LibraryContext.handleRefresh",
        });
        // Trigger useFetchFacilities to fetch again
        setActive(false);
        setActive(true);
    }

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
        availables.forEach(aLibrary => {
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
        libraries: availables,
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

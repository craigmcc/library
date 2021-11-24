// LibrarySegment ------------------------------------------------------------

// Consolidated segment for listing and editing Library objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import LibraryContext from "./LibraryContext";
import LibraryDetails from "./LibraryDetails";
import LibraryOptions from "./LibraryOptions";
import SavingProgress from "../general/SavingProgress";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleLibrary, Scope} from "../../types";
import useMutateLibrary from "../../hooks/useMutateLibrary";
import Library from "../../models/Library";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

enum View {
    DETAILS = "Details",
    OPTIONS = "Options",
}

const LibrarySegment = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [library, setLibrary] = useState<Library>(new Library());
    const [title, setTitle] = useState<string>("");
    const [view, setView] = useState<View>(View.OPTIONS);

    const mutateLibrary = useMutateLibrary({
        alertPopup: false,
    });

    useEffect(() => {

        logger.info({
            context: "LibrarySegment.useEffect",
            library: Abridgers.LIBRARY(library),
            view: view.toString(),
        });

        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isSuperuser);

    }, [loginContext, loginContext.data.loggedIn,
        library, view]);

    // Create an empty Library to be added
    const handleAdd: HandleAction = () => {
        const theLibrary = new Library({
            active: true,
            name: null,
            notes: null,
            scope: null,
        });
        logger.info({
            context: "LibrarySegment.handleAdd",
            library: theLibrary,
        });
        setLibrary(theLibrary);
        setView(View.DETAILS);
    }

    // Handle selection of a Library to edit details
    const handleEdit: HandleLibrary = (theLibrary) => {
        logger.info({
            context: "LibrarySegment.handleEdit",
            library: Abridgers.LIBRARY(theLibrary),
        });
        setLibrary(theLibrary);
        setView(View.DETAILS);
    }

    // Handle insert of a new Library
    const handleInsert: HandleLibrary = async (theLibrary) => {
        logger.info({
            context: "LibrarySegment.handleInsert",
            library: Abridgers.LIBRARY(theLibrary),
        });
        setTitle(theLibrary._title);
        /* const inserted = */ await mutateLibrary.insert(theLibrary);
        setView(View.OPTIONS);
        libraryContext.handleRefresh();
    }

    // Handle remove of an existing Library
    const handleRemove: HandleLibrary = async (theLibrary) => {
        logger.info({
            context: "LibrarySegment.handleRemove",
            library: theLibrary,
        });
        setTitle(theLibrary._title);
        /* const removed = */ await mutateLibrary.remove(theLibrary);
        setView(View.OPTIONS);
        libraryContext.handleRefresh();
    }

    // Handle return from View.DETAILS to redisplay View.OPTIONS
    const handleReturn: HandleAction = () => {
        logger.info({
            context: "LibrarySegment.handleReturn",
        });
        setView(View.OPTIONS);
    }

    // Handle request to update an existing Library
    const handleUpdate: HandleLibrary = async (theLibrary) => {
        logger.info({
            context: "LibrarySegment.handleUpdate",
            library: Abridgers.LIBRARY(theLibrary),
        });
        setTitle(theLibrary._title);
        /* const updated = */ await mutateLibrary.update(theLibrary);
        setView(View.OPTIONS);
    }

    return (
        <>

            <SavingProgress
                error={mutateLibrary.error}
                executing={mutateLibrary.executing}
                title={title}
            />
            {(view === View.DETAILS) ? (
                <LibraryDetails
                    autoFocus
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleReturn={handleReturn}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    library={library}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <LibraryOptions
                    handleAdd={handleAdd}
                    handleEdit={handleEdit}
                />
            ) : null }

        </>
    )

}

export default LibrarySegment;

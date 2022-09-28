// LibrarySegment ------------------------------------------------------------

// Consolidated view for listing and editing Library objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import LibraryContext from "./LibraryContext";
import LibraryForm from "./LibraryForm";
import LibraryList from "./LibraryList";
import LoginContext from "../login/LoginContext";
import MutatingProgress from "../shared/MutatingProgress";
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

const LibraryView = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [library, setLibrary] = useState<Library>(new Library());
    const [message, setMessage] = useState<string>("");
    const [view, setView] = useState<View>(View.OPTIONS);

    const mutateLibrary = useMutateLibrary({
        alertPopup: false,
    });

    useEffect(() => {

        logger.debug({
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
        logger.debug({
            context: "LibrarySegment.handleAdd",
            library: theLibrary,
        });
        setLibrary(theLibrary);
        setView(View.DETAILS);
    }

    // Handle selection of a Library to edit details
    const handleEdit: HandleLibrary = (theLibrary) => {
        logger.debug({
            context: "LibrarySegment.handleEdit",
            library: Abridgers.LIBRARY(theLibrary),
        });
        setLibrary(theLibrary);
        setView(View.DETAILS);
    }

    // Handle insert of a new Library
    const handleInsert: HandleLibrary = async (theLibrary) => {
        setMessage(`Inserting Library '${theLibrary._title}'`);
        const inserted = await mutateLibrary.insert(theLibrary);
        logger.debug({
            context: "LibrarySegment.handleInsert",
            library: Abridgers.LIBRARY(inserted),
        });
        setView(View.OPTIONS);
        libraryContext.handleRefresh();
    }

    // Handle remove of an existing Library
    const handleRemove: HandleLibrary = async (theLibrary) => {
        setMessage(`Removing Library '${theLibrary._title}'`);
        const removed = await mutateLibrary.remove(theLibrary);
        logger.debug({
            context: "LibrarySegment.handleRemove",
            library: Abridgers.LIBRARY(removed),
        });
        setView(View.OPTIONS);
        libraryContext.handleRefresh();
    }

    // Handle return from View.DETAILS to redisplay View.OPTIONS
    const handleReturn: HandleAction = () => {
        logger.debug({
            context: "LibrarySegment.handleReturn",
        });
        setView(View.OPTIONS);
    }

    // Handle request to update an existing Library
    const handleUpdate: HandleLibrary = async (theLibrary) => {
        setMessage(`Updating Library '${theLibrary._title}'`);
        const updated = await mutateLibrary.update(theLibrary);
        logger.debug({
            context: "LibrarySegment.handleUpdate",
            library: Abridgers.LIBRARY(updated),
        });
        setView(View.OPTIONS);
        libraryContext.handleRefresh();
    }

    return (
        <>

            <MutatingProgress
                error={mutateLibrary.error}
                executing={mutateLibrary.executing}
                message={message}
            />

            {(view === View.DETAILS) ? (
                <LibraryForm
                    autoFocus
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleReturn={handleReturn}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    library={library}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <LibraryList
                    handleAdd={canInsert ? handleAdd : undefined}
                    handleEdit={handleEdit}
                />
            ) : null }

        </>
    )

}

export default LibraryView;

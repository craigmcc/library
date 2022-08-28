// LibrarySegment ------------------------------------------------------------

// Consolidated view for listing and editing Library objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import LibraryContext from "./LibraryContext";
import LibraryForm from "./LibraryForm";
import LibraryList from "./LibraryList";
import {insertLibrary, removeLibrary, updateLibrary} from "./LibrarySlice";
import LoginContext from "../login/LoginContext";
import MutatingProgress from "../shared/MutatingProgress";
import {useAppDispatch} from "../../Hooks";
import {HandleAction, HandleLibrary, Scope} from "../../types";
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
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);
    const [library, setLibrary] = useState<Library>(new Library());
    const [message, setMessage] = useState<string>("");
    const [view, setView] = useState<View>(View.OPTIONS);

    const dispatch = useAppDispatch();

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
        try {
            setExecuting(true);
            setMessage(`Inserting Library '${theLibrary._title}'`);
            await dispatch(insertLibrary(theLibrary));
        } catch (error) {
            setError(error as Error);
        } finally {
            setExecuting(false);
            setView(View.OPTIONS);
            libraryContext.handleRefresh();
        }
    }

    // Handle remove of an existing Library
    const handleRemove: HandleLibrary = async (theLibrary) => {
        try {
            setExecuting(true);
            setMessage(`Removing Library '${theLibrary._title}'`);
            await dispatch(removeLibrary(theLibrary));
        } catch (error) {
            setError(error as Error);
        } finally {
            setExecuting(false);
            setView(View.OPTIONS);
            libraryContext.handleRefresh();
        }
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
        try {
            setExecuting(true);
            setMessage(`Updating Library '${theLibrary._title}'`);
            await dispatch(updateLibrary(theLibrary));
        } catch (error) {
            setError(error as Error);
        } finally {
            setExecuting(false);
            setView(View.OPTIONS);
            libraryContext.handleRefresh();
        }
    }

    return (
        <>

            <MutatingProgress
                error={error}
                executing={executing}
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
                    handleAdd={handleAdd}
                    handleEdit={handleEdit}
                />
            ) : null }

        </>
    )

}

export default LibraryView;

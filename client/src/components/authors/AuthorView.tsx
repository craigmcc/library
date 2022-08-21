// AuthorView -------------------------------------------------------------===

// Consolidated view for listing and editing Author objects, as well as
// navigating to views for related child objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import AuthorForm from "./AuthorForm";
import AuthorList from "./AuthorList";
import SeriesView from "../series/SeriesView";
import MutatingProgress from "../shared/MutatingProgress";
import StorySegment from "../stories/StorySegment";
import VolumeSegment from "../volumes/VolumeSegment";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleAuthor, Parent, Scope} from "../../types";
import useMutateAuthor from "../../hooks/useMutateAuthor";
import Author from "../../models/Author";
import Library from "../../models/Library";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties ------------------------------------------------------

export interface Props {
    handleReturn?: HandleAction;        // Handle request to exit this segment [no handler]
    parent?: Parent;                    // Current object from parent segment [owning Library]
}

// Component Details --------------------------------------------------------

enum View {
    DETAILS = "Details",
    OPTIONS = "Options",
    SERIES = "Series",
    STORIES = "Stories",
    VOLUMES = "Volumes",
}

const AuthorView = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [author, setAuthor] = useState<Author>(new Author());
    const [message, setMessage] = useState<string>("");
    const [view, setView] = useState<View>(View.OPTIONS);

    const mutateAuthor = useMutateAuthor({
        alertPopup: false,
    });

    useEffect(() => {
        logger.debug({
            context: "AuthorSegment.useEffect",
            library: libraryContext.library.id > 0 ? Abridgers.LIBRARY(libraryContext.library) : undefined,
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            author: author ? Abridgers.AUTHOR(author): undefined,
            view: view.toString(),
        });
        const isAdmin = loginContext.validateLibrary(libraryContext.library, Scope.ADMIN);
        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isAdmin || isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isAdmin || isSuperuser);
    }, [props.parent,
        libraryContext.library, libraryContext.library.id,
        loginContext, loginContext.data.loggedIn,
        author, view]);

    // Create an empty Author to be added
    const handleAdd: HandleAction = () => {
        const theAuthor = new Author({
            id: -1,
            active: true,
            firstName: null,
            lastName: null,
            libraryId: libraryContext.library.id,
            notes: null,
        });
        logger.debug({
            context: "AuthorSegment.handleAdd",
            author: theAuthor,
        });
        setAuthor(theAuthor);
        setView(View.DETAILS);
    }

    // Handle selection of an Author to edit details
    const handleEdit: HandleAuthor = (theAuthor) => {
        logger.debug({
            context: "AuthorSegment.handleEdit",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthor(theAuthor);
        setView(View.DETAILS);
    }

    // Handle excluding an Author from its parent
    const handleExclude: HandleAuthor = async (theAuthor) => {
        logger.debug({
            context: "AuthorSegment.handleExclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            author: Abridgers.AUTHOR(theAuthor),
        });
        if (props.parent) {
            if (!(props.parent instanceof Library)) {
                setMessage(`Excluding Author '${theAuthor._title}'`);
                /* const excluded = */ await mutateAuthor.exclude(theAuthor, props.parent);
            }
        }
    }

    // Handle including a Author into its Ancestor
    const handleInclude: HandleAuthor = async (theAuthor) => {
        logger.debug({
            context: "AuthorSegment.handleInclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            author: Abridgers.AUTHOR(theAuthor),
        });
        if (props.parent) {
            if (!(props.parent instanceof Library)) {
                setMessage(`Including Author '${theAuthor._title}'`);
                /* const included = */ await mutateAuthor.include(theAuthor, props.parent);
            }
        }
    }

    // Handle insert of a new Author
    const handleInsert: HandleAuthor = async (theAuthor) => {
        setMessage(`Inserting Author '${theAuthor._title}'`);
        const inserted = await mutateAuthor.insert(theAuthor);
        logger.debug({
            context: "AuthorSegment.handleInsert",
            author: Abridgers.AUTHOR(inserted),
        });
        if (theAuthor.principal !== undefined) {
            inserted.principal = theAuthor.principal;
        }
        handleInclude(inserted);
        setView(View.OPTIONS);
    }

    // Handle remove of an existing Author
    const handleRemove: HandleAuthor = async (theAuthor) => {
        setMessage(`Removing Author '${theAuthor._title}'`);
        const removed = await mutateAuthor.remove(theAuthor);
        logger.debug({
            context: "AuthorSegment.handleRemove",
            author: Abridgers.AUTHOR(removed),
        });
        setView(View.OPTIONS);
    }

    // Handle return from View.DETAILS to redisplay View.OPTIONS
    const handleReturn: HandleAction = () => {
        logger.debug({
            context: "AuthorSegment.handleReturn",
        });
        setView(View.OPTIONS);
    }

    // Handle request to show SeriesSegment for a parent Author
    const handleShowSeries: HandleAuthor = (theAuthor) => {
        logger.debug({
            context: "AuthorSegment.handleShowSeries",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthor(theAuthor);
        setView(View.SERIES);
    }

    // Handle request to show StorySegment for a parent Author
    const handleShowStories: HandleAuthor = (theAuthor) => {
        logger.debug({
            context: "AuthorSegment.handleShowStories",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthor(theAuthor);
        setView(View.STORIES);
    }

    // Handle request to show VolumeSegment for a parent Author
    const handleShowVolumes: HandleAuthor = (theAuthor) => {
        logger.debug({
            context: "AuthorSegment.handleShowVolumes",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthor(theAuthor);
        setView(View.VOLUMES);
    }

    // Handle update of an existing Author
    const handleUpdate: HandleAuthor = async (theAuthor) => {
        setMessage(`Updating Author '${theAuthor._title}'`);
        const updated = await mutateAuthor.update(theAuthor);
        logger.debug({
            context: "AuthorSegment.handleUpdate",
            author: Abridgers.AUTHOR(updated),
        });
        setView(View.OPTIONS);
    }

    return (
        <>

            <MutatingProgress
                error={mutateAuthor.error}
                executing={mutateAuthor.executing}
                message={message}
            />

            {(view === View.DETAILS) ? (
                <AuthorForm
                    author={author}
                    autoFocus
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleReturn={handleReturn}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    parent={props.parent ? props.parent : libraryContext.library}
                    showPrincipal={props.parent && !(props.parent instanceof Library)}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <AuthorList
                    handleAdd={handleAdd}
                    handleEdit={handleEdit}
                    handleExclude={props.parent && !(props.parent instanceof Library) && canUpdate ? handleExclude : undefined}
                    handleInclude={props.parent && !(props.parent instanceof Library) && canUpdate? handleInclude : undefined}
                    handleReturn={props.handleReturn ? props.handleReturn : undefined}
                    handleShowSeries={handleShowSeries}
                    handleShowStories={handleShowStories}
                    handleShowVolumes={handleShowVolumes}
                    parent={props.parent ? props.parent : libraryContext.library}
                    showPrincipal={props.parent && !(props.parent instanceof Library)}
                />
            ) : null }

            {(view === View.SERIES) ? (
                <SeriesView
                    handleReturn={handleReturn}
                    parent={author}
                />
            ) : null }

            {(view === View.STORIES) ? (
                <StorySegment
                    handleReturn={handleReturn}
                    parent={author}
                />
            ) : null }

            {(view === View.VOLUMES) ? (
                <VolumeSegment
                    handleReturn={handleReturn}
                    parent={author}
                />
            ) : null }

        </>
    )

}

export default AuthorView;

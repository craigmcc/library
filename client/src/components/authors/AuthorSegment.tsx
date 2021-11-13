// AuthorSegment -------------------------------------------------------------

// Consolidated segment for listing and editing Author objects, as well as
// navigating to segments for related child objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import AuthorDetails from "./AuthorDetails";
import AuthorOptions from "./AuthorOptions";
import SeriesSegment from "../series/SeriesSegment";
//import StorySegment from "../stories/StorySegment";
//import VolumeSegment from "../volumes/VolumeSegment";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleAuthor, Parent, Scope} from "../../types";
import useMutateAuthor from "../../hooks/useMutateAuthor";
import Author from "../../models/Author";
import Library from "../../models/Library";
import Series from "../../models/Series";
import Volume from "../../models/Volume";
import Story from "../../models/Story";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties ------------------------------------------------------

export interface Props {
    handleBack?: HandleAction;          // Handle request to exit this segment [no handler]
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

const AuthorSegment = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [author, setAuthor] = useState<Author>(new Author());
    const [view, setView] = useState<View>(View.OPTIONS);

    const mutateAuthor = useMutateAuthor({});

    useEffect(() => {
        logger.info({
            context: "AuthorSegment.useEffect",
            library: libraryContext.library.id > 0 ? Abridgers.LIBRARY(libraryContext.library) : undefined,
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            author: author ? Abridgers.AUTHOR(author): undefined,
        });
        const isAdmin = loginContext.validateLibrary(libraryContext.library, Scope.ADMIN);
        // const isRegular = loginContext.validateLibrary(libraryContext.library, Scope.REGULAR);
        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isAdmin || isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isAdmin || isSuperuser);
    }, [props.parent,
        libraryContext.library, libraryContext.library.id,
        loginContext, loginContext.data.loggedIn,
        author]);

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
        logger.info({
            context: "AuthorSegment.handleAdd",
            author: theAuthor,
        });
        setAuthor(theAuthor);
        setView(View.DETAILS);
    }

    // Go back to the ancestor parent, if any
    const handleBack: HandleAction = () => {
        logger.info({
            context: "AuthorSegment.handleBack"
        });
        setView(View.OPTIONS);
        if (props.handleBack) {
            props.handleBack();
        }
    }

    // Handle selection of an Author to edit details
    const handleEdit: HandleAuthor = (theAuthor) => {
        logger.info({
            context: "AuthorSegment.handleEdit",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthor(theAuthor);
        setView(View.DETAILS);
    }

    // Handle excluding an Author from its parent
    const handleExclude: HandleAuthor = async (theAuthor) => {
        logger.info({
            context: "AuthorSegment.handleExclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            author: Abridgers.AUTHOR(theAuthor),
        });
        if (props.parent) {
            if (!(props.parent instanceof Library)) {
                /* const excluded = */ await mutateAuthor.exclude(theAuthor, props.parent);
            }
            // TODO - refresh parent???
        }
    }

    // Handle including a Author into its Ancestor
    const handleInclude: HandleAuthor = async (theAuthor) => {
        logger.info({
            context: "AuthorSegment.handleInclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            author: Abridgers.AUTHOR(theAuthor),
        });
        if (props.parent) {
            if (!(props.parent instanceof Library)) {
                /* const included = */ await mutateAuthor.include(theAuthor, props.parent);
            }
            // TODO - refresh parent???
        }
    }

    // Handle insert of a new Author
    const handleInsert: HandleAuthor = async (theAuthor) => {
        logger.info({
            context: "AuthorSegment.handleInsert",
            author: Abridgers.AUTHOR(theAuthor),
        });
        const inserted = await mutateAuthor.insert(theAuthor);
        handleInclude(inserted);
        setView(View.OPTIONS);
    }

    // Handle remove of an existing Author
    const handleRemove: HandleAuthor = async (theAuthor) => {
        logger.info({
            context: "AuthorSegment.handleRemove",
            author: Abridgers.AUTHOR(theAuthor),
        });
        /* const removed = */ await mutateAuthor.remove(theAuthor);
        setView(View.OPTIONS);
    }

    // Handle return from View.DETAILS to redisplay View.OPTIONS
    const handleReturn: HandleAction = () => {
        logger.info({
            context: "AuthorSegment.handleReturn",
        });
        setView(View.OPTIONS);
    }

    // Handle request to show SeriesSegment for a parent Author
    const handleShowSeries: HandleAuthor = (theAuthor) => {
        logger.info({
            context: "AuthorSegment.handleShowSeries",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthor(theAuthor);
        setView(View.SERIES);
    }

    // Handle request to show StorySegment for a parent Author
    const handleShowStories: HandleAuthor = (theAuthor) => {
        logger.info({
            context: "AuthorSegment.handleShowStories",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthor(theAuthor);
        setView(View.STORIES);
    }

    // Handle request to show VolumeSegment for a parent Author
    const handleShowVolumes: HandleAuthor = (theAuthor) => {
        logger.info({
            context: "AuthorSegment.handleShowVolumes",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthor(theAuthor);
        setView(View.VOLUMES);
    }

    // Handle update of an existing Author
    const handleUpdate: HandleAuthor = async (theAuthor) => {
        logger.info({
            context: "AuthorSegment.handleUpdate",
            author: Abridgers.AUTHOR(theAuthor),
        });
        /* const updated = */ await mutateAuthor.update(theAuthor);
        setView(View.OPTIONS);
    }

    // Is this Author included in its parent?
    const included = (theAuthor: Author): boolean => {
        let result = false;
        if (!props.parent || (props.parent instanceof Library)) {
            result = true;
        } else if ((props.parent instanceof Series)
            || (props.parent instanceof Story)
            || (props.parent instanceof Volume)) {
            if (props.parent.authors) {
                props.parent.authors.forEach(author => {
                    if (theAuthor.id === author.id) {
                        result = true;
                    }
                })
            }
        }
        return result;
    }

    return (
        <>

            {(view === View.DETAILS) ? (
                <AuthorDetails
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
                <AuthorOptions
                    handleAdd={handleAdd}
                    handleBack={props.handleBack ? handleBack : undefined}
                    handleEdit={handleEdit}
                    handleExclude={props.parent && !(props.parent instanceof Library) ? handleExclude : undefined}
                    handleInclude={props.parent && !(props.parent instanceof Library) ? handleInclude : undefined}
                    handleShowSeries={handleShowSeries}
                    handleShowStories={handleShowStories}
                    handleShowVolumes={handleShowVolumes}
                    included={included}
                    parent={props.parent ? props.parent : libraryContext.library}
                    showPrincipal={props.parent && !(props.parent instanceof Library)}
                />
            ) : null }

            {(view === View.SERIES) ? (
                <SeriesSegment
                    handleBack={handleReturn}
                    parent={author}
                />
            ) : null }

            {(view === View.STORIES) ? (
                <h1>StorySegment for {Abridgers.ANY(author)}</h1>
                /*
                                <StorySegment
                                    handleBack={handleReturn}
                                    parent={author}
                                />
                */
            ) : null }

            {(view === View.VOLUMES) ? (
                <h1>VolumeSegment for {Abridgers.ANY(author)}</h1>
                /*
                                <VolumeSegment
                                    handleBack={handleReturn}
                                    parent={author}
                                />
                */
            ) : null }

        </>
    )

}

export default AuthorSegment;

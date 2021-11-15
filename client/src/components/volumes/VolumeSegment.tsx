// VolumeSegment -------------------------------------------------------------

// Consolidated segment for listing and editing Volume objects, as well as
// navigating to segments for related child objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import VolumeDetails from "./VolumeDetails";
import VolumeOptions from "./VolumeOptions";
import AuthorSegment from "../authors/AuthorSegment";
import StorySegment from "../stories/StorySegment";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleVolume, Parent, Scope} from "../../types";
import useMutateVolume from "../../hooks/useMutateVolume";
import Library from "../../models/Library";
import Volume from "../../models/Volume";
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
    AUTHORS = "Authors",
    STORIES = "Stories",
}

const VolumeSegment = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [view, setView] = useState<View>(View.OPTIONS);
    const [volume, setVolume] = useState<Volume>(new Volume());

    const mutateVolume = useMutateVolume({});

    useEffect(() => {
        logger.info({
            context: "VolumeSegment.useEffect",
            library: libraryContext.library.id > 0 ? Abridgers.LIBRARY(libraryContext.library) : undefined,
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            volume: volume ? Abridgers.VOLUME(volume): undefined,
            view: view.toString(),
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
        volume, view]);

    // Create an empty Volume to be added
    const handleAdd: HandleAction = () => {
        const theVolume = new Volume({
            id: -1,
            active: true,
            copyright: null,
            googleId: null,
            isbn: null,
            libraryId: libraryContext.library.id,
            location: "Kindle",
            name: null,
            notes: null,
            read: false,
            type: "Single",
        });
        logger.info({
            context: "VolumeSegment.handleAdd",
            volume: theVolume,
        });
        setVolume(theVolume);
        setView(View.DETAILS);
    }

    // Go back to the ancestor parent, if any
    const handleBack: HandleAction = () => {
        logger.info({
            context: "VolumeSegment.handleBack"
        });
        setView(View.OPTIONS);
        if (props.handleBack) {
            props.handleBack();
        }
    }

    // Handle selection of a Volume to edit details
    const handleEdit: HandleVolume = (theVolume) => {
        logger.info({
            context: "VolumeSegment.handleEdit",
            volume: Abridgers.VOLUME(theVolume),
        });
        setVolume(theVolume);
        setView(View.DETAILS);
    }

    // Handle excluding a Volume from its parent
    const handleExclude: HandleVolume = async (theVolume) => {
        logger.info({
            context: "VolumeSegment.handleExclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            volume: Abridgers.VOLUME(theVolume),
        });
        if (props.parent) {
            if (!(props.parent instanceof Library)) {
                /* const excluded = */ await mutateVolume.exclude(theVolume, props.parent);
            }
        }
    }

    // Handle including a Volume into its Ancestor
    const handleInclude: HandleVolume = async (theVolume) => {
        logger.info({
            context: "VolumeSegment.handleInclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            volume: Abridgers.VOLUME(theVolume),
        });
        if (props.parent) {
            if (!(props.parent instanceof Library)) {
                /* const included = */ await mutateVolume.include(theVolume, props.parent);
            }
        }
    }

    // Handle insert of a new Volume
    const handleInsert: HandleVolume = async (theVolume) => {
        logger.info({
            context: "VolumeSegment.handleInsert",
            volume: Abridgers.VOLUME(theVolume),
        });
        const inserted = await mutateVolume.insert(theVolume);
        handleInclude(inserted);
        setView(View.OPTIONS);
    }

    // Handle remove of an existing Volume
    const handleRemove: HandleVolume = async (theVolume) => {
        logger.info({
            context: "VolumeSegment.handleRemove",
            volume: Abridgers.VOLUME(theVolume),
        });
        /* const removed = */ await mutateVolume.remove(theVolume);
        setView(View.OPTIONS);
    }

    // Handle return from View.DETAILS to redisplay View.OPTIONS
    const handleReturn: HandleAction = () => {
        logger.info({
            context: "VolumeSegment.handleReturn",
        });
        setView(View.OPTIONS);
    }

    // Handle request to show AuthorSegment for a parent Volume
    const handleShowAuthors: HandleVolume = (theVolume) => {
        logger.info({
            context: "VolumeSegment.handleShowAuthors",
            volume: Abridgers.VOLUME(theVolume),
        });
        setVolume(theVolume);
        setView(View.AUTHORS);
    }

    // Handle request to show StorySegment for a parent Volume
    const handleShowStories: HandleVolume = (theVolume) => {
        logger.info({
            context: "VolumeSegment.handleShowStories",
            volume: Abridgers.VOLUME(theVolume),
        });
        setVolume(theVolume);
        setView(View.STORIES);
    }

    // Handle update of an existing Volume
    const handleUpdate: HandleVolume = async (theVolume) => {
        logger.info({
            context: "VolumeSegment.handleUpdate",
            volume: Abridgers.VOLUME(theVolume),
        });
        /* const updated = */ await mutateVolume.update(theVolume);
        setView(View.OPTIONS);
    }

    return (
        <>

            {(view === View.DETAILS) ? (
                <VolumeDetails
                    autoFocus
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleReturn={handleReturn}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    parent={props.parent ? props.parent : libraryContext.library}
                    volume={volume}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <VolumeOptions
                    handleAdd={handleAdd}
                    handleBack={props.handleBack ? handleBack : undefined}
                    handleEdit={handleEdit}
                    handleExclude={props.parent && !(props.parent instanceof Library) && canUpdate ? handleExclude : undefined}
                    handleInclude={props.parent && !(props.parent instanceof Library) && canUpdate ? handleInclude : undefined}
                    handleShowAuthors={handleShowAuthors}
                    handleShowStories={handleShowStories}
                    parent={props.parent ? props.parent : libraryContext.library}
                />
            ) : null }

            {(view === View.AUTHORS) ? (
                <AuthorSegment
                    handleBack={handleReturn}
                    parent={volume}
                />
            ) : null }

            {(view === View.STORIES) ? (
                <StorySegment
                    handleBack={handleReturn}
                    parent={volume}
                />
            ) : null }

        </>
    )

}

export default VolumeSegment;

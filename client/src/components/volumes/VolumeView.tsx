// VolumeView ----------------------------------------------------------------

// Consolidated view for listing and editing Volume objects, as well as
// navigating to view for related child objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {
    useInsertVolumeMutation,
    useRemoveVolumeMutation,
    useUpdateVolumeMutation
} from "./VolumeApi";
import VolumeForm from "./VolumeForm";
import VolumeList from "./VolumeList";
import AuthorView from "../authors/AuthorView";
import MutatingProgress from "../shared/MutatingProgress";
import StoryView from "../stories/StoryView";
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
    handleReturn?: HandleAction;        // Handle request to exit this segment [no handler]
    parent?: Parent;                    // Current object from parent segment [owning Library]
}

// Component Details --------------------------------------------------------

enum View {
    DETAILS = "Details",
    OPTIONS = "Options",
    AUTHORS = "Authors",
    STORIES = "Stories",
}

const VolumeView = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [view, setView] = useState<View>(View.OPTIONS);
    const [volume, setVolume] = useState<Volume>(new Volume());

    const mutateVolume = useMutateVolume({
        alertPopup: false,
    });

    const [insertVolume, {error: insertError, isLoading: insertLoading}] = useInsertVolumeMutation();
    const [removeVolume, {error: removeError, isLoading: removeLoading}] = useRemoveVolumeMutation();
    const [updateVolume, {error: updateError, isLoading: updateLoading}] = useUpdateVolumeMutation();

    useEffect(() => {
        logger.debug({
            context: "VolumeView.useEffect",
            library: libraryContext.library.id > 0 ? Abridgers.LIBRARY(libraryContext.library) : undefined,
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            volume: volume ? Abridgers.VOLUME(volume): undefined,
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
        logger.debug({
            context: "VolumeView.handleAdd",
            volume: theVolume,
        });
        setVolume(theVolume);
        setView(View.DETAILS);
    }

    // Handle selection of a Volume to edit details
    const handleEdit: HandleVolume = (theVolume) => {
        logger.debug({
            context: "VolumeView.handleEdit",
            volume: Abridgers.VOLUME(theVolume),
        });
        setVolume(theVolume);
        setView(View.DETAILS);
    }

    // Handle excluding a Volume from its parent
    const handleExclude: HandleVolume = async (theVolume) => {
        logger.debug({
            context: "VolumeView.handleExclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            volume: Abridgers.VOLUME(theVolume),
        });
        if (props.parent) {
            if (!(props.parent instanceof Library)) {
                setMessage(`Excluding Volume '${theVolume._title}'`);
                /* const excluded = */ await mutateVolume.exclude(theVolume, props.parent);
            }
        }
    }

    // Handle including a Volume into its Ancestor
    const handleInclude: HandleVolume = async (theVolume) => {
        logger.debug({
            context: "VolumeView.handleInclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            volume: Abridgers.VOLUME(theVolume),
        });
        if (props.parent) {
            if (!(props.parent instanceof Library)) {
                setMessage(`Including Volume '${theVolume._title}'`);
                /* const included = */ await mutateVolume.include(theVolume, props.parent);
            }
        }
    }

    // Handle insert of a new Volume
    const handleInsert: HandleVolume = async (theVolume) => {
        setMessage(`Inserting Volume ${theVolume._title}`);
        const inserted = await insertVolume({
            libraryId: libraryContext.library.id,
            volume: theVolume,
        }).unwrap();
        logger.info({
            context: "VolumeView.handleInsert",
            volume: Abridgers.VOLUME(inserted),
        });
        handleInclude(inserted);
        setView(View.OPTIONS);
    }

    // Handle remove of an existing Volume
    const handleRemove: HandleVolume = async (theVolume) => {
        setMessage(`Removing Volume ${theVolume._title}`);
        const removed = await removeVolume({
            libraryId: libraryContext.library.id,
            volumeId: theVolume.id,
        }).unwrap();
        logger.info({
            context: "VolumeView.handleRemove",
            volume: Abridgers.VOLUME(removed),
        });
        setView(View.OPTIONS);
    }

    // Handle return from View.DETAILS to redisplay View.OPTIONS
    const handleReturn: HandleAction = () => {
        logger.debug({
            context: "VolumeView.handleReturn",
        });
        setView(View.OPTIONS);
    }

    // Handle request to show AuthorSegment for a parent Volume
    const handleShowAuthors: HandleVolume = (theVolume) => {
        logger.debug({
            context: "VolumeView.handleShowAuthors",
            volume: Abridgers.VOLUME(theVolume),
        });
        setVolume(theVolume);
        setView(View.AUTHORS);
    }

    // Handle request to show StorySegment for a parent Volume
    const handleShowStories: HandleVolume = (theVolume) => {
        logger.debug({
            context: "VolumeView.handleShowStories",
            volume: Abridgers.VOLUME(theVolume),
        });
        setVolume(theVolume);
        setView(View.STORIES);
    }

    // Handle update of an existing Volume
    const handleUpdate: HandleVolume = async (theVolume) => {
        setMessage(`Updating Volume ${theVolume._title}`);
        const updated = await updateVolume({
            libraryId: libraryContext.library.id,
            volumeId: theVolume.id,
            volume: theVolume,
        }).unwrap();
        logger.info({
            context: "VolumeView.handleUpdate",
            volumeIn: theVolume,
            volumeOut: updated,
        });
        setView(View.OPTIONS);
    }

    return (
        <>

            <MutatingProgress
                error={insertError as Error}
                executing={insertLoading}
                message={message}
            />
            <MutatingProgress
                error={removeError as Error}
                executing={removeLoading}
                message={message}
            />
            <MutatingProgress
                error={updateError as Error}
                executing={updateLoading}
                message={message}
            />

            {(view === View.DETAILS) ? (
                <VolumeForm
                    autoFocus
                    handleReturn={handleReturn}
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    parent={props.parent ? props.parent : libraryContext.library}
                    volume={volume}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <VolumeList
                    handleAdd={handleAdd}
                    handleReturn={props.handleReturn ? props.handleReturn : undefined}
                    handleEdit={handleEdit}
                    handleExclude={props.parent && !(props.parent instanceof Library) && canUpdate ? handleExclude : undefined}
                    handleInclude={props.parent && !(props.parent instanceof Library) && canUpdate ? handleInclude : undefined}
                    handleShowAuthors={handleShowAuthors}
                    handleShowStories={handleShowStories}
                    parent={props.parent ? props.parent : libraryContext.library}
                />
            ) : null }

            {(view === View.AUTHORS) ? (
                <AuthorView
                    handleReturn={handleReturn}
                    parent={volume}
                />
            ) : null }

            {(view === View.STORIES) ? (
                <StoryView
                    handleReturn={handleReturn}
                    parent={volume}
                />
            ) : null }

        </>
    )

}

export default VolumeView;

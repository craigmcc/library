// StorySegment -------------------------------------------------------------

// Consolidated segment for listing and editing Story objects, as well as
// navigating to segments for related child objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import StoryDetails from "./StoryDetails";
import StoryOptions from "./StoryOptions";
import AuthorSegment from "../authors/AuthorSegment";
import SeriesSegment from "../series/SeriesSegment";
import VolumeSegment from "../volumes/VolumeSegment";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleStory, Parent, Scope} from "../../types";
import useMutateStory from "../../hooks/useMutateStory";
import Library from "../../models/Library";
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
    AUTHORS = "Authors",
    SERIES = "Series",
    VOLUMES = "Volumes",
}

const StorySegment = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [story, setStory] = useState<Story>(new Story());
    const [view, setView] = useState<View>(View.OPTIONS);

    const mutateStory = useMutateStory({});

    useEffect(() => {
        logger.info({
            context: "StorySegment.useEffect",
            library: libraryContext.library.id > 0 ? Abridgers.LIBRARY(libraryContext.library) : undefined,
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            story: story ? Abridgers.STORY(story): undefined,
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
        story, view]);

    // Create an empty Story to be added
    const handleAdd: HandleAction = () => {
        const theStory = new Story({
            id: -1,
            active: true,
            copyright: null,
            libraryId: libraryContext.library.id,
            name: null,
            notes: null,
        });
        logger.info({
            context: "StorySegment.handleAdd",
            story: theStory,
        });
        setStory(theStory);
        setView(View.DETAILS);
    }

    // Go back to the ancestor parent, if any
    const handleBack: HandleAction = () => {
        logger.info({
            context: "StorySegment.handleBack"
        });
        setView(View.OPTIONS);
        if (props.handleBack) {
            props.handleBack();
        }
    }

    // Handle selection of a Story to edit details
    const handleEdit: HandleStory = (theStory) => {
        logger.info({
            context: "StorySegment.handleEdit",
            story: Abridgers.STORY(theStory),
        });
        setStory(theStory);
        setView(View.DETAILS);
    }

    // Handle excluding a Story from its parent
    const handleExclude: HandleStory = async (theStory) => {
        logger.info({
            context: "StorySegment.handleExclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            story: Abridgers.STORY(theStory),
        });
        if (props.parent) {
            if (!(props.parent instanceof Library)) {
                /* const excluded = */ await mutateStory.exclude(theStory, props.parent);
            }
        }
    }

    // Handle including a Story into its Ancestor
    const handleInclude: HandleStory = async (theStory) => {
        logger.info({
            context: "StorySegment.handleInclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            story: Abridgers.STORY(theStory),
        });
        if (props.parent) {
            if (!(props.parent instanceof Library)) {
                /* const included = */ await mutateStory.include(theStory, props.parent);
            }
        }
    }

    // Handle insert of a new Story
    const handleInsert: HandleStory = async (theStory) => {
        logger.info({
            context: "StorySegment.handleInsert",
            story: Abridgers.STORY(theStory),
        });
        const inserted = await mutateStory.insert(theStory);
        handleInclude(inserted);
        setView(View.OPTIONS);
    }

    // Handle remove of an existing Story
    const handleRemove: HandleStory = async (theStory) => {
        logger.info({
            context: "StorySegment.handleRemove",
            story: Abridgers.STORY(theStory),
        });
        /* const removed = */ await mutateStory.remove(theStory);
        setView(View.OPTIONS);
    }

    // Handle return from View.DETAILS to redisplay View.OPTIONS
    const handleReturn: HandleAction = () => {
        logger.info({
            context: "StorySegment.handleReturn",
        });
        setView(View.OPTIONS);
    }

    // Handle request to show AuthorSegment for a parent Story
    const handleShowAuthors: HandleStory = (theStory) => {
        logger.info({
            context: "StorySegment.handleShowAuthors",
            story: Abridgers.STORY(theStory),
        });
        setStory(theStory);
        setView(View.AUTHORS);
    }

    // Handle request to show SeriesSegment for a parent Story
    const handleShowSeries: HandleStory = (theStory) => {
        logger.info({
            context: "StorySegment.handleShowSeries",
            story: Abridgers.STORY(theStory),
        });
        setStory(theStory);
        setView(View.SERIES);
    }

    // Handle request to show VolumeSegment for a parent Story
    const handleShowVolumes: HandleStory = (theStory) => {
        logger.info({
            context: "StorySegment.handleShowVolumes",
            story: Abridgers.STORY(theStory),
        });
        setStory(theStory);
        setView(View.VOLUMES);
    }

    // Handle update of an existing Story
    const handleUpdate: HandleStory = async (theStory) => {
        logger.info({
            context: "StorySegment.handleUpdate",
            story: Abridgers.STORY(theStory),
        });
        /* const updated = */ await mutateStory.update(theStory);
        setView(View.OPTIONS);
    }

    return (
        <>

            {(view === View.DETAILS) ? (
                <StoryDetails
                    autoFocus
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleReturn={handleReturn}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    parent={props.parent ? props.parent : libraryContext.library}
                    story={story}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <StoryOptions
                    handleAdd={handleAdd}
                    handleBack={props.handleBack ? handleBack : undefined}
                    handleEdit={handleEdit}
                    handleExclude={props.parent && !(props.parent instanceof Library) && canUpdate ? handleExclude : undefined}
                    handleInclude={props.parent && !(props.parent instanceof Library) && canUpdate ? handleInclude : undefined}
                    handleShowAuthors={handleShowAuthors}
                    handleShowSeries={handleShowSeries}
                    handleShowVolumes={handleShowVolumes}
                    parent={props.parent ? props.parent : libraryContext.library}
                />
            ) : null }

            {(view === View.AUTHORS) ? (
                <AuthorSegment
                    handleBack={handleReturn}
                    parent={story}
                />
            ) : null }

            {(view === View.SERIES) ? (
                <SeriesSegment
                    handleBack={handleReturn}
                    parent={story}
                />
            ) : null }

            {(view === View.VOLUMES) ? (
                <VolumeSegment
                    handleBack={handleReturn}
                    parent={story}
                />
            ) : null }

        </>
    )

}

export default StorySegment;

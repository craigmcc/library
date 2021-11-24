// SeriesSegment -------------------------------------------------------------

// Consolidated segment for listing and editing Series objects, as well as
// navigating to segments for related child objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import SeriesDetails from "./SeriesDetails";
import SeriesOptions from "./SeriesOptions";
import AuthorSegment from "../authors/AuthorSegment";
import SavingProgress from "../general/SavingProgress";
import StorySegment from "../stories/StorySegment";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleSeries, Parent, Scope} from "../../types";
import useMutateSeries from "../../hooks/useMutateSeries";
import Library from "../../models/Library";
import Series from "../../models/Series";
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

const SeriesSegment = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [series, setSeries] = useState<Series>(new Series());
    const [title, setTitle] = useState<string>("");
    const [view, setView] = useState<View>(View.OPTIONS);

    const mutateSeries = useMutateSeries({});

    useEffect(() => {
        logger.info({
            context: "SeriesSegment.useEffect",
            library: libraryContext.library.id > 0 ? Abridgers.LIBRARY(libraryContext.library) : undefined,
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            series: series ? Abridgers.SERIES(series): undefined,
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
        series, view]);

    // Create an empty Series to be added
    const handleAdd: HandleAction = () => {
        const theSeries = new Series({
            id: -1,
            active: true,
            copyright: null,
            libraryId: libraryContext.library.id,
            name: null,
            notes: null,
        });
        logger.info({
            context: "SeriesSegment.handleAdd",
            series: theSeries,
        });
        setSeries(theSeries);
        setView(View.DETAILS);
    }

    // Go back to the ancestor parent, if any
    const handleBack: HandleAction = () => {
        logger.info({
            context: "SeriesSegment.handleBack"
        });
        setView(View.OPTIONS);
        if (props.handleBack) {
            props.handleBack();
        }
    }

    // Handle selection of a Series to edit details
    const handleEdit: HandleSeries = (theSeries) => {
        logger.info({
            context: "SeriesSegment.handleEdit",
            series: Abridgers.SERIES(theSeries),
        });
        setSeries(theSeries);
        setView(View.DETAILS);
    }

    // Handle excluding a Series from its parent
    const handleExclude: HandleSeries = async (theSeries) => {
        logger.info({
            context: "SeriesSegment.handleExclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            series: Abridgers.SERIES(theSeries),
        });
        if (props.parent) {
            setTitle(theSeries._title);
            if (!(props.parent instanceof Library)) {
                /* const excluded = */ await mutateSeries.exclude(theSeries, props.parent);
            }
        }
    }

    // Handle including a Series into its Ancestor
    const handleInclude: HandleSeries = async (theSeries) => {
        logger.info({
            context: "SeriesSegment.handleInclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            series: Abridgers.SERIES(theSeries),
        });
        if (props.parent) {
            if (!(props.parent instanceof Library)) {
                setTitle(theSeries._title);
                /* const included = */ await mutateSeries.include(theSeries, props.parent);
            }
        }
    }

    // Handle insert of a new Series
    const handleInsert: HandleSeries = async (theSeries) => {
        logger.info({
            context: "SeriesSegment.handleInsert",
            series: Abridgers.SERIES(theSeries),
        });
        setTitle(theSeries._title);
        const inserted = await mutateSeries.insert(theSeries);
        handleInclude(inserted);
        setView(View.OPTIONS);
    }

    // Handle remove of an existing Series
    const handleRemove: HandleSeries = async (theSeries) => {
        logger.info({
            context: "SeriesSegment.handleRemove",
            series: Abridgers.SERIES(theSeries),
        });
        setTitle(theSeries._title);
        /* const removed = */ await mutateSeries.remove(theSeries);
        setView(View.OPTIONS);
    }

    // Handle return from View.DETAILS to redisplay View.OPTIONS
    const handleReturn: HandleAction = () => {
        logger.info({
            context: "SeriesSegment.handleReturn",
        });
        setView(View.OPTIONS);
    }

    // Handle request to show AuthorSegment for a parent Series
    const handleShowAuthors: HandleSeries = (theSeries) => {
        logger.info({
            context: "SeriesSegment.handleShowAuthors",
            series: Abridgers.SERIES(theSeries),
        });
        setSeries(theSeries);
        setView(View.AUTHORS);
    }

    // Handle request to show StorySegment for a parent Series
    const handleShowStories: HandleSeries = (theSeries) => {
        logger.info({
            context: "SeriesSegment.handleShowStories",
            series: Abridgers.SERIES(theSeries),
        });
        setSeries(theSeries);
        setView(View.STORIES);
    }

    // Handle update of an existing Series
    const handleUpdate: HandleSeries = async (theSeries) => {
        logger.info({
            context: "SeriesSegment.handleUpdate",
            series: Abridgers.SERIES(theSeries),
        });
        setTitle(theSeries._title);
        /* const updated = */ await mutateSeries.update(theSeries);
        setView(View.OPTIONS);
    }

    return (
        <>

            <SavingProgress
                error={mutateSeries.error}
                executing={mutateSeries.executing}
                title={title}
            />

            {(view === View.DETAILS) ? (
                <SeriesDetails
                    autoFocus
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleReturn={handleReturn}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    parent={props.parent ? props.parent : libraryContext.library}
                    series={series}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <SeriesOptions
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
                    parent={series ? series : undefined}
                />
            ) : null }

            {(view === View.STORIES) ? (
                <StorySegment
                    handleBack={handleReturn}
                    parent={series}
                />
            ) : null }

        </>
    )

}

export default SeriesSegment;

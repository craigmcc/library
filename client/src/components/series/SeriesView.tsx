// SeriesView ----------------------------------------------------------------

// Consolidated view for listing and editing Series objects, as well as
// navigating to views for related child objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import SeriesForm from "./SeriesForm";
import SeriesList from "./SeriesList";
import AuthorView from "../authors/AuthorView";
import MutatingProgress from "../shared/MutatingProgress";
import StoryView from "../stories/StoryView";
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

const SeriesView = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [series, setSeries] = useState<Series>(new Series());
    const [view, setView] = useState<View>(View.OPTIONS);

    const mutateSeries = useMutateSeries({
        alertPopup: false,
    });

    useEffect(() => {
        logger.debug({
            context: "SeriesView.useEffect",
            library: libraryContext.library.id > 0 ? Abridgers.LIBRARY(libraryContext.library) : undefined,
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            series: series ? Abridgers.SERIES(series): undefined,
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
        logger.debug({
            context: "SeriesView.handleAdd",
            series: theSeries,
        });
        setSeries(theSeries);
        setView(View.DETAILS);
    }

    // Handle selection of a Series to edit details
    const handleEdit: HandleSeries = (theSeries) => {
        logger.debug({
            context: "SeriesView.handleEdit",
            series: Abridgers.SERIES(theSeries),
        });
        setSeries(theSeries);
        setView(View.DETAILS);
    }

    // Handle excluding a Series from its parent
    const handleExclude: HandleSeries = async (theSeries) => {
        logger.debug({
            context: "SeriesView.handleExclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            series: Abridgers.SERIES(theSeries),
        });
        if (props.parent) {
            setMessage(`Excluding Series '${theSeries._title}'`);
            if (!(props.parent instanceof Library)) {
                /* const excluded = */ await mutateSeries.exclude(theSeries, props.parent);
            }
        }
    }

    // Handle including a Series into its Ancestor
    const handleInclude: HandleSeries = async (theSeries) => {
        logger.debug({
            context: "SeriesView.handleInclude",
            parent: props.parent ? Abridgers.ANY(props.parent) : undefined,
            series: Abridgers.SERIES(theSeries),
        });
        if (props.parent) {
            if (!(props.parent instanceof Library)) {
                setMessage(`Including Series '${theSeries._title}'`);
                /* const included = */ await mutateSeries.include(theSeries, props.parent);
            }
        }
    }

    // Handle insert of a new Series
    const handleInsert: HandleSeries = async (theSeries) => {
        setMessage(`Inserting Series '${theSeries._title}'`);
        const inserted = await mutateSeries.insert(theSeries);
        logger.debug({
            context: "SeriesView.handleInsert",
            series: Abridgers.SERIES(inserted),
        });
        handleInclude(inserted);
        setView(View.OPTIONS);
    }

    // Handle remove of an existing Series
    const handleRemove: HandleSeries = async (theSeries) => {
        setMessage(`Removing Series '${theSeries._title}'`);
        const removed = await mutateSeries.remove(theSeries);
        logger.debug({
            context: "SeriesView.handleRemove",
            series: Abridgers.SERIES(removed),
        });
        setView(View.OPTIONS);
    }

    // Handle return from View.DETAILS to redisplay View.OPTIONS
    const handleReturn: HandleAction = () => {
        logger.debug({
            context: "SeriesView.handleReturn",
        });
        setView(View.OPTIONS);
    }

    // Handle request to show AuthorSegment for a parent Series
    const handleShowAuthors: HandleSeries = (theSeries) => {
        logger.debug({
            context: "SeriesView.handleShowAuthors",
            series: Abridgers.SERIES(theSeries),
        });
        setSeries(theSeries);
        setView(View.AUTHORS);
    }

    // Handle request to show StorySegment for a parent Series
    const handleShowStories: HandleSeries = (theSeries) => {
        logger.debug({
            context: "SeriesView.handleShowStories",
            series: Abridgers.SERIES(theSeries),
        });
        setSeries(theSeries);
        setView(View.STORIES);
    }

    // Handle update of an existing Series
    const handleUpdate: HandleSeries = async (theSeries) => {
        setMessage(`Updating Series '${theSeries._title}'`);
        const updated = await mutateSeries.update(theSeries);
        logger.debug({
            context: "SeriesView.handleUpdate",
            series: Abridgers.SERIES(updated),
        });
        setView(View.OPTIONS);
    }

    return (
        <>

            <MutatingProgress
                error={mutateSeries.error}
                executing={mutateSeries.executing}
                message={message}
            />

            {(view === View.DETAILS) ? (
                <SeriesForm
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
                <SeriesList
                    handleAdd={canInsert ? handleAdd : undefined}
                    handleEdit={handleEdit}
                    handleExclude={props.parent && !(props.parent instanceof Library) && canUpdate ? handleExclude : undefined}
                    handleInclude={props.parent && !(props.parent instanceof Library) && canUpdate ? handleInclude : undefined}
                    handleReturn={props.handleReturn ? props.handleReturn : undefined}
                    handleShowAuthors={handleShowAuthors}
                    handleShowStories={handleShowStories}
                    parent={props.parent ? props.parent : libraryContext.library}
                />
            ) : null }

            {(view === View.AUTHORS) ? (
                <AuthorView
                    handleReturn={handleReturn}
                    parent={series}
                />
            ) : null }

            {(view === View.STORIES) ? (
                <StoryView
                    handleReturn={handleReturn}
                    parent={series}
                    showOrdinal={true}
                />
            ) : null }

        </>
    )

}

export default SeriesView;

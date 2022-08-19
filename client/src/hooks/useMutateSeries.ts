// useMutateSeries ---------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Series.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessSeries, ProcessSeriesParent} from "../types";
import Api from "../clients/Api";
import LibraryContext from "../components/libraries/LibraryContext";
import Author, {AUTHORS_BASE} from "../models/Author";
import Series, {SERIES_BASE} from "../models/Series";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import ReportError from "../util/ReportError";
import {parentBase} from "../util/Transformations";
import Story from "../models/Story";
import {queryParameters} from "../util/QueryParameters";
import * as ToModel from "../util/ToModel";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    exclude: ProcessSeriesParent;       // Function to exclude a Series from a Parent
    include: ProcessSeriesParent;       // Function to include a Series with a Parent
    insert: ProcessSeries;              // Function to insert a new Series
    remove: ProcessSeries;              // Function to remove an existing Series
    update: ProcessSeries;              // Function to update an existing Series
}

// Component Details ---------------------------------------------------------

const useMutateSeries = (props: Props = {}): State => {

    const libraryContext = useContext(LibraryContext);

    const alertPopup = (props.alertPopup !== undefined) ? props.alertPopup : true;
    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateSeries.useEffect",
        });
    });

    const exclude: ProcessSeriesParent = async (theSeries, theParent) => {
        let url: string = "";
        if (theParent instanceof Author) {
            url = AUTHORS_BASE
                + `/${libraryContext.library.id}/${theParent.id}`
                + `${parentBase(theSeries)}/${theSeries.id}`;
        } else if (theParent instanceof Story) {
            url = SERIES_BASE
                + `/${libraryContext.library.id}/${theSeries.id}`
                + `${parentBase(theParent)}/${theParent.id})`;
        }
        setError(null);
        setExecuting(true);
        try {
            await Api.delete(url);
            logger.debug({
                context: "useMutateSeries.exclude",
                series: Abridgers.SERIES(theSeries),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateSeries.exclude", anError,{
                series: Abridgers.SERIES(theSeries),
                parent: Abridgers.ANY(theParent),
                url: url,
            }, alertPopup);
        }
        setExecuting(false);
        return theSeries;
    }

    const include: ProcessSeriesParent = async (theSeries, theParent) => {
        let url: string = "";
        if (theParent instanceof Author) {
            const parameters = {
                principal: theParent.principal ? "" : undefined
            }
            url = AUTHORS_BASE
                + `/${libraryContext.library.id}/${theParent.id}`
                + `${parentBase(theSeries)}/${theSeries.id}${queryParameters(parameters)}`;
        } else if (theParent instanceof Story) {
            url = SERIES_BASE
                + `/${libraryContext.library.id}/${theSeries.id}`
                + `${parentBase(theParent)}/${theParent.id})`;
        }
        setError(null);
        setExecuting(true);
        try {
            await Api.post(url);
            logger.debug({
                context: "useMutateSeries.include",
                series: Abridgers.SERIES(theSeries),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateSeries.include", anError,{
                series: Abridgers.SERIES(theSeries),
                parent: Abridgers.ANY(theParent),
                url: url,
            }, alertPopup);
        }
        setExecuting(false);
        return theSeries;
    }

    const insert: ProcessSeries = async (theSeries) => {

        const url = SERIES_BASE
            + `/${libraryContext.library.id}`;
        let inserted = new Series();
        setError(null);
        setExecuting(true);

        try {
            inserted = ToModel.SERIES((await Api.post(url, theSeries)).data);
            logger.debug({
                context: "useMutateSeries.insert",
                series: Abridgers.SERIES(inserted),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateSeries.insert", anError, {
                series: Abridgers.SERIES(theSeries),
            }, alertPopup);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessSeries = async (theSeries): Promise<Series> => {

        const url = SERIES_BASE
            + `/${libraryContext.library.id}/${theSeries.id}`;
        let removed = new Series();
        setError(null);
        setExecuting(true);

        try {
            removed = ToModel.SERIES((await Api.delete(url)).data);
            logger.debug({
                context: "useMutateSeries.remove",
                series: Abridgers.SERIES(removed),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateSeries.remove", anError, {
                series: ToModel.SERIES(theSeries),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessSeries = async (theSeries): Promise<Series> => {

        const url = SERIES_BASE
            + `/${libraryContext.library.id}/${theSeries.id}`;
        let updated = new Series();
        setError(null);
        setExecuting(true);

        try {
            updated = ToModel.SERIES((await Api.put(url, theSeries)).data);
            logger.debug({
                context: "useMutateSeries.update",
                series: Abridgers.SERIES(updated),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateSeries.update", anError, {
                series: ToModel.SERIES(theSeries),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return updated;

    }

    return {
        error: error,
        executing: executing,
        exclude: exclude,
        include: include,
        insert: insert,
        remove: remove,
        update: update,
    };

}

export default useMutateSeries;

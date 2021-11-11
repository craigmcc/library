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

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
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

const useMutateSeries = (props: Props): State => {

    const libraryContext = useContext(LibraryContext);

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
            logger.info({
                context: "useMutateSeries.exclude",
                series: Abridgers.SERIES(theSeries),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateSeries.exclude", error,{
                series: Abridgers.SERIES(theSeries),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
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
            logger.info({
                context: "useMutateSeries.include",
                series: Abridgers.SERIES(theSeries),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateSeries.include", error,{
                series: Abridgers.SERIES(theSeries),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        }
        setExecuting(false);
        return theSeries;
    }

    const insert: ProcessSeries = async (theSeries) => {

        let inserted = new Series();
        setError(null);
        setExecuting(true);

        try {
            inserted = (await Api.post(SERIES_BASE
                + `/${libraryContext.library.id}`, theSeries)).data;
            logger.debug({
                context: "useMutateSeries.insert",
                series: Abridgers.SERIES(inserted),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateSeries.insert", error, {
                series: theSeries,
            });
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessSeries = async (theSeries): Promise<Series> => {

        let removed = new Series();
        setError(null);
        setExecuting(true);

        try {
            removed = (await Api.delete(SERIES_BASE
                + `/${libraryContext.library.id}/${theSeries.id}`)).data;
            logger.debug({
                context: "useMutateSeries.remove",
                series: Abridgers.SERIES(removed),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateSeries.remove", error, {
                series: theSeries,
            });
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessSeries = async (theSeries): Promise<Series> => {

        let updated = new Series();
        setError(null);
        setExecuting(true);

        try {
            updated = (await Api.put(SERIES_BASE
                + `/${libraryContext.library.id}/${theSeries.id}`, theSeries)).data;
            logger.debug({
                context: "useMutateSeries.update",
                series: Abridgers.SERIES(updated),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateSeries.update", error, {
                series: theSeries,
            });
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

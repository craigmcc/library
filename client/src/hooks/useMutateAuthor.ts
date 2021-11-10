// useMutateAuthor -----------------------------------------------------------

// Custom hook to encapsulate mutation operations on a Author.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {ProcessAuthor, ProcessAuthorParent} from "../types";
import Api from "../clients/Api";
import LibraryContext from "../components/libraries/LibraryContext";
import Author, {AUTHORS_BASE} from "../models/Author";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import {parentBase} from "../util/Transformations";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
}

export interface State {
    error: Error | null;                // I/O error (if any)
    executing: boolean;                 // Are we currently executing?
    exclude: ProcessAuthorParent;       // Function to exclude an Author from a Parent
    include: ProcessAuthorParent;       // Function to include an Author with a Parent
    insert: ProcessAuthor;              // Function to insert a new Author
    remove: ProcessAuthor;              // Function to remove an existing Author
    update: ProcessAuthor;              // Function to update an existing Author
}

// Component Details ---------------------------------------------------------

const useMutateAuthor = (props: Props): State => {

    const libraryContext = useContext(LibraryContext);

    const [error, setError] = useState<Error | null>(null);
    const [executing, setExecuting] = useState<boolean>(false);

    useEffect(() => {
        logger.debug({
            context: "useMutateAuthor.useEffect",
        });
    });

    const exclude: ProcessAuthorParent = async (theAuthor, theParent) => {
        const url = AUTHORS_BASE
            + `/${libraryContext.library.id}/${theAuthor.id}`
            + `${parentBase(theParent)}/${theParent.id}`;
        setError(null);
        setExecuting(true);
        try {
            await Api.delete(url);
            logger.info({
                context: "useMutateAuthor.exclude",
                author: Abridgers.AUTHOR(theAuthor),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateAuthor.exclude", error, {
                author: Abridgers.AUTHOR(theAuthor),
                parent: Abridgers.ANY(theParent),
                url: url,
            })
        }
        setExecuting(false);
        return theAuthor;
    }

    const include: ProcessAuthorParent = async (theAuthor, theParent) => {
        const parameters = {
            principal: theAuthor.principal ? "" : undefined
        }
        const url = AUTHORS_BASE
            + `/${libraryContext.library.id}/${theAuthor.id}`
            + `${parentBase(theParent)}/${theParent.id}${queryParameters(parameters)}`;
        setError(null);
        setExecuting(true);
        try {
            await Api.post(url);
            logger.info({
                context: "useMutateAuthor.include",
                author: Abridgers.AUTHOR(theAuthor),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateAuthor.include", error, {
                author: Abridgers.AUTHOR(theAuthor),
                parent: Abridgers.ANY(theParent),
                url: url,
            })
        }
        setExecuting(false);
        return theAuthor;
    }

    const insert: ProcessAuthor = async (theAuthor) => {

        let inserted = new Author();
        setError(null);
        setExecuting(true);

        try {
            inserted = (await Api.post(AUTHORS_BASE
                + `/${libraryContext.library.id}`, theAuthor)).data;
            logger.debug({
                context: "useMutateAuthor.insert",
                volume: Abridgers.AUTHOR(inserted),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateAuthor.insert", error, {
                volume: theAuthor,
            });
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessAuthor = async (theAuthor): Promise<Author> => {

        let removed = new Author();
        setError(null);
        setExecuting(true);

        try {
            removed = (await Api.delete(AUTHORS_BASE
                + `/${libraryContext.library.id}/${theAuthor.id}`)).data;
            logger.debug({
                context: "useMutateAuthor.remove",
                volume: Abridgers.AUTHOR(removed),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateAuthor.remove", error, {
                volume: theAuthor,
            });
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessAuthor = async (theAuthor): Promise<Author> => {

        let updated = new Author();
        setError(null);
        setExecuting(true);

        try {
            updated = (await Api.put(AUTHORS_BASE
                + `/${libraryContext.library.id}/${theAuthor.id}`, theAuthor)).data;
            logger.debug({
                context: "useMutateAuthor.update",
                volume: Abridgers.AUTHOR(updated),
            });
        } catch (error) {
            setError(error as Error);
            ReportError("useMutateAuthor.update", error, {
                volume: theAuthor,
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

export default useMutateAuthor;

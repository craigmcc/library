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
import * as ToModel from "../util/ToModel";
import {parentBase} from "../util/Transformations";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    alertPopup?: boolean;               // Pop up browser alert on error? [true]
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

const useMutateAuthor = (props: Props = {}): State => {

    const libraryContext = useContext(LibraryContext);

    const alertPopup = (props.alertPopup !== undefined) ? props.alertPopup : true;
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
            logger.debug({
                context: "useMutateAuthor.exclude",
                author: Abridgers.AUTHOR(theAuthor),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateAuthor.exclude", anError, {
                author: Abridgers.AUTHOR(theAuthor),
                parent: Abridgers.ANY(theParent),
                url: url,
            }, alertPopup);
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
            logger.debug({
                context: "useMutateAuthor.include",
                author: Abridgers.AUTHOR(theAuthor),
                parent: Abridgers.ANY(theParent),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateAuthor.include", anError, {
                author: Abridgers.AUTHOR(theAuthor),
                parent: Abridgers.ANY(theParent),
                url: url,
            }, alertPopup);
        }
        setExecuting(false);
        return theAuthor;
    }

    const insert: ProcessAuthor = async (theAuthor) => {

        const url = AUTHORS_BASE
            + `/${libraryContext.library.id}`;
        let inserted = new Author();
        setError(null);
        setExecuting(true);

        try {
            inserted = ToModel.AUTHOR((await Api.post(url, theAuthor)).data);
            logger.debug({
                context: "useMutateAuthor.insert",
                author: Abridgers.AUTHOR(inserted),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateAuthor.insert", anError, {
                author: Abridgers.AUTHOR(theAuthor),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return inserted;

    }

    const remove: ProcessAuthor = async (theAuthor): Promise<Author> => {

        const url = AUTHORS_BASE
            + `/${libraryContext.library.id}/${theAuthor.id}`;
        let removed = new Author();
        setError(null);
        setExecuting(true);

        try {
            removed = ToModel.AUTHOR((await Api.delete(url)).data);
            logger.debug({
                context: "useMutateAuthor.remove",
                author: Abridgers.AUTHOR(removed),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateAuthor.remove", anError, {
                author: Abridgers.AUTHOR(theAuthor),
                url: url,
            }, alertPopup);
        }

        setExecuting(false);
        return removed;

    }

    const update: ProcessAuthor = async (theAuthor): Promise<Author> => {

        const url = AUTHORS_BASE
            + `/${libraryContext.library.id}/${theAuthor.id}`;
        let updated = new Author();
        setError(null);
        setExecuting(true);

        try {
            updated = ToModel.AUTHOR((await Api.put(url, theAuthor)).data);
            logger.debug({
                context: "useMutateAuthor.update",
                author: Abridgers.AUTHOR(updated),
                url: url,
            });
        } catch (anError) {
            setError(anError as Error);
            ReportError("useMutateAuthor.update", anError, {
                author: Abridgers.AUTHOR(theAuthor),
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

export default useMutateAuthor;

// useFetchVolume ------------------------------------------------------------

// Custom hook to fetch the Volume with the specified ID, with all nested
// objects, as long as it belongs to the current Library.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import Api from "../clients/Api";
import LibraryContext from "../components/libraries/LibraryContext";
import LoginContext from "../components/login/LoginContext";
import Volume, {VOLUMES_BASE} from "../models/Volume";
import * as Abridgers from "../util/Abridgers";
import logger from "../util/ClientLogger";
import {queryParameters} from "../util/QueryParameters";
import ReportError from "../util/ReportError";
import * as Sorters from "../util/Sorters";

// Incoming Properties and Outgoing State ------------------------------------

export interface Props {
    volumeId: number;                   // ID of the Volume to be fetched
}

export interface State {
    error: Error | null;                // I/O error (if any)
    loading: boolean;                   // Are we currently loading?
    volume: Volume;                     // Fetched Volume
}

// Hook Details --------------------------------------------------------------

const useFetchVolume = (props: Props): State => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [volume, setVolume] = useState<Volume>(new Volume());

    useEffect(() => {

        const fetchVolume = async () => {

            setError(null);
            setLoading(true);
            let theVolume = new Volume();
            const parameters = {
                withAuthors: "",
                withStories: "",
            }

            try {
                if (loginContext.data.loggedIn && (props.volumeId > 0)) {
                    theVolume = (await Api.get(VOLUMES_BASE
                        + `/${libraryContext.library.id}/${props.volumeId}`
                        + queryParameters(parameters))).data;
                    if (theVolume.authors && (theVolume.authors.length > 0)) {
                        theVolume.authors = Sorters.AUTHORS(theVolume.authors);
                    }
                    if (theVolume.stories && (theVolume.stories.length > 0)) {
                        theVolume.stories = Sorters.STORIES(theVolume.stories);
                    }
                }
                logger.debug({
                    context: "useFetchVolume.fetchVolume",
                    library: Abridgers.LIBRARY(libraryContext.library),
                    volumeId: props.volumeId,
                    parameters: parameters,
                    volume: Abridgers.VOLUME(theVolume),
                });
            } catch (error) {
                setError(error as Error);
                ReportError("useFetchVolume.fetchVolume", error, {
                    library: Abridgers.LIBRARY(libraryContext.library),
                    volumeId: props.volumeId,
                    parameters: parameters,
                });
            }

            setVolume(theVolume);
            setLoading(false);

        }

        fetchVolume();

    }, [props.volumeId, libraryContext.library.id, loginContext.data.loggedIn]);

    return {
        error: error ? error : null,
        loading: loading,
        volume: volume,
    }

}

export default useFetchVolume;

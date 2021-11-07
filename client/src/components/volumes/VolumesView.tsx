// VolumesView ---------------------------------------------------------------

// Top level view for Volumes management.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

import VolumesStage from "./VolumesStage";
import VolumeSummary from "./VolumeSummary";
import LibraryContext from "../libraries/LibraryContext";
import {HandleStage, HandleVolume, Stage} from "../../types";
import useFetchVolume from "../../hooks/useFetchVolume";
import LoginContext from "../login/LoginContext";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

const VolumesView = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [stage, setStage] = useState<Stage>(Stage.VOLUMES);
    const [volumeId, setVolumeId] = useState<number>(-1);

    const fetchVolume = useFetchVolume({
        volumeId: volumeId,
    });

    useEffect(() => {
        logger.debug({
            context: "VolumesView.useEffect",
        });
    }, [stage, libraryContext.library.id, loginContext.data.loggedIn]);

    const handleStage: HandleStage = (theStage) => {
        logger.info({
            context: "VolumesView.useEffect",
            msg: "No-op for now",
            stage: theStage,
        });
        setStage(Stage.VOLUMES); // TODO set appropriately when possible
    }

    const handleVolume: HandleVolume = (theVolume) => {
        logger.info({
            context: "VolumesView.handleVolume",
            volume: Abridgers.VOLUME(theVolume),
        });
        setVolumeId(theVolume.id);
        handleStage(Stage.AUTHORS);
    }

    return (
        <>
            <Container fluid id="VolumesView">

                <VolumeSummary volume={fetchVolume.volume}/>

                {(stage === Stage.VOLUMES) ? (
                    <VolumesStage
                        handleVolume={handleVolume}
                    />
                ) : null }

            </Container>
        </>
    )

}

export default VolumesView;

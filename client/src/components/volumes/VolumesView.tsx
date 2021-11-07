// VolumesView ---------------------------------------------------------------

// Top level view for Volumes management.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

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

    const [key, setKey] = useState<any | null>(Stage.VOLUMES.toString());
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

    // TODO - if we don't do the initial/next/previous stuff, don't expose this?
    const handleStage: HandleStage = (theStage) => {
        logger.info({
            context: "VolumesView.useEffect",
            msg: "No-op for now",
            stage: theStage,
        });
        setKey(theStage.toString());
        setStage(theStage);
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

{/*
                {(stage === Stage.VOLUMES) ? (
                    <VolumesStage
                        handleVolume={handleVolume}
                    />
                ) : null }
*/}
                <Tabs
                    activeKey={key}
                    className="mb-3"
                    mountOnEnter={true}
                    onSelect={(key) => setKey(key)}
                    transition={false}
                    unmountOnExit={true}
                >

                    <Tab eventKey={Stage.VOLUMES.toString()} title={Stage.VOLUMES.toString()}>
                        <VolumesStage
                            handleVolume={handleVolume}
                        />
                    </Tab>

                    <Tab eventKey={Stage.AUTHORS.toString()} title={Stage.AUTHORS.toString()}>
                        <VolumeSummary volume={fetchVolume.volume}/>
                        <h1>{Stage.AUTHORS.toString()} Tab</h1>
                    </Tab>

                    <Tab eventKey={Stage.STORIES.toString()} title={Stage.STORIES.toString()}>
                        <VolumeSummary volume={fetchVolume.volume}/>
                        <h1>{Stage.STORIES.toString()} Tab</h1>
                    </Tab>

                    <Tab eventKey={Stage.WRITERS.toString()} title={Stage.WRITERS.toString()}>
                        <VolumeSummary volume={fetchVolume.volume}/>
                        <h1>{Stage.WRITERS.toString()} Tab</h1>
                    </Tab>

                </Tabs>

            </Container>
        </>
    )

}

export default VolumesView;

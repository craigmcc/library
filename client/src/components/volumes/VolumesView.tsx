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
import AuthorsStage from "../authors/AuthorsStage";
import useFetchParent from "../../hooks/useFetchParent";
import LibraryContext from "../libraries/LibraryContext";
import {HandleAction, HandleStage, HandleVolume, Stage} from "../../types";
import LoginContext from "../login/LoginContext";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

const VolumesView = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [stage, setStage] = useState<Stage>(Stage.VOLUMES);
    const [volume, setVolume] = useState<Volume>(new Volume());

    const fetchParent = useFetchParent({
        parent: volume,
    })

    useEffect(() => {
        logger.info({
            context: "VolumesView.useEffect",
            stage: stage,
            volume: Abridgers.VOLUME(volume),
        });
    }, [stage, volume,
        libraryContext.library, libraryContext.library.id,
        loginContext.data.loggedIn]);

    const handleStage: HandleStage = (theStage) => {
        logger.info({
            context: "VolumesView.useEffect",
            stage: theStage,
        });
        setStage(theStage);
    }

    // Continue based on the user selecting a tab header
    const handleSelect = (select: string | null): void => {
        if (select) {
            switch (select) {
                case Stage.AUTHORS.toString() :
                    setStage(Stage.AUTHORS);
                    return;
                case Stage.SERIES.toString():
                    setStage(Stage.SERIES);
                    return;
                case Stage.STORIES.toString():
                    setStage(Stage.STORIES);
                    return;
                case Stage.VOLUMES.toString():
                    setStage(Stage.VOLUMES);
                    return;
                default:
                    setStage(Stage.VOLUMES);
                    return;
            }
        }
        setStage(Stage.VOLUMES);
    }

    // Continue based on the user selecting a Volume in Stage.VOLUMES
    const handleVolume: HandleVolume = (theVolume) => {
        logger.info({
            context: "VolumesView.handleVolume",
            oldVolume: Abridgers.VOLUME(volume),
            newVolume: Abridgers.VOLUME(theVolume),
        });
        setVolume(theVolume);
        handleStage(Stage.AUTHORS);
    }

    const refreshSummary: HandleAction = () => {
        logger.info({
            context: "VolumesView.refreshSummary",
        })
        fetchParent.refresh();
    }

    return (
        <>
            <Container fluid id="VolumesView">

                <Tabs
                    activeKey={stage.toString()}
                    className="mb-3"
                    mountOnEnter={true}
                    onSelect={(select) => handleSelect(select)}
                    transition={false}
                    unmountOnExit={true}
                >

                    <Tab
                        eventKey={Stage.VOLUMES.toString()}
                        title={Stage.VOLUMES.toString()}
                    >
                        <VolumesStage
                            handleVolume={handleVolume}
                            parent={libraryContext.library}
                            refreshSummary={refreshSummary}
                        />
                    </Tab>

                    <Tab
                        eventKey={Stage.AUTHORS.toString()}
                        disabled={volume.id < 0}
                        title={Stage.AUTHORS.toString()}
                    >
                        <VolumeSummary volume={fetchParent.parent as Volume}/>
                        <AuthorsStage
                            parent={volume}
                            refreshSummary={refreshSummary}
                            showPrincipal={true}
                        />
                    </Tab>

                    <Tab
                        disabled={volume.id < 0}
                        eventKey={Stage.STORIES.toString()}
                        title={Stage.STORIES.toString()}
                    >
                        <VolumeSummary volume={fetchParent.parent as Volume}/>
                        <h1>{Stage.STORIES.toString()} Tab</h1>
                    </Tab>

                    <Tab
                        disabled={true} // TODO - storyId < 0
                        eventKey={Stage.WRITERS.toString()}
                        title={Stage.WRITERS.toString()}
                    >
                        <VolumeSummary volume={fetchParent.parent as Volume}/>
                        <h1>{Stage.WRITERS.toString()} Tab</h1>
                    </Tab>

                </Tabs>

            </Container>
        </>
    )

}

export default VolumesView;

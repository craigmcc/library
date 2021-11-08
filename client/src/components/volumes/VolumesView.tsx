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
import LibraryContext from "../libraries/LibraryContext";
import {HandleAuthor, HandleStage, HandleVolume, Stage} from "../../types";
//import useFetchAuthor from "../../hooks/useFetchAuthor";
import useFetchVolume from "../../hooks/useFetchVolume";
import LoginContext from "../login/LoginContext";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

const VolumesView = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [authorId, setAuthorId] = useState<number>(-1);
    const [stage, setStage] = useState<Stage>(Stage.VOLUMES);
    const [volumeId, setVolumeId] = useState<number>(-1);

/*
    const fetchAuthor = useFetchAuthor({
        authorId: authorId,
    });
*/
    const fetchVolume = useFetchVolume({
        volumeId: volumeId,
    });

    useEffect(() => {
        logger.debug({
            context: "VolumesView.useEffect",
        });
    }, [stage, libraryContext.library.id, loginContext.data.loggedIn]);

    const handleAuthor: HandleAuthor = (theAuthor) => {
        logger.info({
            context: "VolumesView.handleAuthor",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthorId(theAuthor.id);
        handleStage(Stage.STORIES);
    }

    const handleStage: HandleStage = (theStage) => {
        logger.info({
            context: "VolumesView.useEffect",
            stage: theStage,
        });
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

    return (
        <>
            <Container fluid id="VolumesView">

                <Tabs
                    activeKey={stage.toString()}
                    className="mb-3"
                    //mountOnEnter={true}
                    onSelect={(select) => handleSelect(select)}
                    transition={false}
                    //unmountOnExit={true}
                >

                    <Tab
                        eventKey={Stage.VOLUMES.toString()}
                        title={Stage.VOLUMES.toString()}
                    >
                        <VolumesStage
                            handleVolume={handleVolume}
                            parent={libraryContext.library}
                        />
                    </Tab>

                    <Tab
                        eventKey={Stage.AUTHORS.toString()}
                        disabled={volumeId < 0}
                        title={Stage.AUTHORS.toString()}
                    >
                        <VolumeSummary volume={fetchVolume.volume}/>
                        <AuthorsStage
                            handleAuthor={handleAuthor}
                            parent={fetchVolume.volume}
                        />
                    </Tab>

                    <Tab
                        disabled={authorId < 0}
                        eventKey={Stage.STORIES.toString()}
                        title={Stage.STORIES.toString()}
                    >
                        <VolumeSummary volume={fetchVolume.volume}/>
                        <h1>{Stage.STORIES.toString()} Tab</h1>
                    </Tab>

                    <Tab
                        disabled={true} // TODO - storyId < 0
                        eventKey={Stage.WRITERS.toString()}
                        title={Stage.WRITERS.toString()}
                    >
                        <VolumeSummary volume={fetchVolume.volume}/>
                        <h1>{Stage.WRITERS.toString()} Tab</h1>
                    </Tab>

                </Tabs>

            </Container>
        </>
    )

}

export default VolumesView;

// StoriesView ---------------------------------------------------------------

// Top level view for Stories management.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

// Internal Modules ----------------------------------------------------------

import StoriesStage from "./StoriesStage";
import AuthorsStage from "../authors/AuthorsStage";
import VolumesStage from "../volumes/VolumesStage";
import useFetchParent from "../../hooks/useFetchParent";
import LibraryContext from "../libraries/LibraryContext";
import {HandleAction, HandleStory, HandleStage, Stage} from "../../types";
import LoginContext from "../login/LoginContext";
import Story from "../../models/Story";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

const StoriesView = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [stage, setStage] = useState<Stage>(Stage.STORIES);
    const [story, setStory] = useState<Story>(new Story());

    const fetchParent = useFetchParent({
        parent: story,
    })

    useEffect(() => {
        logger.info({
            context: "StoriesView.useEffect",
            stage: stage,
            story: Abridgers.STORY(story),
        });
    }, [stage, story,
        libraryContext.library, libraryContext.library.id,
        loginContext.data.loggedIn]);

    const handleStage: HandleStage = (theStage) => {
        logger.info({
            context: "StoriesView.useEffect",
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
        setStage(Stage.STORIES);
    }

    // Continue based on the user selecting an Story
    const handleStory: HandleStory = (theStory) => {
        logger.info({
            context: "StoriesView.handleStory",
            oldStory: Abridgers.STORY(story),
            newStory: Abridgers.STORY(theStory),
        });
        setStory(theStory);
        handleStage(Stage.VOLUMES);
    }

    const refreshSummary: HandleAction = () => {
        logger.info({
            context: "StoriesView.refreshSummary",
        })
        fetchParent.refresh();
    }

    return (
        <>
            <Container fluid id="StoriesView">

                <Tabs
                    activeKey={stage.toString()}
                    className="mb-3"
                    mountOnEnter={true}
                    onSelect={(select) => handleSelect(select)}
                    transition={false}
                    unmountOnExit={true}
                >

                    <Tab
                        eventKey={Stage.STORIES.toString()}
                        disabled={story.id < 0}
                        title={Stage.STORIES.toString()}
                    >
                        <StoriesStage
                            handleStory={handleStory}
                            parent={libraryContext.library}
                            refreshSummary={refreshSummary}
                        />
                    </Tab>

                    <Tab
                        eventKey={Stage.AUTHORS.toString()}
                        disabled={story.id < 0}
                        title={Stage.AUTHORS.toString()}
                    >
                        <AuthorsStage
                            parent={story}
                            refreshSummary={refreshSummary}
                            showPrincipal={false}
                        />
                    </Tab>

                    <Tab
                        disabled={story.id < 0}
                        eventKey={Stage.SERIES.toString()}
                        title={Stage.SERIES.toString()}
                    >
                        <h1>{Stage.SERIES.toString()} Tab</h1>
                    </Tab>

                    <Tab
                        eventKey={Stage.VOLUMES.toString()}
                        title={Stage.VOLUMES.toString()}
                    >
                        <VolumesStage
                            parent={fetchParent.parent as Story}
                            refreshSummary={refreshSummary}
                        />
                    </Tab>

                    <Tab
                        disabled={story.id < 0}
                        eventKey={Stage.WRITERS.toString()}
                        title={Stage.WRITERS.toString()}
                    >
                        <h1>{Stage.WRITERS.toString()} Tab</h1>
                    </Tab>

                </Tabs>

            </Container>
        </>
    )

}

export default StoriesView;

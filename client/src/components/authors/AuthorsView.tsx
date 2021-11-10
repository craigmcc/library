// AuthorsView ---------------------------------------------------------------

// Top level view for Authors management.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

// Internal Modules ----------------------------------------------------------

import AuthorsStage from "./AuthorsStage";
import VolumesStage from "../volumes/VolumesStage";
import useFetchParent from "../../hooks/useFetchParent";
import LibraryContext from "../libraries/LibraryContext";
import {HandleAction, HandleAuthor, HandleStage, Stage} from "../../types";
import LoginContext from "../login/LoginContext";
import Author from "../../models/Author";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

const AuthorsView = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [stage, setStage] = useState<Stage>(Stage.AUTHORS);
    const [author, setAuthor] = useState<Author>(new Author());

    const fetchParent = useFetchParent({
        parent: author,
    })

    useEffect(() => {
        logger.info({
            context: "AuthorsView.useEffect",
            stage: stage,
            volume: Abridgers.AUTHOR(author),
        });
    }, [stage, author,
        libraryContext.library, libraryContext.library.id,
        loginContext.data.loggedIn]);

    const handleStage: HandleStage = (theStage) => {
        logger.info({
            context: "AuthorsView.useEffect",
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

    // Continue based on the user selecting an Author in Stage.AUTHORS
    const handleAuthor: HandleAuthor = (theAuthor) => {
        logger.info({
            context: "AuthorsView.handleAuthor",
            oldAuthor: Abridgers.AUTHOR(author),
            newAuthor: Abridgers.AUTHOR(theAuthor),
        });
        setAuthor(theAuthor);
        handleStage(Stage.VOLUMES);
    }

    const refreshSummary: HandleAction = () => {
        logger.info({
            context: "AuthorsView.refreshSummary",
        })
        fetchParent.refresh();
    }

    return (
        <>
            <Container fluid id="AuthorsView">

                <Tabs
                    activeKey={stage.toString()}
                    className="mb-3"
                    mountOnEnter={true}
                    onSelect={(select) => handleSelect(select)}
                    transition={false}
                    unmountOnExit={true}
                >

                    <Tab
                        eventKey={Stage.AUTHORS.toString()}
                        disabled={author.id < 0}
                        title={Stage.AUTHORS.toString()}
                    >
                        <AuthorsStage
                            handleAuthor={handleAuthor}
                            parent={libraryContext.library}
                            refreshSummary={refreshSummary}
                        />
                    </Tab>

                    <Tab
                        eventKey={Stage.VOLUMES.toString()}
                        title={Stage.VOLUMES.toString()}
                    >
                        <VolumesStage
                            parent={fetchParent.parent as Author}
                            refreshSummary={refreshSummary}
                        />
                    </Tab>

                    <Tab
                        disabled={author.id < 0}
                        eventKey={Stage.STORIES.toString()}
                        title={Stage.STORIES.toString()}
                    >
                        <h1>{Stage.STORIES.toString()} Tab</h1>
                    </Tab>

                    <Tab
                        disabled={true} // TODO - storyId < 0
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

export default AuthorsView;

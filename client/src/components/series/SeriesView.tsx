// SeriesView ---------------------------------------------------------------

// Top level view for Serieses management.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

// Internal Modules ----------------------------------------------------------

import SeriesesStage from "./SeriesesStage";
import SeriesSummary from "./SeriesSummary";
import AuthorsStage from "../authors/AuthorsStage";
import useFetchParent from "../../hooks/useFetchParent";
import LibraryContext from "../libraries/LibraryContext";
import {HandleAction, HandleStage, HandleSeries, Stage} from "../../types";
import LoginContext from "../login/LoginContext";
import Series from "../../models/Series";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

const SeriesView = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [stage, setStage] = useState<Stage>(Stage.VOLUMES);
    const [series, setSeries] = useState<Series>(new Series());

    const fetchParent = useFetchParent({
        parent: series,
    })

    useEffect(() => {
        logger.info({
            context: "SeriesesView.useEffect",
            stage: stage,
            series: Abridgers.SERIES(series),
        });
    }, [stage, series,
        libraryContext.library, libraryContext.library.id,
        loginContext.data.loggedIn]);

    const handleStage: HandleStage = (theStage) => {
        logger.info({
            context: "SeriesesView.useEffect",
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

    // Continue based on the user selecting a Series in Stage.VOLUMES
    const handleSeries: HandleSeries = (theSeries) => {
        logger.info({
            context: "SeriesesView.handleSeries",
            oldSeries: Abridgers.SERIES(series),
            newSeries: Abridgers.SERIES(theSeries),
        });
        setSeries(theSeries);
        handleStage(Stage.AUTHORS);
    }

    const refreshSummary: HandleAction = () => {
        logger.info({
            context: "SeriesesView.refreshSummary",
        })
        fetchParent.refresh();
    }

    return (
        <>
            <Container fluid id="SeriesesView">

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
                        <SeriesesStage
                            handleSeries={handleSeries}
                            parent={libraryContext.library}
                            refreshSummary={refreshSummary}
                        />
                    </Tab>

                    <Tab
                        eventKey={Stage.AUTHORS.toString()}
                        disabled={series.id < 0}
                        title={Stage.AUTHORS.toString()}
                    >
                        <SeriesSummary series={fetchParent.parent as Series}/>
                        <AuthorsStage
                            parent={series}
                            refreshSummary={refreshSummary}
                            showPrincipal={true}
                        />
                    </Tab>

                    <Tab
                        disabled={series.id < 0}
                        eventKey={Stage.STORIES.toString()}
                        title={Stage.STORIES.toString()}
                    >
                        <SeriesSummary series={fetchParent.parent as Series}/>
                        <h1>{Stage.STORIES.toString()} Tab</h1>
                    </Tab>

                    <Tab
                        disabled={true} // TODO - storyId < 0
                        eventKey={Stage.WRITERS.toString()}
                        title={Stage.WRITERS.toString()}
                    >
                        <SeriesSummary series={fetchParent.parent as Series}/>
                        <h1>{Stage.WRITERS.toString()} Tab</h1>
                    </Tab>

                </Tabs>

            </Container>
        </>
    )

}

export default SeriesView;

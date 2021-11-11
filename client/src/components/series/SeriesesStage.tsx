// SeriesesStage --------------------------------------------------------------

// Manage selection of a Series to be processed for subsequent stages, while
// also supporting CRUD management of an individual Series.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import SeriesForm from "./SeriesForm";
import SeriesesList from"./SeriesesList";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleSeries, Parent, Scope} from "../../types";
import useFetchParent from "../../hooks/useFetchParent";
import useMutateSeries from "../../hooks/useMutateSeries";
import Author from "../../models/Author";
import Library from "../../models/Library";
import Story from "../../models/Story";
import Series from "../../models/Series";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleSeries?: HandleSeries;        // Handle selecting Series [no handler]
    parent: Parent;                     // Parent object for Serieses (pass to useFetchParent)
    refreshSummary?: HandleAction;      // Trigger updates to summary when called
}

// Component Details ---------------------------------------------------------

const SeriesesStage = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [series, setSeries] = useState<Series | null>(null);

    const fetchParent = useFetchParent({
        parent: props.parent,
    });
    const mutateSeries = useMutateSeries({});

    useEffect(() => {
        logger.info({
            context: "SeriesesStage.useEffect",
            parent: Abridgers.ANY(props.parent),
        });
        const isAdmin = loginContext.validateLibrary(libraryContext.library, Scope.ADMIN);
        // const isRegular = loginContext.validateLibrary(libraryContext.library, Scope.REGULAR);
        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isAdmin || isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isAdmin || isSuperuser);
    }, [series, props.parent,
        fetchParent.parent,
        libraryContext.library, libraryContext.library.id,
        loginContext, loginContext.data.loggedIn]);

    const handleAdd: HandleAction = () => {
        const theSeries = new Series({
            active: true,
            copyright: null,
            googleId: null,
            isbn: null,
            libraryId: libraryContext.library.id,
            location: "Kindle",
            name: null,
            notes: null,
            read: false,
            type: "Single",
        });
        logger.info({
            context: "SeriesesStage.handleAdd",
            volume: theSeries,
        });
        setSeries(theSeries);
    }

    const handleEdit: HandleSeries = async (theSeries) => {
        logger.info({
            context: "SeriesesStage.handleEdit",
            volume: Abridgers.SERIES(theSeries),
        });
        setSeries(theSeries);
    }

    const handleExclude: HandleSeries = async (theSeries) => {
        logger.info({
            context: "SeriesesStage.handleExclude",
            volume: Abridgers.SERIES(theSeries),
            parent: Abridgers.ANY(fetchParent.parent),
        });
        if (!(fetchParent.parent instanceof Library)) {
            /* const excluded = */ await mutateSeries.exclude(theSeries, fetchParent.parent);
            fetchParent.refresh();
            refreshSummary();
        }
    }

    const handleInclude: HandleSeries = async (theSeries) => {
        logger.info({
            context: "SeriesesStage.handleInclude",
            volume: Abridgers.SERIES(theSeries),
            parent: Abridgers.ANY(fetchParent.parent),
        });
        if (!(fetchParent.parent instanceof Library)) {
            /* const included = */ await mutateSeries.include(theSeries, fetchParent.parent);
            fetchParent.refresh();
            refreshSummary();
        }
    }

    const handleInsert: HandleSeries = async (theSeries) => {
        logger.info({
            context: "SeriesesStage.handleInsert",
            volume: Abridgers.SERIES(theSeries),
        });
        const inserted = await mutateSeries.insert(theSeries);
        handleInclude(inserted); // Assume the newly created Series is included for this Parent
        fetchParent.refresh();
        setSeries(null);
        refreshSummary();
    }

    const handleRemove: HandleSeries = async (theSeries) => {
        logger.info({
            context: "SeriesesStage.handleRemove",
            volume: Abridgers.SERIES(theSeries),
        });
        /* const removed = */ await mutateSeries.remove(theSeries);
        setSeries(null);
        refreshSummary();
    }

    const handleSelect: HandleSeries = (theSeries) => {
        logger.info({
            context: "SeriesesStage.handleSelect",
            volume: Abridgers.SERIES(theSeries),
        });
        if (props.handleSeries) {
            props.handleSeries(theSeries);
        }
        setSeries(theSeries);
    }

    const handleUpdate: HandleSeries = async (theSeries) => {
        logger.info({
            context: "SeriesesStage.handleUpdate",
            volume: Abridgers.SERIES(theSeries),
        });
        /* const updated = */ await mutateSeries.update(theSeries);
        setSeries(null);
        refreshSummary();
    }

    const included = (theSeries: Series): boolean => {
        let result = false;
        if (fetchParent.parent instanceof Library) {
            result = true;
        } else if ((fetchParent.parent instanceof Author)
            || (fetchParent.parent instanceof Story)) {
            if (fetchParent.parent.series) {
                fetchParent.parent.series.forEach(series => {
                    if (theSeries.id === series.id) {
                        result = true;
                    }
                })
            }
        }
        return result;
    }

    const refreshSummary = (): void => {
        if (props.refreshSummary) {
            props.refreshSummary();
        }
    }

    return (
        <Container fluid id="SeriesesStage">

            {/* List View */}
            {(!series) ? (
                <>

                    <Row className="mb-3">
                        <Col className="text-center">
                            <span>Add, Edit, or Select Series for {fetchParent.parent._model}: </span>
                            <span className="text-info">{fetchParent.parent._title}</span>
                        </Col>
                    </Row>

                    <SeriesesList
                        handleAdd={canInsert ? handleAdd : undefined}
                        handleEdit={(canInsert || canUpdate) ? handleEdit : undefined}
                        handleExclude=
                            {(canInsert || canUpdate) && !(fetchParent.parent instanceof Library) ? handleExclude : undefined}
                        handleInclude=
                            {(canInsert || canUpdate) && !(fetchParent.parent instanceof Library) ? handleInclude : undefined}
                        handleSelect={handleSelect}
                        included={included}
                        parent={fetchParent.parent}
                    />

                </>
            ) : null }

            {/* Detail View */}
            {(series) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            {(series.id > 0) ? (
                                <span>Edit Existing</span>
                            ) : (
                                <span>Add New</span>
                            )}
                            &nbsp;Series for {fetchParent.parent._model}:&nbsp;
                            <span className="text-info">
                                {fetchParent.parent._title}
                            </span>
                        </Col>
                        <Col className="text-end">
                            <Button
                                onClick={() => setSeries(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <SeriesForm
                        autoFocus
                        handleInsert={canInsert ? handleInsert : undefined}
                        handleRemove={canRemove ? handleRemove : undefined}
                        handleUpdate={canUpdate ? handleUpdate : undefined}
                        series={series}
                    />

                </>
            ) : null }

        </Container>
    )

}

export default SeriesesStage;

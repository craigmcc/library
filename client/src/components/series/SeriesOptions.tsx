// SeriesOptions -------------------------------------------------------------

// List Series that match search criteria, offering callbacks for adding,
// editing, and removing Series.  Optionally, include relevant actions.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {CheckBox, Pagination, SearchBar} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import FetchingProgress from "../general/FetchingProgress";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleBoolean, HandleSeries, HandleValue, Parent} from "../../types";
import useFetchFocused from "../../hooks/useFetchFocused";
import useFetchSerieses from "../../hooks/useFetchSerieses";
import Author from "../../models/Author";
import Series from "../../models/Series";
import Story from "../../models/Story";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {authorsNames, listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a Series [not allowed]
    handleBack?: HandleAction;          // Handle request to leave segment [no handler]
    handleEdit?: HandleSeries;          // Handle request to edit a Series [not allowed]
    handleExclude?: HandleSeries;       // Handle request to exclude a Series [not allowed]
    handleInclude?: HandleSeries;       // Handle request to include a Series [not allowed]
    handleShowAuthors?: HandleSeries;   // Handle request to show related Authors [not allowed]
    handleShowStories?: HandleSeries;   // Handle request to show related Stories [not allowed]
    parent: Parent;                     // Parent object for Serieses
}

// Component Details ---------------------------------------------------------

const SeriesOptions = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(100);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>("");

    const fetchFocused = useFetchFocused({
        focusee: props.parent,
    });
    const fetchSerieses = useFetchSerieses({
        active: active,
        alertPopup: false,
        currentPage: currentPage,
        name: (searchText.length > 0) ? searchText : undefined,
        pageSize: pageSize,
        parent: props.parent,
        withAuthors: true,
        withStories: true,
    });

    useEffect(() => {
        logger.debug({
            context: "SeriesOptions.useEffect",
            library: Abridgers.LIBRARY(libraryContext.library),
            parent: Abridgers.ANY(props.parent),
            active: active,
            name: searchText,
            refresh: refresh,
        });
        setRefresh(false);
    }, [props.parent,
        libraryContext.library, libraryContext.library.id,
        loginContext.data.loggedIn,
        active, refresh, searchText,
        fetchSerieses.serieses]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleBack: HandleAction = () => {
        if (props.handleBack) {
            props.handleBack();
        }
    }

    const handleChange: HandleValue = (theSearchText) => {
        setSearchText(theSearchText);
    }

    const handleEdit: HandleSeries = (theSeries) => {
        if (props.handleEdit) {
            props.handleEdit(theSeries);
        }
    }

    const handleExclude: HandleSeries = (theSeries) => {
        if (props.handleExclude) {
            props.handleExclude(theSeries);
            //fetchSerieses.refresh();
            //fetchFocused.refresh();
            //setRefresh(true);
            // NOTE - Messing with fetchFocused.focused is really lame
            // @ts-ignore
            if (fetchFocused.focused.series) {
                let found = -1;
                // @ts-ignore
                fetchFocused.focused.series.forEach((series, index) => {
                    if (theSeries.id === series.id) {
                        found = index;
                    }
                });
                if (found >= 0) {
                    // @ts-ignore
                    fetchFocused.focused.series.splice(found, 1);
                }

            }
        }
    }

    const handleInclude: HandleSeries = (theSeries) => {
        if (props.handleInclude) {
            props.handleInclude(theSeries);
            //fetchSerieses.refresh();
            //fetchFocused.refresh();
            //setRefresh(true);
            // NOTE - Messing with fetchFocused.focused is really lame
            // @ts-ignore
            if (fetchFocused.focused.series) {
                // @ts-ignore
                fetchFocused.focused.series.push(theSeries);
            }
        }
    }

    const handleNext: HandleAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: HandleAction = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleShowAuthors: HandleSeries = (theSeries) => {
        if (props.handleShowAuthors) {
            props.handleShowAuthors(theSeries);
        }
    }

    const handleShowStories: HandleSeries = (theSeries) => {
        if (props.handleShowStories) {
            props.handleShowStories(theSeries);
        }
    }

    // Is this Series included in its parent?
    const included = (theSeries: Series): boolean => {
        let result = false;
        if (props.parent) {
            if ((fetchFocused.focused instanceof Author)
                    || (fetchFocused.focused instanceof Story)) {
                if (fetchFocused.focused.series) {
                    fetchFocused.focused.series.forEach(series => {
                        if (theSeries.id === series.id) {
                            result = true;
                        }
                    });
                }
            }
        }
        return result;
    }

    return (
        <Container fluid id="SeriesOptions">

            <FetchingProgress
                error={fetchSerieses.error}
                loading={fetchSerieses.loading}
                message="Fetching selected Series"
            />

            <Row className="mb-3">
                <Col/>
                <Col className="text-center">
                    <strong>
                    <span>Manage Series for {props.parent._model}:&nbsp;</span>
                    <span className="text-info">{props.parent._title}</span>
                    </strong>
                </Col>
                {props.handleBack ? (
                    <Col className="text-end">
                        <Button
                            onClick={() => handleBack()}
                            size="sm"
                            type="button"
                            variant="success"
                        >Back</Button>
                    </Col>
                ) : <Col/> }
            </Row>

            <Row className="mb-3">
                <Col className="col-6">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        htmlSize={50}
                        label="Search For Series:"
                        placeholder="Search by all or part of name"
                    />
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        label="Active Series Only?"
                        name="activeOnly"
                        value={active}
                    />
                </Col>
                <Col className="text-end">
                    <Pagination
                        currentPage={currentPage}
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        lastPage={(fetchSerieses.serieses.length === 0) ||
                            (fetchSerieses.serieses.length < pageSize)}
                        variant="secondary"
                    />
                </Col>
                <Col className="text-end">
                    <Button
                        disabled={!props.handleAdd}
                        onClick={props.handleAdd}
                        size="sm"
                        variant="primary"
                    >Add</Button>
                </Col>
            </Row>

            <Row className="g-2">
                <Table
                    bordered={true}
                    hover={true}
                    size="sm"
                    striped={true}
                >

                    <thead>
                    <tr className="table-dark">
                        {(searchText.length > 0) ? (
                            <th
                                className="text-center"
                                colSpan={99}
                            >
                                {`Series for ${libraryContext.library._model}: ${libraryContext.library._title}`}
                            </th>
                        ) : (
                            <th
                                className="text-center"
                                colSpan={99}
                            >
                                {`Series for ${props.parent._model}: ${props.parent._title}`}
                            </th>
                        )}

                    </tr>
                    <tr className="table-secondary">
                        <th scope="col">Name</th>
                        <th scope="col">Authors</th>
                        <th scope="col">Active</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {fetchSerieses.serieses.map((series, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                        >
                            <td
                                key={1000 + (rowIndex * 100) + 1}
                                onClick={props.handleEdit ? (() => handleEdit(series)) : undefined}
                            >
                                {series._title}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {authorsNames(series.authors)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(series.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {series.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {(props.handleEdit) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleEdit(series)}
                                        size="sm"
                                        type="button"
                                        variant="primary"
                                    >Edit</Button>
                                ) : null }
                                {(props.handleExclude) ? (
                                    <Button
                                        className="me-1"
                                        disabled={!included(series)}
                                        onClick={() => handleExclude(series)}
                                        size="sm"
                                        type="button"
                                        variant="primary"
                                    >Exclude</Button>
                                ) : null }
                                {(props.handleInclude) ? (
                                    <Button
                                        className="me-1"
                                        disabled={included(series)}
                                        onClick={() => handleInclude(series)}
                                        size="sm"
                                        type="button"
                                        variant="primary"
                                    >Include</Button>
                                ) : null }
                                {props.handleShowAuthors || props.handleShowStories ? (
                                    <span className="ms-1 me-2">|</span>
                                ) : null }
                                {(props.handleShowAuthors) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleShowAuthors(series)}
                                        size="sm"
                                        type="button"
                                        variant="success"
                                    >Authors</Button>
                                ) : null }
                                {(props.handleShowStories) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleShowStories(series)}
                                        size="sm"
                                        type="button"
                                        variant="success"
                                    >Stories</Button>
                                ) : null }
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

            <Row className="mb-3">
                <Col className="text-end">
                    <Button
                        disabled={!props.handleAdd}
                        onClick={props.handleAdd}
                        size="sm"
                        variant="primary"
                    >Add</Button>
                </Col>
            </Row>

        </Container>
    )

}

export default SeriesOptions;

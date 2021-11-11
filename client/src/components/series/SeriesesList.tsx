// SeriesesList -----------------------------------------------------------------

// List Series that match search criteria, offering callbacks for adding,
// editing, and removing Serieses.  Optionally, include relevant actions.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import CheckBox from "../general/CheckBox";
import Pagination from "../general/Pagination";
import SearchBar from "../general/SearchBar";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleBoolean, HandleSeries, HandleValue, Parent} from "../../types";
import useFetchSerieses from "../../hooks/useFetchSerieses";
import Series from "../../models/Series";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {authorsNames, listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a Series [not allowed]
    handleEdit?: HandleSeries;          // Handle request to edit a Series [not allowed]
    handleExclude?: HandleSeries;       // Handle request to exclude a Series [not allowed]
    handleInclude?: HandleSeries;       // Handle request to include a Series [not allowed]
    handleSelect?: HandleSeries;        // Handle request to select a Series [not allowed]
    included?: (series: Series) => boolean; // Is this Series included in parent? [true]
    parent: Parent;                    // Parent object for Serieses
}

// Component Details ---------------------------------------------------------

const SeriesesList = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(100);
    const [searchText, setSearchText] = useState<string>("");

    const fetchSerieses = useFetchSerieses({
        active: active,
        currentPage: currentPage,
        name: (searchText.length > 0) ? searchText : undefined,
        pageSize: pageSize,
        parent: props.parent,
        withAuthors: true,  // Since we are showing author names in the list
    });

    useEffect(() => {
        logger.info({
            context: "SeriesesList.useEffect",
            parent: Abridgers.ANY(props.parent),
        });
    }, [active, searchText, props.parent,
        fetchSerieses.serieses,
        libraryContext, libraryContext.library.id,
        loginContext.data.loggedIn]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
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
        }
    }

    const handleInclude: HandleSeries = (theSeries) => {
        if (props.handleInclude) {
            props.handleInclude(theSeries);
        }
    }

    const handleNext: HandleAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: HandleAction = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleSelect: HandleSeries = (theSeries) => {
        if (props.handleSelect) {
            props.handleSelect(theSeries);
        }
    }

    const included = (theSeries: Series): boolean => {
        if (props.included) {
            return props.included(theSeries);
        } else {
            return true;
        }
    }

    // @ts-ignore
    return (
        <Container fluid id="SeriesesList">

            <Row className="mb-3">
                <Col className="col-6">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        htmlSize={50}
                        label="Search For Serieses:"
                        placeholder="Search by all or part of name"
                    />
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        label="Active Serieses Only?"
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
                        <th
                            className="text-center"
                            colSpan={99}
                        >
                            {`Serieses for ${props.parent._model}: ${props.parent._title}`}
                        </th>
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
                                onClick={props.handleSelect ? () => handleSelect(series) : undefined}
                            >
                                {series.name}
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
                                        variant="secondary"
                                    >Exclude</Button>
                                ) : null }
                                {(props.handleInclude) ? (
                                    <Button
                                        className="me-1"
                                        disabled={included(series)}
                                        onClick={() => handleInclude(series)}
                                        size="sm"
                                        type="button"
                                        variant="secondary"
                                    >Include</Button>
                                ) : null }
                                {(props.handleSelect) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleSelect(series)}
                                        size="sm"
                                        type="button"
                                        variant="primary"
                                    >Select</Button>
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

export default SeriesesList;

// AuthorOptions -----------------------------------------------------------------

// List Authors that match search criteria, offering callbacks for adding,
// editing, and removing Authors.  Optionally, include relevant actions.

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
import {HandleAction, HandleBoolean, HandleAuthor, HandleValue, Parent} from "../../types";
import useFetchAuthors from "../../hooks/useFetchAuthors";
import Author from "../../models/Author";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add an Author [not allowed]
    handleBack?: HandleAction;          // Handle request to leave segment [no handler]
    handleEdit?: HandleAuthor;          // Handle request to edit an Author [not allowed]
    handleExclude?: HandleAuthor;       // Handle request to exclude an Author [not allowed]
    handleInclude?: HandleAuthor;       // Handle request to include an Author [not allowed]
    handleShowSeries?: HandleAuthor;    // Handle request to show related Series [not allowed]
    handleShowStories?: HandleAuthor;   // Handle request to show related Stories [not allowed]
    handleShowVolumes?: HandleAuthor;   // Handle request to show related Volumes [not allowed]
    included?: (author: Author) => boolean; // Is this Author included in parent? [true]
    parent: Parent;                     // Parent object for Authors
    showPrincipal?: boolean;            // Show the Principal column? [false]
}

// Component Details ---------------------------------------------------------

const AuthorOptions = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(100);
    const [searchText, setSearchText] = useState<string>("");

    const fetchAuthors = useFetchAuthors({
        active: active,
        currentPage: currentPage,
        name: (searchText.length > 0) ? searchText : undefined,
        pageSize: pageSize,
        parent: props.parent,
    });

    useEffect(() => {
        logger.info({
            context: "AuthorOptions.useEffect",
            library: Abridgers.LIBRARY(libraryContext.library),
            parent: Abridgers.ANY(props.parent),
            active: active,
            name: searchText,
        });
    }, [props.parent,
        libraryContext.library, libraryContext.library.id,
        loginContext.data.loggedIn,
        active, searchText,
        fetchAuthors.authors]);

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

    const handleEdit: HandleAuthor = (theAuthor) => {
        if (props.handleEdit) {
            props.handleEdit(theAuthor);
        }
    }

    const handleExclude: HandleAuthor = (theAuthor) => {
        if (props.handleExclude) {
            props.handleExclude(theAuthor);
        }
    }

    const handleInclude: HandleAuthor = (theAuthor) => {
        if (props.handleInclude) {
            props.handleInclude(theAuthor);
        }
    }

    const handleNext: HandleAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: HandleAction = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleShowSeries: HandleAuthor = (theAuthor) => {
        if (props.handleShowSeries) {
            props.handleShowSeries(theAuthor);
        }
    }

    const handleShowStories: HandleAuthor = (theAuthor) => {
        if (props.handleShowStories) {
            props.handleShowStories(theAuthor);
        }
    }

    const handleShowVolumes: HandleAuthor = (theAuthor) => {
        if (props.handleShowVolumes) {
            props.handleShowVolumes(theAuthor);
        }
    }

    const included = (theAuthor: Author): boolean => {
        if (props.included) {
            return props.included(theAuthor);
        } else {
            return true;
        }
    }

    return (
        <Container fluid id="AuthorOptions">

            <Row className="mb-3">
                <Col/>
                <Col className="text-center">
                    <span>Manage Authors for {props.parent._model}:&nbsp;</span>
                    <span className="text-info">{props.parent._title}</span>
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
                        label="Search For Authors:"
                        placeholder="Search by all or part of name"
                    />
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        label="Active Authors Only?"
                        name="activeOnly"
                        value={active}
                    />
                </Col>
                <Col className="text-end">
                    <Pagination
                        currentPage={currentPage}
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        lastPage={(fetchAuthors.authors.length === 0) ||
                        (fetchAuthors.authors.length < pageSize)}
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
                                {`Authors for ${libraryContext.library._model}: ${libraryContext.library._title}`}
                            </th>
                        ) : (
                            <th
                                className="text-center"
                                colSpan={99}
                            >
                                {`Authors for ${props.parent._model}: ${props.parent._title}`}
                            </th>
                        )}
                    </tr>
                    <tr className="table-secondary">
                        <th scope="col">Name</th>
                        {props.showPrincipal ? (
                            <th scope="col">Principal</th>
                        ) : null }
                        <th scope="col">Active</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {fetchAuthors.authors.map((author, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                        >
                            <td
                                key={1000 + (rowIndex * 100) + 1}
                                onClick={props.handleEdit ? () => handleEdit(author) : undefined}
                            >
                                {author._title}
                            </td>
                            {props.showPrincipal ? (
                                <td key={1000 + (rowIndex * 100) + 2}>
                                    {listValue(author.principal)}
                                </td>
                            ) : null }
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(author.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {author.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {(props.handleEdit) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleEdit(author)}
                                        size="sm"
                                        type="button"
                                        variant="primary"
                                    >Edit</Button>
                                ) : null }
                                {(props.handleExclude) ? (
                                    <Button
                                        className="me-1"
                                        disabled={!included(author)}
                                        onClick={() => handleExclude(author)}
                                        size="sm"
                                        type="button"
                                        variant="primary"
                                    >Exclude</Button>
                                ) : null }
                                {(props.handleInclude) ? (
                                    <Button
                                        className="me-1"
                                        disabled={included(author)}
                                        onClick={() => handleInclude(author)}
                                        size="sm"
                                        type="button"
                                        variant="primary"
                                    >Include</Button>
                                ) : null }
                                {props.handleShowSeries || props.handleShowStories || props.handleShowVolumes ? (
                                    <span className="ms-1 me-2">|</span>
                                ) : null }
                                {(props.handleShowSeries) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleShowSeries(author)}
                                        size="sm"
                                        type="button"
                                        variant="success"
                                    >Series</Button>
                                ) : null }
                                {(props.handleShowStories) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleShowStories(author)}
                                        size="sm"
                                        type="button"
                                        variant="success"
                                    >Stories</Button>
                                ) : null }
                                {(props.handleShowVolumes) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleShowVolumes(author)}
                                        size="sm"
                                        type="button"
                                        variant="success"
                                    >Volumes</Button>
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

export default AuthorOptions;

// AuthorsList -----------------------------------------------------------------

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
import {HandleBoolean, HandleAuthor, HandleValue, OnAction} from "../../types";
import useFetchAuthors from "../../hooks/useFetchAuthors";
import Author from "../../models/Author";
import Library from "../../models/Library";
import Series from "../../models/Series";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    canInsert?: boolean;                // Can this user add Authors? [false]
    handleAdd: OnAction;                // Handle request to add a Author
    handleEdit?: HandleAuthor;          // Handle request to edit a Author [no handler]
    handleExclude?: HandleAuthor;       // Handle request to exclude a Author [no handler]
    handleInclude?: HandleAuthor;       // Handle request to include a Author [no handler]
    handleSelect?: HandleAuthor;        // Handle request to select a Author [no handler]
    included?: (author: Author) => boolean; // Is this Author included in parent? [true]
    parent: Library | Series | Story | Volume; // Parent object for Authors
}

// Component Details ---------------------------------------------------------

const AuthorsList = (props: Props) => {

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
            context: "AuthorsList.useEffect",
            parent: Abridgers.ANY(props.parent),
        });
    }, [props.parent, fetchAuthors.authors,
            libraryContext.library.id, loginContext.data.loggedIn]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
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

    const handleNext: OnAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: OnAction = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleSelect: HandleAuthor = (theAuthor) => {
        if (props.handleSelect) {
            props.handleSelect(theAuthor);
        }
    }

    const included = (theAuthor: Author): boolean => {
        if (props.included) {
            return props.included(theAuthor);
        } else {
            return true;
        }
    }

    const parentModel = props.parent ? props.parent._model : libraryContext.library._model;

    const parentTitle = props.parent ? props.parent._title : libraryContext.library._title;

    // @ts-ignore
    return (
        <Container fluid id="AuthorsList">

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
                        disabled={!props.canInsert}
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
                            {`Authors for ${parentModel}: ${parentTitle}`}
                        </th>
                    </tr>
                    <tr className="table-secondary">
                        <th scope="col">Name</th>
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
                                onClick={() => handleSelect(author)}
                            >
                                {author.lastName}, {author.firstName}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {listValue(author.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {author.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {(props.handleEdit) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleEdit(author)}
                                        size="sm"
                                        type="button"
                                        variant="secondary"
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
                                {(props.handleSelect) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleSelect(author)}
                                        size="sm"
                                        type="button"
                                        variant="secondary"
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
                        disabled={!props.canInsert}
                        onClick={props.handleAdd}
                        size="sm"
                        variant="primary"
                    >Add</Button>
                </Col>
            </Row>

        </Container>
    )

}

export default AuthorsList;

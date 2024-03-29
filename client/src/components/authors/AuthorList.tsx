// AuthorList -----------------------------------------------------------------

// List Authors that match search criteria, offering callbacks for adding,
// editing, and removing Authors.  Optionally, include relevant actions.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {AddButton, BackButton, CheckBox, EditButton, Pagination, SearchBar, TextButton} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import FetchingProgress from "../shared/FetchingProgress";
import {HandleAction, HandleBoolean, HandleAuthor, HandleValue, Parent} from "../../types";
import useFetchAuthors from "../../hooks/useFetchAuthors";
import useFetchFocused from "../../hooks/useFetchFocused";
import Author from "../../models/Author";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";
import Series from "../../models/Series";
import Story from "../../models/Story";
import Volume from "../../models/Volume";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add an Author [not allowed]
    handleEdit?: HandleAuthor;          // Handle request to edit an Author [not allowed]
    handleExclude?: HandleAuthor;       // Handle request to exclude an Author [not allowed]
    handleInclude?: HandleAuthor;       // Handle request to include an Author [not allowed]
    handleReturn?: HandleAction;        // Handle request to leave segment [no handler]
    handleShowSeries?: HandleAuthor;    // Handle request to show related Series [not allowed]
    handleShowStories?: HandleAuthor;   // Handle request to show related Stories [not allowed]
    handleShowVolumes?: HandleAuthor;   // Handle request to show related Volumes [not allowed]
    parent: Parent;                     // Parent object for Authors
    showPrincipal?: boolean;            // Show the Principal column? [false]
}

// Component Details ---------------------------------------------------------

const AuthorList = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 100;
    const [refresh, setRefresh] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>("");

    const fetchAuthors = useFetchAuthors({
        active: active,
        alertPopup: false,
        currentPage: currentPage,
        name: (searchText.length > 0) ? searchText : undefined,
        pageSize: pageSize,
        parent: props.parent,
        withSeries: true,
        withStories: true,
        withVolumes: true,
    });
    const fetchFocused = useFetchFocused({
        focusee: props.parent,
    });

    const canAdd = loginContext.data.loggedIn && props.handleAdd;

    useEffect(() => {
        logger.debug({
            context: "AuthorList.useEffect",
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
        fetchAuthors.authors, fetchFocused.focused]);

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
            //fetchAuthors.refresh();
            //fetchFocused.refresh();
            //setRefresh(true);
            // NOTE - Messing with fetchFocused.focused is really lame
            // @ts-ignore
            if (fetchFocused.focused.authors) {
                let found = -1;
                // @ts-ignore
                fetchFocused.focused.authors.forEach((author, index) => {
                    if (theAuthor.id === author.id) {
                        found = index;
                    }
                });
                if (found >= 0) {
                    // @ts-ignore
                    fetchFocused.focused.authors.splice(found, 1);
                }
            }
        }
    }

    const handleInclude: HandleAuthor = (theAuthor) => {
        if (props.handleInclude) {
            props.handleInclude(theAuthor);
            //fetchAuthors.refresh();
            //fetchFocused.refresh();
            //setRefresh(true);
            // NOTE - Messing with fetchFocused.focused is really lame
            // @ts-ignore
            if (fetchFocused.focused.authors) {
                // @ts-ignore
                fetchFocused.focused.authors.push(theAuthor);
            }
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

    // Is this Author included in its parent?
    const included = (theAuthor: Author): boolean => {
        let result = false;
        if (props.parent) {
            if ((fetchFocused.focused instanceof Series)
                    || (fetchFocused.focused instanceof Story)
                    || (fetchFocused.focused instanceof Volume)) {
                if (fetchFocused.focused.authors) {
                    fetchFocused.focused.authors.forEach(author => {
                        if (theAuthor.id === author.id) {
                            result = true;
                        }
                    })
                }
            }
        } else {
            result = true; // No parent ==> in Library ==> true
        }
        return result;
    }

    return (
        <Container fluid id="AuthorList">

            <FetchingProgress
                error={fetchAuthors.error}
                loading={fetchAuthors.loading}
                message="Fetching selected Authors"
            />

            <Row className="mb-3">
                {props.handleReturn ? (
                    <Col className="text-start">
                        <BackButton
                            handleBack={props.handleReturn}
                        />
                    </Col>
                ) : <Col/> }
                <Col className="text-center">
                    <strong>
                    <span>Manage Authors for {props.parent._model}:&nbsp;</span>
                    <span className="text-info" data-testid="parentTitle">{props.parent._title}</span>
                    </strong>
                </Col>
                <Col/>
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
                    <AddButton
                        disabled={!canAdd}
                        handleAdd={props.handleAdd ? props.handleAdd : undefined}
                        testId="add0"
                    />
                </Col>
            </Row>

            <Row className="g-2">
                <Table
                    //bordered={true}
                    className="align-middle"
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
                                    <EditButton
                                        className="me-1"
                                        handleEdit={() => handleEdit(author)}
                                        variant="primary"
                                    />
                                ) : null }
                                {(props.handleExclude) ? (
                                    <TextButton
                                        className="me-1"
                                        disabled={!included(author)}
                                        handleText={() => handleExclude(author)}
                                        text="Exclude"
                                        variant="primary"
                                    />
                                ) : null }
                                {(props.handleInclude) ? (
                                    <TextButton
                                        className="me-1"
                                        disabled={!included(author)}
                                        handleText={() => handleInclude(author)}
                                        text="Include"
                                        variant="primary"
                                    />
                                ) : null }
                                {props.handleShowSeries || props.handleShowStories || props.handleShowVolumes ? (
                                    <span className="me-1">|</span>
                                ) : null }
                                {(props.handleShowSeries) ? (
                                    <TextButton
                                        className="me-1"
                                        handleText={() => handleShowSeries(author)}
                                        text="Series"
                                        variant="success"
                                    />
                                ) : null }
                                {(props.handleShowStories) ? (
                                    <TextButton
                                        className="me-1"
                                        handleText={() => handleShowStories(author)}
                                        text="Stories"
                                        variant="success"
                                    />
                                ) : null }
                                {(props.handleShowVolumes) ? (
                                    <TextButton
                                        className="me-1"
                                        handleText={() => handleShowVolumes(author)}
                                        text="Volumes"
                                        variant="success"
                                    />
                                ) : null }
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

            <Row className="mb-3">
                <Col className="text-end">
                    <AddButton
                        disabled={!canAdd}
                        handleAdd={props.handleAdd ? props.handleAdd : undefined}
                        testId="add1"
                    />
                </Col>
            </Row>

        </Container>
    )

}

export default AuthorList;

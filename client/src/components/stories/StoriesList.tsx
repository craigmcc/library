// StoriesList -----------------------------------------------------------------

// List Stories that match search criteria, offering callbacks for adding,
// editing, and removing Stories.  Optionally, include relevant actions.

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
import {HandleAction, HandleBoolean, HandleStory, HandleValue, Parent} from "../../types";
import useFetchStories from "../../hooks/useFetchStories";
import Story from "../../models/Story";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {authorsNames, listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a Story [not allowed]
    handleEdit?: HandleStory;           // Handle request to edit a Story [not allowed]
    handleExclude?: HandleStory;        // Handle request to exclude a Story [not allowed]
    handleInclude?: HandleStory;        // Handle request to include a Story [not allowedd]
    handleSelect?: HandleStory;         // Handle request to select a Story [not allowed]
    included?: (story: Story) => boolean; // Is this Story included in parent? [true]
    parent: Parent;                     // Parent object for Stories
    showOrdinal?: boolean;              // Show the Principal column? [false]
}

// Component Details ---------------------------------------------------------

const StoriesList = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(100);
    const [searchText, setSearchText] = useState<string>("");

    const fetchStories = useFetchStories({
        active: active,
        currentPage: currentPage,
        name: (searchText.length > 0) ? searchText : undefined,
        pageSize: pageSize,
        parent: props.parent,
        withAuthors: true, // Since we are showing author names in the list
    });

    useEffect(() => {
        logger.info({
            context: "StoriesList.useEffect",
            parent: Abridgers.ANY(props.parent),
            active: active,
            name: searchText,
        });
    }, [active, searchText, props.parent,
        fetchStories.stories,
        libraryContext.library, libraryContext.library.id,
        loginContext.data.loggedIn]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleChange: HandleValue = (theSearchText) => {
        setSearchText(theSearchText);
    }

    const handleEdit: HandleStory = (theStory) => {
        if (props.handleEdit) {
            props.handleEdit(theStory);
        }
    }

    const handleExclude: HandleStory = (theStory) => {
        if (props.handleExclude) {
            props.handleExclude(theStory);
        }
    }

    const handleInclude: HandleStory = (theStory) => {
        if (props.handleInclude) {
            props.handleInclude(theStory);
        }
    }

    const handleNext: HandleAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: HandleAction = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleSelect: HandleStory = (theStory) => {
        if (props.handleSelect) {
            props.handleSelect(theStory);
        }
    }

    const included = (theStory: Story): boolean => {
        if (props.included) {
            return props.included(theStory);
        } else {
            return true;
        }
    }

    // @ts-ignore
    return (
        <Container fluid id="StoriesList">

            <Row className="mb-3">
                <Col className="col-6">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        htmlSize={50}
                        label="Search For Stories:"
                        placeholder="Search by all or part of name"
                    />
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        label="Active Stories Only?"
                        name="activeOnly"
                        value={active}
                    />
                </Col>
                <Col className="text-end">
                    <Pagination
                        currentPage={currentPage}
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        lastPage={(fetchStories.stories.length === 0) ||
                        (fetchStories.stories.length < pageSize)}
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
                            {`Stories for ${props.parent._model}: ${props.parent._title}`}
                        </th>
                    </tr>
                    <tr className="table-secondary">
                        <th scope="col">Name</th>
                        {props.showOrdinal ? (
                            <th scope="col">Ordinal</th>
                        ) : null }
                        <th scope="col">Authors</th>
                        <th scope="col">Active</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {fetchStories.stories.map((story, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                        >
                            <td
                                key={1000 + (rowIndex * 100) + 1}
                                onClick={props.handleSelect ? () => handleSelect(story) : undefined}
                            >
                                {story.name}
                            </td>
                            {props.showOrdinal ? (
                                <td key={1000 + (rowIndex * 100) + 2}>
                                    {listValue(story.ordinal)}
                                </td>
                            ) : null }
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {authorsNames(story.authors)}
                            </td>

                            <td key={1000 + (rowIndex * 100) + 4}>
                                {listValue(story.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {story.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 6}>
                                {(props.handleEdit) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleEdit(story)}
                                        size="sm"
                                        type="button"
                                        variant="secondary"
                                    >Edit</Button>
                                ) : null }
                                {(props.handleExclude) ? (
                                    <Button
                                        className="me-1"
                                        disabled={!included(story)}
                                        onClick={() => handleExclude(story)}
                                        size="sm"
                                        type="button"
                                        variant="primary"
                                    >Exclude</Button>
                                ) : null }
                                {(props.handleInclude) ? (
                                    <Button
                                        className="me-1"
                                        disabled={included(story)}
                                        onClick={() => handleInclude(story)}
                                        size="sm"
                                        type="button"
                                        variant="primary"
                                    >Include</Button>
                                ) : null }
                                {(props.handleSelect) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleSelect(story)}
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

export default StoriesList;

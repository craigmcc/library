// StoryList -----------------------------------------------------------------

// List Stories that match search criteria, offering callbacks for adding,
// editing, and removing Story.  Optionally, include relevant actions.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {CheckBox, Pagination, SearchBar} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import AddButton from "../general/AddButton";
import BackButton from "../general/BackButton";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import FetchingProgress from "../shared/FetchingProgress";
import {HandleAction, HandleBoolean, HandleStory, HandleValue, Parent} from "../../types";
import useFetchFocused from "../../hooks/useFetchFocused";
import useFetchStories from "../../hooks/useFetchStories";
import Author from "../../models/Author";
import Series from "../../models/Series";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {authorsNames, listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a Story [not allowed]
    handleEdit?: HandleStory;           // Handle request to edit a Story [not allowed]
    handleExclude?: HandleStory;        // Handle request to exclude a Story [not allowed]
    handleInclude?: HandleStory;        // Handle request to include a Story [not allowed]
    handleReturn?: HandleAction;        // Handle request to leave segment [no handler]
    handleShowAuthors?: HandleStory;    // Handle request to show related Authors [not allowed]
    handleShowSeries?: HandleStory;     // Handle request to show related Stories [not allowed]
    handleShowVolumes?: HandleStory;    // Handle request to show related Volumes [not allowed]
    parent: Parent;                     // Parent object for Stories
    showOrdinal?: boolean;              // Show the Ordinal field? [false]
}

// Component Details ---------------------------------------------------------

const StoryList = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 100;
    const [refresh, setRefresh] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>("");

    const fetchFocused = useFetchFocused({
        focusee: props.parent,
    });
    const fetchStories = useFetchStories({
        active: active,
        alertPopup: false,
        currentPage: currentPage,
        name: (searchText.length > 0) ? searchText : undefined,
        pageSize: pageSize,
        parent: props.parent,
        withAuthors: true,
        withSeries: true,
        withVolumes: true,
    });

    const canAdd = loginContext.data.loggedIn && props.handleAdd;

    useEffect(() => {
        logger.debug({
            context: "StoryList.useEffect",
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
        fetchStories.stories]);

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
            //fetchStories.refresh();
            //fetchFocused.refresh();
            //setRefresh(true);
            // NOTE - Messing with fetchFocused.focused is really lame
            // @ts-ignore
            if (fetchFocused.focused.stories) {
                let found = -1;
                // @ts-ignore
                fetchFocused.focused.stories.forEach((story, index) => {
                    if (theStory.id === story.id) {
                        found = index;
                    }
                });
                if (found >= 0) {
                    // @ts-ignore
                    fetchFocused.focused.stories.splice(found, 1);
                }

            }
        }
    }

    const handleInclude: HandleStory = (theStory) => {
        if (props.handleInclude) {
            props.handleInclude(theStory);
            //fetchStories.refresh();
            //fetchFocused.refresh();
            //setRefresh(true);
            // NOTE - Messing with fetchFocused.focused is really lame
            // @ts-ignore
            if (fetchFocused.focused.stories) {
                // @ts-ignore
                fetchFocused.focused.stories.push(theStory);
            }
        }
    }

    const handleNext: HandleAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: HandleAction = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleShowAuthors: HandleStory = (theStory) => {
        if (props.handleShowAuthors) {
            props.handleShowAuthors(theStory);
        }
    }

    const handleShowSeries: HandleStory = (theStory) => {
        if (props.handleShowSeries) {
            props.handleShowSeries(theStory);
        }
    }

    const handleShowVolumes: HandleStory = (theStory) => {
        if (props.handleShowVolumes) {
            props.handleShowVolumes(theStory);
        }
    }

    // Is this Story included in its parent?
    const included = (theStory: Story): boolean => {
        let result = false;
        if (props.parent) {
            if ((fetchFocused.focused instanceof Author)
                || (fetchFocused.focused instanceof Series)
                || (fetchFocused.focused instanceof Volume)) {
                if (fetchFocused.focused.stories) {
                    fetchFocused.focused.stories.forEach(story => {
                        if (theStory.id === story.id) {
                            result = true;
                        }
                    });
                }
            }
        }
        return result;
    }

    return (
        <Container fluid id="StoryList">

            <FetchingProgress
                error={fetchStories.error}
                loading={fetchStories.loading}
                message="Fetching selected Stories"
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
                    <span>Manage Stories for {props.parent._model}:&nbsp;</span>
                    <span className="text-info">{props.parent._title}</span>
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
                                {`Stories for ${libraryContext.library._model}: ${libraryContext.library._title}`}
                            </th>
                        ) : (
                            <th
                                className="text-center"
                                colSpan={99}
                            >
                                {`Stories for ${props.parent._model}: ${props.parent._title}`}
                            </th>
                        )}

                    </tr>
                    <tr className="table-secondary">
                        <th scope="col">Name</th>
                        {(props.showOrdinal) ? (
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
                                onClick={props.handleEdit ? (() => handleEdit(story)) : undefined}
                            >
                                {story._title}
                            </td>
                            {(props.showOrdinal) ? (
                                <td key={1000 + (rowIndex * 100) + 2}>
                                    {story.ordinal}
                                </td>
                            ) : null}
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
                                        variant="primary"
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
                                {props.handleShowAuthors || props.handleShowSeries || props.handleShowVolumes ? (
                                    <span className="ms-1 me-2">|</span>
                                ) : null }
                                {(props.handleShowAuthors) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleShowAuthors(story)}
                                        size="sm"
                                        type="button"
                                        variant="success"
                                    >Authors</Button>
                                ) : null }
                                {(props.handleShowSeries) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleShowSeries(story)}
                                        size="sm"
                                        type="button"
                                        variant="success"
                                    >Series</Button>
                                ) : null }
                                {(props.handleShowVolumes) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleShowVolumes(story)}
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

export default StoryList;

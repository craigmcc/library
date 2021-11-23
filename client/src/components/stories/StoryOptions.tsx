// StoryOptions -------------------------------------------------------------

// List Stories that match search criteria, offering callbacks for adding,
// editing, and removing Story.  Optionally, include relevant actions.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import CheckBox from "../general/CheckBox";
import LoadingProgress from "../general/LoadingProgress";
import Pagination from "../general/Pagination";
import SearchBar from "../general/SearchBar";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
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
    handleBack?: HandleAction;          // Handle request to leave segment [no handler]
    handleEdit?: HandleStory;           // Handle request to edit a Story [not allowed]
    handleExclude?: HandleStory;        // Handle request to exclude a Story [not allowed]
    handleInclude?: HandleStory;        // Handle request to include a Story [not allowed]
    handleShowAuthors?: HandleStory;    // Handle request to show related Authors [not allowed]
    handleShowSeries?: HandleStory;     // Handle request to show related Stories [not allowed]
    handleShowVolumes?: HandleStory;    // Handle request to show related Volumes [not allowed]
    parent: Parent;                     // Parent object for Stories
}

// Component Details ---------------------------------------------------------

const StoryOptions = (props: Props) => {

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

    useEffect(() => {
        logger.info({
            context: "StoryOptions.useEffect",
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

    const handleBack: HandleAction = () => {
        if (props.handleBack) {
            props.handleBack();
        }
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
            // TODO - Messing with fetchFocused.focused is really lame
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
            // TODO - Messing with fetchFocused.focused is really lame
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
        <Container fluid id="StoryOptions">

            <LoadingProgress
                error={fetchStories.error}
                loading={fetchStories.loading}
                title="Selected Stories"
            />

            <Row className="mb-3">
                <Col/>
                <Col className="text-center">
                    <span>Manage Stories for {props.parent._model}:&nbsp;</span>
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
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {authorsNames(story.authors)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(story.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {story.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
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

export default StoryOptions;

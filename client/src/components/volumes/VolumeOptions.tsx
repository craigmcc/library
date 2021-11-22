// VolumeOptions -------------------------------------------------------------

// List Volumes that match search criteria, offering callbacks for adding,
// editing, and removing Volume.  Optionally, include relevant actions.

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
import {HandleAction, HandleBoolean, HandleValue, HandleVolume, Parent} from "../../types";
import useFetchFocused from "../../hooks/useFetchFocused";
import useFetchVolumes from "../../hooks/useFetchVolumes";
import Author from "../../models/Author";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {authorsNames, listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a Volume [not allowed]
    handleBack?: HandleAction;          // Handle request to leave segment [no handler]
    handleEdit?: HandleVolume;          // Handle request to edit a Volume [not allowed]
    handleExclude?: HandleVolume;       // Handle request to exclude a Volume [not allowed]
    handleInclude?: HandleVolume;       // Handle request to include a Volume [not allowed]
    handleShowAuthors?: HandleVolume;   // Handle request to show related Authors [not allowed]
    handleShowStories?: HandleVolume;   // Handle request to show related Stories [not allowed]
    parent: Parent;                     // Parent object for Volumes
}

// Component Details ---------------------------------------------------------

const VolumeOptions = (props: Props) => {

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
    const fetchVolumes = useFetchVolumes({
        active: active,
        currentPage: currentPage,
        name: (searchText.length > 0) ? searchText : undefined,
        pageSize: pageSize,
        parent: props.parent,
        withAuthors: true,
        withStories: true,
    });

    useEffect(() => {
        logger.info({
            context: "VolumeOptions.useEffect",
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
        fetchVolumes.volumes]);

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

    const handleEdit: HandleVolume = (theVolume) => {
        if (props.handleEdit) {
            props.handleEdit(theVolume);
        }
    }

    const handleExclude: HandleVolume = (theVolume) => {
        if (props.handleExclude) {
            props.handleExclude(theVolume);
            //fetchVolumes.refresh();
            //fetchFocused.refresh();
            //setRefresh(true);
            // TODO - Messing with fetchFocused.focused is really lame
            // @ts-ignore
            if (fetchFocused.focused.volumes) {
                let found = -1;
                // @ts-ignore
                fetchFocused.focused.volumes.forEach((volume, index) => {
                    if (theVolume.id === volume.id) {
                        found = index;
                    }
                });
                if (found >= 0) {
                    // @ts-ignore
                    fetchFocused.focused.volumes.splice(found, 1);
                }

            }
        }
    }

    const handleInclude: HandleVolume = (theVolume) => {
        if (props.handleInclude) {
            props.handleInclude(theVolume);
            //fetchVolumes.refresh();
            //fetchFocused.refresh();
            //setRefresh(true);
            // TODO - Messing with fetchFocused.focused is really lame
            // @ts-ignore
            if (fetchFocused.focused.volumes) {
                // @ts-ignore
                fetchFocused.focused.volumes.push(theVolume);
            }
        }
    }

    const handleNext: HandleAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: HandleAction = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleShowAuthors: HandleVolume = (theVolume) => {
        if (props.handleShowAuthors) {
            props.handleShowAuthors(theVolume);
        }
    }

    const handleShowStories: HandleVolume = (theVolume) => {
        if (props.handleShowStories) {
            props.handleShowStories(theVolume);
        }
    }

    // Is this Volume included in its parent?
    const included = (theVolume: Volume): boolean => {
        let result = false;
        if (props.parent) {
            if ((fetchFocused.focused instanceof Author)
                || (fetchFocused.focused instanceof Story)) {
                if (fetchFocused.focused.volumes) {
                    fetchFocused.focused.volumes.forEach(volume => {
                        if (theVolume.id === volume.id) {
                            result = true;
                        }
                    });
                }
            }
        }
        return result;
    }

    return (
        <Container fluid id="VolumeOptions">

            <Row className="mb-3">
                <Col/>
                <Col className="text-center">
                    <span>Manage Volumes for {props.parent._model}:&nbsp;</span>
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
                        label="Search For Volumes:"
                        placeholder="Search by all or part of name"
                    />
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        label="Active Volumes Only?"
                        name="activeOnly"
                        value={active}
                    />
                </Col>
                <Col className="text-end">
                    <Pagination
                        currentPage={currentPage}
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        lastPage={(fetchVolumes.volumes.length === 0) ||
                            (fetchVolumes.volumes.length < pageSize)}
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
                                {`Volumes for ${libraryContext.library._model}: ${libraryContext.library._title}`}
                            </th>
                        ) : (
                            <th
                                className="text-center"
                                colSpan={99}
                            >
                                {`Volumes for ${props.parent._model}: ${props.parent._title}`}
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
                    {fetchVolumes.volumes.map((volume, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                        >
                            <td
                                key={1000 + (rowIndex * 100) + 1}
                                onClick={props.handleEdit ? (() => handleEdit(volume)) : undefined}
                            >
                                {volume._title}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {authorsNames(volume.authors)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(volume.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {volume.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {(props.handleEdit) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleEdit(volume)}
                                        size="sm"
                                        type="button"
                                        variant="primary"
                                    >Edit</Button>
                                ) : null }
                                {(props.handleExclude) ? (
                                    <Button
                                        className="me-1"
                                        disabled={!included(volume)}
                                        onClick={() => handleExclude(volume)}
                                        size="sm"
                                        type="button"
                                        variant="primary"
                                    >Exclude</Button>
                                ) : null }
                                {(props.handleInclude) ? (
                                    <Button
                                        className="me-1"
                                        disabled={included(volume)}
                                        onClick={() => handleInclude(volume)}
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
                                        onClick={() => handleShowAuthors(volume)}
                                        size="sm"
                                        type="button"
                                        variant="success"
                                    >Authors</Button>
                                ) : null }
                                {(props.handleShowStories) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleShowStories(volume)}
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

export default VolumeOptions;
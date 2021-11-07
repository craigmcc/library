// VolumesList -----------------------------------------------------------------

// List Volumes that match search criteria, offering callbacks for adding,
// editing, and removing Volumes.  Optionally, include relevant actions.

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
import {HandleBoolean, HandleVolume, HandleValue, OnAction} from "../../types";
import useFetchVolumes from "../../hooks/useFetchVolumes";
import Author from "../../models/Author";
import Story from "../../models/Story";
import logger from "../../util/ClientLogger";
import {authorsNames, listValue} from "../../util/Transformations";
import Volume from "../../models/Volume";

// Incoming Properties -------------------------------------------------------

export interface Props {
    canInsert?: boolean;                // Can this user add Volumes? [false]
    handleAdd: OnAction;                // Handle request to add a Volume
    handleEdit?: HandleVolume;          // Handle request to edit a Volume [no handler]
    handleExclude?: HandleVolume;       // Handle request to exclude a Volume [no handler]
    handleInclude?: HandleVolume;       // Handle request to include a Volume [no handler]
    handleSelect?: HandleVolume;        // Handle request to select a Volume [no handler]
    included?: (volume: Volume) => boolean; // Is this Volume included in parent? [true]
    parent?: Author | Story;            // Parent object for Volumes [owning Library]
}

// Component Details ---------------------------------------------------------

const VolumesList = (props: Props) => {

    const libraryContext = useContext(LibraryContext);

    const [active, setActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(100);
    const [searchText, setSearchText] = useState<string>("");

    const fetchVolumes = useFetchVolumes({
        active: active,
        currentPage: currentPage,
        name: (searchText.length > 0) ? searchText : undefined,
        pageSize: pageSize,
        parent: props.parent,
        withAuthors: true,  // Since we are showing author names in the list
    });

    useEffect(() => {

        logger.debug({
            context: "VolumesList.useEffect"
        });

    }, [libraryContext.library.id, fetchVolumes.volumes]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
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
        }
    }

    const handleInclude: HandleVolume = (theVolume) => {
        if (props.handleInclude) {
            props.handleInclude(theVolume);
        }
    }

    const handleNext: OnAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: OnAction = () => {
        setCurrentPage(currentPage - 1);
    }

    const handleSelect: HandleVolume = (theVolume) => {
        if (props.handleSelect) {
            props.handleSelect(theVolume);
        }
    }

    const included = (theVolume: Volume): boolean => {
        if (props.included) {
            return props.included(theVolume);
        } else {
            return true;
        }
    }

    let title = "Volumes for Library " + libraryContext.library.name;
    if (props.parent && (props.parent instanceof Author)) {
        title = "Volumes for Author " + props.parent.firstName + " " + props.parent.lastName;
    } else if (props.parent && (props.parent instanceof Story)) {
        title = "Volumes for Story " + props.parent.name;
    }

    // @ts-ignore
    return (
        <Container fluid id="VolumesList">

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
                            {title}
                        </th>
                    </tr>
                    <tr className="table-secondary">
                        <th scope="col">Name</th>
                        <th scope="col">Authors</th>
                        <th scope="col">Active</th>
                        <th scope="col">Location</th>
                        <th scope="col">Type</th>
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
                                onClick={() => handleSelect(volume)}
                            >
                                {volume.name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {authorsNames(volume.authors)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(volume.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {volume.location}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {volume.type}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 6}>
                                {volume.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 7}>
                                {(props.handleEdit) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleEdit(volume)}
                                        size="sm"
                                        type="button"
                                        variant="secondary"
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
                                {(props.handleSelect) ? (
                                    <Button
                                        className="me-1"
                                        onClick={() => handleSelect(volume)}
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

export default VolumesList;

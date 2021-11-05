// LibrariesList -----------------------------------------------------------------

// List Libraries that match search criteria, offering callbacks for adding,
// editing, and removing Libraries.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import LibraryContext from "./LibraryContext";
import CheckBox from "../general/CheckBox";
import Pagination from "../general/Pagination";
import SearchBar from "../general/SearchBar";
import LoginContext from "../login/LoginContext";
import {HandleBoolean, HandleLibrary, HandleValue, OnAction, Scope} from "../../types";
import Library from "../../models/Library";
import useFetchLibraries from "../../hooks/useFetchLibraries";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    canInsert: boolean;                 // Can this user add Libraries?
    canRemove: boolean;                 // Can this user remove Libraries?
    canUpdate: boolean;                 // Can this user edit Libraries?
    handleAdd: OnAction;                // Handle request to add a Library
    handleSelect: HandleLibrary;        // Handle request to select a Library
}

// Component Details ---------------------------------------------------------

const LibrariesList = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [availables, setAvailables] = useState<Library[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(100);
    const [searchText, setSearchText] = useState<string>("");

    const fetchLibraries = useFetchLibraries({
        active: active,
        currentPage: currentPage,
        name: (searchText.length > 0) ? searchText : undefined,
        pageSize: pageSize,
    });

    useEffect(() => {

        logger.debug({
            context: "LibrariesList.useEffect"
        });

        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        if (isSuperuser) {
            setAvailables(fetchLibraries.libraries);
        } else {
            setAvailables(libraryContext.libraries);
        }

    }, [libraryContext.libraries, fetchLibraries.libraries, loginContext]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleChange: HandleValue = (theSearchText) => {
        setSearchText(theSearchText);
    }

    const handleNext: OnAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: OnAction = () => {
        setCurrentPage(currentPage - 1);
    }

    return (
        <Container fluid id="LibrariesList">

            <Row className="mb-3">
                <Col className="col-6">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        htmlSize={50}
                        label="Search For Libraries:"
                        placeholder="Search by all or part of name"
                    />
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        label="Active Libraries Only?"
                        name="activeOnly"
                        value={active}
                    />
                </Col>
                <Col className="text-end">
                    <Pagination
                        currentPage={currentPage}
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        lastPage={(fetchLibraries.libraries.length === 0) ||
                            (fetchLibraries.libraries.length < pageSize)}
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
                    <tr className="table-secondary">
                        <th scope="col">Name</th>
                        <th scope="col">Active</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Scope</th>
                    </tr>
                    </thead>

                    <tbody>
                    {availables.map((library, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                            onClick={() => props.handleSelect(library)}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {library.name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {listValue(library.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {library.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {library.scope}
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

export default LibrariesList;

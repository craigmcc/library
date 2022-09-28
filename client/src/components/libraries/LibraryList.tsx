// LibraryList ---------------------------------------------------------------

// List Libraries that match search criteria, offering callbacks for adding,
// editing, and removing Libraries.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {PlusCircleFill} from "react-bootstrap-icons";
import {CheckBox, Pagination, SearchBar} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import LibraryContext from "./LibraryContext";
import LoginContext from "../login/LoginContext";
import FetchingProgress from "../shared/FetchingProgress";
import {HandleAction, HandleBoolean, HandleLibrary, HandleValue, Scope} from "../../types";
import useFetchLibraries from "../../hooks/useFetchLibraries";
import Library from "../../models/Library";
import logger from "../../util/ClientLogger";
import {listValue} from "../../util/Transformations";
import Button from "react-bootstrap/Button";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a Library [not allowed]
    handleEdit?: HandleLibrary;         // Handle request to edit a Library [not allowed]
}

// Component Details ---------------------------------------------------------

const LibraryList = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [availables, setAvailables] = useState<Library[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 100;
    const [searchText, setSearchText] = useState<string>("");

    const fetchLibraries = useFetchLibraries({
        active: active,
        alertPopup: false,
        currentPage: currentPage,
        name: (searchText.length > 0) ? searchText : undefined,
        pageSize: pageSize,
    });

    const canAdd = loginContext.data.loggedIn && props.handleAdd;

    useEffect(() => {

        logger.debug({
            context: "LibraryOptions.useEffect",
            active: active,
            name: searchText,
        });

        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        if (isSuperuser) {
            setAvailables(fetchLibraries.libraries);
        } else {
            setAvailables(libraryContext.libraries);
        }

    }, [libraryContext.libraries, loginContext, loginContext.data.loggedIn,
        active, searchText,
        fetchLibraries.libraries]);

    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    const handleChange: HandleValue = (theSearchText) => {
        setSearchText(theSearchText);
    }

    const handleEdit: HandleLibrary = (theLibrary) => {
        if (props.handleEdit) {
            props.handleEdit(theLibrary);
        }
    }

    const handleNext: HandleAction = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePrevious: HandleAction = () => {
        setCurrentPage(currentPage - 1);
    }

    return (
        <Container fluid id="LibraryOptions">

            <FetchingProgress
                error={fetchLibraries.error}
                loading={fetchLibraries.loading}
                message="Fetching selected Libraries"
            />

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
                        lastPage={(availables.length === 0) ||
                            (availables.length < pageSize)}
                        variant="secondary"
                    />
                </Col>
                <Col className="text-end">
                    <Button
                        data-testid="add0"
                        disabled={!canAdd}
                        onClick={canAdd ? props.handleAdd : undefined}
                        variant="outline-dark"
                    >
                        <PlusCircleFill size={32}/>
                    </Button>
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
                            onClick={props.handleEdit ? (() => handleEdit(library)) : undefined}
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
                        data-testid="add1"
                        disabled={!canAdd}
                        onClick={canAdd ? props.handleAdd : undefined}
                        variant="outline-dark"
                    >
                        <PlusCircleFill size={32}/>
                    </Button>
                </Col>
            </Row>

        </Container>
    )

}

export default LibraryList;

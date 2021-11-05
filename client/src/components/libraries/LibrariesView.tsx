// LibrariesView -----------------------------------------------------------------

// Top-level view for managing Library objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import LibraryContext from "./LibraryContext";
import LibraryForm from "./LibraryForm";
import LibrariesList from "./LibrariesList";
import LoginContext from "../login/LoginContext";
import {HandleLibrary, OnAction, Scope} from "../../types";
import useMutateLibrary from "../../hooks/useMutateLibrary";
import Library from "../../models/Library";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

const LibrariesView = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [library, setLibrary] = useState<Library | null>(null);

    const mutateLibrary = useMutateLibrary({});

    useEffect(() => {

        logger.debug({
            context: "LibrariesView.useEffect",
        });

        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isSuperuser);

    }, [loginContext]);

    const handleAdd: OnAction = () => {
        setLibrary(new Library({
            active: true,
            name: null,
            notes: null,
            scope: null,
        }));
    }

    const handleInsert: HandleLibrary = async (theLibrary) => {
        await mutateLibrary.insert(theLibrary);
        libraryContext.handleRefresh();
        setLibrary(null);
    }

    const handleRemove: HandleLibrary = async (theLibrary) => {
        await mutateLibrary.remove(theLibrary);
        libraryContext.handleRefresh();
        setLibrary(null);
    }

    const handleSelect: HandleLibrary = (theLibrary) => {
        setLibrary(theLibrary);
    }

    const handleUpdate: HandleLibrary = async (theLibrary) => {
        await mutateLibrary.update(theLibrary);
        libraryContext.handleRefresh();
        setLibrary(null);
    }

    return (
        <Container fluid id="LibrariesView">

            {/* List View */}
            {(!library) ? (
                <>

                    <Row className="mb-3">
                        <Col className="text-start">
                            <span><strong>Select or Add Library</strong></span>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <LibrariesList
                            canInsert={canInsert}
                            canRemove={canRemove}
                            canUpdate={canUpdate}
                            handleAdd={handleAdd}
                            handleSelect={handleSelect}
                        />
                    </Row>

                </>
            ) : null }

            {/* Detail View */}
            {(library) ? (
                <>

                    <Row className="mb-3">
                        <Col className="text-start">
                            {(library.id > 0) ? (
                                <span><strong>Edit Existing</strong></span>
                            ) : (
                                <span><strong>Add New</strong></span>
                            )}
                            <span><strong>&nbsp;Library</strong></span>
                        </Col>
                        <Col className="text-end">
                            <Button
                                onClick={() => setLibrary(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <Row className="mb-3 ms-1 me-1">
                        <LibraryForm
                            autoFocus={true}
                            canRemove={canRemove}
                            canSave={canInsert || canUpdate || loginContext.validateLibrary(library, Scope.ADMIN)}
                            handleInsert={handleInsert}
                            handleRemove={handleRemove}
                            handleUpdate={handleUpdate}
                            library={library}
                        />
                    </Row>

                </>
            ) : null }

        </Container>
    )

}

export default LibrariesView;

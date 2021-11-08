// AuthorsStage --------------------------------------------------------------

// Manage selection of an Author to be processed for subsequent stages, while
// also supporting CRUD management of an individual Author.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import AuthorForm from "./AuthorForm";
import AuthorsList from"./AuthorsList";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleAuthor, Scope} from "../../types";
import useMutateAuthor from "../../hooks/useMutateAuthor";
import Author from "../../models/Author";
import Library from "../../models/Library";
import Series from "../../models/Series";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAuthor: HandleAuthor;         // Handle selecting Author
    parent: Library | Series | Story | Volume; // Parent object for Authors
}

// Component Details ---------------------------------------------------------

const AuthorsStage = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [author, setAuthor] = useState<Author | null>(null);
    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canSave, setCanSave] = useState<boolean>(false);

    const mutateAuthor = useMutateAuthor({});

    useEffect(() => {
        logger.info({
            context: "AuthorsStage.useEffect",
            parent: Abridgers.ANY(props.parent),
        });
        setCanInsert(loginContext.validateLibrary(libraryContext.library));
        setCanRemove(loginContext.validateScope(Scope.SUPERUSER));
        setCanSave(loginContext.validateLibrary(libraryContext.library));
    }, [props.parent,
        libraryContext.library, libraryContext.library.id,
        loginContext, loginContext.data.loggedIn]);

    const handleAdd: HandleAction = () => {
        const theAuthor = new Author({
            active: true,
            firstName: null,
            lastName: null,
            libraryId: libraryContext.library.id,
            notes: null,
        });
        logger.debug({
            context: "AuthorsStage.handleAdd",
            author: theAuthor,
        });
        setAuthor(theAuthor);
    }

    const handleEdit: HandleAuthor = async (theAuthor) => {
        logger.debug({
            context: "AuthorsStage.handleEdit",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthor(theAuthor);
    }

    const handleInsert: HandleAuthor = async (theAuthor) => {
        logger.debug({
            context: "AuthorsStage.handleInsert",
            author: Abridgers.AUTHOR(theAuthor),
        });
        const inserted = await mutateAuthor.insert(theAuthor);
        handleSelect(inserted);
    }

    const handleRemove: HandleAuthor = async (theAuthor) => {
        logger.debug({
            context: "AuthorsStage.handleRemove",
            author: Abridgers.AUTHOR(theAuthor),
        });
        /* const removed = */ await mutateAuthor.remove(theAuthor);
        setAuthor(null); // TODO - trigger refresh somehow?
    }

    const handleSelect: HandleAuthor = (theAuthor) => {
        logger.debug({
            context: "AuthorssStage.handleSelect",
            author: Abridgers.AUTHOR(theAuthor),
        });
        props.handleAuthor(theAuthor);
    }

    const handleUpdate: HandleAuthor = async (theAuthor) => {
        logger.debug({
            context: "AuthorsStage.handleUpdate",
            author: Abridgers.AUTHOR(theAuthor),
        });
        /* const updated = */ await mutateAuthor.update(theAuthor);
        setAuthor(null); // TODO - trigger refresh somehow?
    }

    return (
        <Container fluid id="AuthorsStage">

            {/* List View */}
            {(!author) ? (
                <>

                    <Row className="mb-3">
                        <Col className="text-center">
                            <span>Add, Edit, or Select Author for {props.parent._model}: </span>
                            <span className="text-info">{props.parent._title}</span>
                        </Col>
                    </Row>

                    <AuthorsList
                        canInsert={canInsert}
                        handleAdd={handleAdd}
                        handleEdit={handleEdit}
                        handleSelect={handleSelect}
                        parent={props.parent}
                    />

                </>
            ) : null }

            {/* Detail View */}
            {(author) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            {(author.id > 0) ? (
                                <span>Edit Existing</span>
                            ) : (
                                <span>Add New</span>
                            )}
                            &nbsp;Author for {props.parent._model}:&nbsp;
                            <span className="text-info">
                                {props.parent._title}
                            </span>
                        </Col>
                        <Col className="text-end">
                            <Button
                                onClick={() => setAuthor(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <AuthorForm
                        autoFocus
                        canRemove={canRemove}
                        canSave={canSave}
                        handleInsert={handleInsert}
                        handleRemove={handleRemove}
                        handleUpdate={handleUpdate}
                        author={author}
                    />

                </>
            ) : null }

        </Container>
    )

}

export default AuthorsStage;

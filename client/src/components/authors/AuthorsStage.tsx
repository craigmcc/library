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
import {HandleAction, HandleAuthor, Parent, Scope} from "../../types";
import useFetchParent from "../../hooks/useFetchParent";
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
    handleAuthor?: HandleAuthor;        // Handle selecting Author [no handler]
    parent: Parent;                     // Parent object for Authors (pass to useFetchParent)
}

// Component Details ---------------------------------------------------------

const AuthorsStage = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [author, setAuthor] = useState<Author | null>(null);
    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);

    const fetchParent = useFetchParent({
        parent: props.parent,
    });
    const mutateAuthor = useMutateAuthor({});

    useEffect(() => {
        logger.info({
            context: "AuthorsStage.useEffect",
            parent: Abridgers.ANY(props.parent),
        });
        const isAdmin = loginContext.validateLibrary(libraryContext.library, Scope.ADMIN);
        // const isRegular = loginContext.validateLibrary(libraryContext.library, Scope.REGULAR);
        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isAdmin || isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isAdmin || isSuperuser);
    }, [author, props.parent,
        fetchParent.parent,
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
        logger.info({
            context: "AuthorsStage.handleAdd",
            author: theAuthor,
        });
        setAuthor(theAuthor);
    }

    const handleEdit: HandleAuthor = async (theAuthor) => {
        logger.info({
            context: "AuthorsStage.handleEdit",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthor(theAuthor);
    }

    const handleExclude: HandleAuthor = async (theAuthor) => {
        logger.info({
            context: "AuthorsStage.handleExclude",
            author: Abridgers.AUTHOR(theAuthor),
            parent: Abridgers.ANY(fetchParent.parent),
        });
        /* const excluded = */ await mutateAuthor.exclude(theAuthor, fetchParent.parent);
        setAuthor(null);
    }

    const handleInclude: HandleAuthor = async (theAuthor) => {
        logger.info({
            context: "AuthorsStage.handleInclude",
            author: Abridgers.AUTHOR(theAuthor),
            parent: Abridgers.ANY(fetchParent.parent),
        });
        /* const included = */ await mutateAuthor.include(theAuthor, fetchParent.parent);
        fetchParent.refresh();
    }

    const handleInsert: HandleAuthor = async (theAuthor) => {
        logger.info({
            context: "AuthorsStage.handleInsert",
            author: Abridgers.AUTHOR(theAuthor),
        });
        /* const inserted = */ await mutateAuthor.insert(theAuthor);
        fetchParent.refresh();
    }

    const handleRemove: HandleAuthor = async (theAuthor) => {
        logger.info({
            context: "AuthorsStage.handleRemove",
            author: Abridgers.AUTHOR(theAuthor),
        });
        /* const removed = */ await mutateAuthor.remove(theAuthor);
        setAuthor(null); // TODO - trigger refresh somehow?
    }

    const handleSelect: HandleAuthor = (theAuthor) => {
        logger.info({
            context: "AuthorsStage.handleSelect",
            author: Abridgers.AUTHOR(theAuthor),
        });
        if (props.handleAuthor) {
            props.handleAuthor(theAuthor);
        }
    }

    const handleUpdate: HandleAuthor = async (theAuthor) => {
        logger.info({
            context: "AuthorsStage.handleUpdate",
            author: Abridgers.AUTHOR(theAuthor),
        });
        /* const updated = */ await mutateAuthor.update(theAuthor);
        setAuthor(null); // TODO - trigger refresh somehow?
    }

    const included = (theAuthor: Author): boolean => {
        let result = false;
        if (fetchParent.parent instanceof Library) {
            result = true;
        } else if ((fetchParent.parent instanceof Series)
                    || (fetchParent.parent instanceof Story)
                    || (fetchParent.parent instanceof Volume)) {
            if (fetchParent.parent.authors) {
                fetchParent.parent.authors.forEach(author => {
                    if (theAuthor.id === author.id) {
                        result = true;
                    }
                });
            }
        }
        return result;
    }

    return (
        <Container fluid id="AuthorsStage">

            {/* List View */}
            {(!author) ? (
                <>

                    <Row className="mb-3">
                        <Col className="text-center">
                            <span>Add, Edit, or Select Author for {fetchParent.parent._model}: </span>
                            <span className="text-info">{fetchParent.parent._title}</span>
                        </Col>
                    </Row>

                    <AuthorsList
                        handleAdd={canInsert ? handleAdd : undefined}
                        handleEdit={(canInsert || canUpdate) ? handleEdit : undefined}
                        handleExclude=
                            {(canInsert || canUpdate) && !(fetchParent.parent instanceof Library) ? handleExclude : undefined}
                        handleInclude=
                            {(canInsert || canUpdate) && !(fetchParent.parent instanceof Library) ? handleInclude : undefined}
                        handleSelect={handleSelect}
                        included={included}
                        parent={fetchParent.parent}
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
                            &nbsp;Author for {fetchParent.parent._model}:&nbsp;
                            <span className="text-info">
                                {fetchParent.parent._title}
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
                        author={author}
                        autoFocus
                        handleInsert={canInsert ? handleInsert : undefined}
                        handleRemove={canRemove ? handleRemove : undefined}
                        handleUpdate={canUpdate ? handleUpdate : undefined}
                    />

                </>
            ) : null }

        </Container>
    )

}

export default AuthorsStage;

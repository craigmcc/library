// StoriesStage --------------------------------------------------------------

// Manage selection of a Story to be processed for subsequent stages, while
// also supporting CRUD management of an individual Story.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import StoryForm from "./StoryForm";
import StoriesList from"./StoriesList";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleStory, Parent, Scope} from "../../types";
import useFetchParent from "../../hooks/useFetchParent";
import useMutateStory from "../../hooks/useMutateStory";
import Author from "../../models/Author";
import Library from "../../models/Library";
import Series from "../../models/Series";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleStory?: HandleStory;          // Handle selecting Story [no handler]
    parent: Parent;                     // Parent object for Stories (pass to useFetchParent)
    refreshSummary?: HandleAction;      // Trigger updates to summary when called
    showOrdinal?: boolean;              // Show the Ordinal column? [false]
}

// Component Details ---------------------------------------------------------

const StoriesStage = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [story, setStory] = useState<Story | null>(null);

    const fetchParent = useFetchParent({
        parent: props.parent,
    });
    const mutateStory = useMutateStory({});

    useEffect(() => {
        logger.info({
            context: "StoriesStage.useEffect",
            parent: Abridgers.ANY(props.parent),
        });
        const isAdmin = loginContext.validateLibrary(libraryContext.library, Scope.ADMIN);
        // const isRegular = loginContext.validateLibrary(libraryContext.library, Scope.REGULAR);
        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isAdmin || isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isAdmin || isSuperuser);
    }, [story, props.parent,
        fetchParent.parent,
        libraryContext.library, libraryContext.library.id,
        loginContext, loginContext.data.loggedIn]);

    const handleAdd: HandleAction = () => {
        const theStory = new Story({
            active: true,
            copyright: null,
            libraryId: libraryContext.library.id,
            name: null,
            notes: null,
            ordinal: null,
        });
        logger.info({
            context: "StoriesStage.handleAdd",
            author: theStory,
        });
        setStory(theStory);
    }

    const handleEdit: HandleStory = async (theStory) => {
        logger.info({
            context: "StoriesStage.handleEdit",
            story: Abridgers.STORY(theStory),
        });
        setStory(theStory);
    }

    const handleExclude: HandleStory = async (theStory) => {
        logger.info({
            context: "StoriesStage.handleExclude",
            story: Abridgers.STORY(theStory),
            parent: Abridgers.ANY(fetchParent.parent),
        });
        if (!(fetchParent.parent instanceof Library)) {
            /* const excluded = */ await mutateStory.exclude(theStory, fetchParent.parent);
            fetchParent.refresh();
            refreshSummary();
        }
    }

    const handleInclude: HandleStory = async (theStory) => {
        logger.info({
            context: "StoriesStage.handleInclude",
            story: Abridgers.STORY(theStory),
            parent: Abridgers.ANY(fetchParent.parent),
        });
        if (!(fetchParent.parent instanceof Library)) {
            /* const included = */ await mutateStory.include(theStory, fetchParent.parent);
            fetchParent.refresh();
            refreshSummary();
        }
    }

    const handleInsert: HandleStory = async (theStory) => {
        logger.info({
            context: "StoriesStage.handleInsert",
            story: Abridgers.STORY(theStory),
        });
        const inserted = await mutateStory.insert(theStory);
        inserted.ordinal = theStory.ordinal;
        handleInclude(inserted); // Assume the newly created Story is included for this Parent
        fetchParent.refresh();
        setStory(null);
        refreshSummary();
    }

    const handleRemove: HandleStory = async (theStory) => {
        logger.info({
            context: "StoriesStage.handleRemove",
            story: Abridgers.STORY(theStory),
        });
        /* const removed = */ await mutateStory.remove(theStory);
        setStory(null);
        refreshSummary();
    }

    const handleSelect: HandleStory = (theStory) => {
        logger.info({
            context: "StoriesStage.handleSelect",
            story: Abridgers.STORY(theStory),
        });
        if (props.handleStory) {
            props.handleStory(theStory);
        }
        setStory(theStory);
    }

    const handleUpdate: HandleStory = async (theStory) => {
        logger.info({
            context: "StoriesStage.handleUpdate",
            story: Abridgers.STORY(theStory),
        });
        const updated = await mutateStory.update(theStory);
        if (story && included(story)) {
            if (story.ordinal !== theStory.ordinal) {
                handleExclude(updated);
                updated.ordinal = theStory.ordinal;
                handleInclude(updated);
            }
        }
        setStory(null);
        refreshSummary();
    }

    const included = (theStory: Story): boolean => {
        let result = false;
        if (fetchParent.parent instanceof Library) {
            result = true;
        } else if ((fetchParent.parent instanceof Author)
            || (fetchParent.parent instanceof Series)
            || (fetchParent.parent instanceof Volume)) {
            if (fetchParent.parent.stories) {
                fetchParent.parent.stories.forEach(story => {
                    if (theStory.id === story.id) {
                        result = true;
                    }
                });
            }
        }
        return result;
    }

    const refreshSummary = (): void => {
        if (props.refreshSummary) {
            props.refreshSummary();
        }
    }

    return (
        <Container fluid id="StoriesStage">

            {/* List View */}
            {(!story) ? (
                <>

                    <Row className="mb-3">
                        <Col className="text-center">
                            <span>Add, Edit, or Select Story for {fetchParent.parent._model}: </span>
                            <span className="text-info">{fetchParent.parent._title}</span>
                        </Col>
                    </Row>

                    <StoriesList
                        handleAdd={canInsert ? handleAdd : undefined}
                        handleEdit={(canInsert || canUpdate) ? handleEdit : undefined}
                        handleExclude=
                            {(canInsert || canUpdate) && !(fetchParent.parent instanceof Library) ? handleExclude : undefined}
                        handleInclude=
                            {(canInsert || canUpdate) && !(fetchParent.parent instanceof Library) ? handleInclude : undefined}
                        handleSelect={handleSelect}
                        included={included}
                        parent={fetchParent.parent}
                        showOrdinal={props.showOrdinal}
                    />

                </>
            ) : null }

            {/* Detail View */}
            {(story) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            {(story.id > 0) ? (
                                <span>Edit Existing</span>
                            ) : (
                                <span>Add New</span>
                            )}
                            &nbsp;Story for {fetchParent.parent._model}:&nbsp;
                            <span className="text-info">
                                {fetchParent.parent._title}
                            </span>
                        </Col>
                        <Col className="text-end">
                            <Button
                                onClick={() => setStory(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <StoryForm
                        autoFocus
                        handleInsert={canInsert ? handleInsert : undefined}
                        handleRemove={canRemove ? handleRemove : undefined}
                        handleUpdate={canUpdate ? handleUpdate : undefined}
                        showOrdinal={props.showOrdinal}
                        story={story}
                    />

                </>
            ) : null }

        </Container>
    )

}

export default StoriesStage;

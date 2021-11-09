// VolumesStage --------------------------------------------------------------

// Manage selection of a Volume to be processed for subsequent stages, while
// also supporting CRUD management of an individual Volume.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import VolumeForm from "./VolumeForm";
import VolumesList from"./VolumesList";
import LibraryContext from "../libraries/LibraryContext";
import LoginContext from "../login/LoginContext";
import {HandleAction, HandleAuthor, HandleVolume, Parent, Scope} from "../../types";
import useFetchParent from "../../hooks/useFetchParent";
import useMutateVolume from "../../hooks/useMutateVolume";
import Author from "../../models/Author";
import Library from "../../models/Library";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleVolume?: HandleVolume;        // Handle selecting Volume [no handler]
    parent: Parent;                     // Parent object for Volumes (pass to useFetchParent)
}

// Component Details ---------------------------------------------------------

const VolumesStage = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [volume, setVolume] = useState<Volume | null>(null);

    const fetchParent = useFetchParent({
        parent: props.parent,
    });
    const mutateVolume = useMutateVolume({});

    useEffect(() => {
        logger.info({
            context: "VolumesStage.useEffect",
            parent: Abridgers.ANY(props.parent),
        });
        const isAdmin = loginContext.validateLibrary(libraryContext.library, Scope.ADMIN);
        // const isRegular = loginContext.validateLibrary(libraryContext.library, Scope.REGULAR);
        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        setCanInsert(isAdmin || isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isAdmin || isSuperuser);
    }, [volume, props.parent,
        fetchParent.parent,
        libraryContext.library, libraryContext.library.id,
        loginContext, loginContext.data.loggedIn]);

    const handleAdd: HandleAction = () => {
        const theVolume = new Volume({
            active: true,
            copyright: null,
            googleId: null,
            isbn: null,
            libraryId: libraryContext.library.id,
            location: "Kindle",
            name: null,
            notes: null,
            read: false,
            type: "Single",
        });
        logger.info({
            context: "VolumesStage.handleAdd",
            volume: theVolume,
        });
        setVolume(theVolume);
    }

    const handleEdit: HandleVolume = async (theVolume) => {
        logger.info({
            context: "VolumesStage.handleEdit",
            volume: Abridgers.VOLUME(theVolume),
        });
        setVolume(theVolume);
    }

    const handleExclude: HandleVolume = async (theVolume) => {
        logger.info({
            context: "VolumesStage.handleExclude",
            volume: Abridgers.VOLUME(theVolume),
            parent: Abridgers.ANY(fetchParent.parent),
        });
        /* const excluded = */ await mutateVolume.exclude(theVolume, fetchParent.parent);
        fetchParent.refresh();
    }

    const handleInclude: HandleVolume = async (theVolume) => {
        logger.info({
            context: "VolumesStage.handleInclude",
            volume: Abridgers.VOLUME(theVolume),
            parent: Abridgers.ANY(fetchParent.parent),
        });
        /* const included = */ await mutateVolume.include(theVolume, fetchParent.parent);
        fetchParent.refresh();
    }

    const handleInsert: HandleVolume = async (theVolume) => {
        logger.info({
            context: "VolumesStage.handleInsert",
            volume: Abridgers.VOLUME(theVolume),
        });
        const inserted = await mutateVolume.insert(theVolume);
        handleSelect(inserted);
    }

    const handleRemove: HandleVolume = async (theVolume) => {
        logger.info({
            context: "VolumesStage.handleRemove",
            volume: Abridgers.VOLUME(theVolume),
        });
        /* const removed = */ await mutateVolume.remove(theVolume);
        setVolume(null); // TODO - trigger refresh somehow?
    }

    const handleSelect: HandleVolume = (theVolume) => {
        logger.info({
            context: "VolumesStage.handleSelect",
            volume: Abridgers.VOLUME(theVolume),
        });
        if (props.handleVolume) {
            props.handleVolume(theVolume);
        }
    }

    const handleUpdate: HandleVolume = async (theVolume) => {
        logger.info({
            context: "VolumesStage.handleUpdate",
            volume: Abridgers.VOLUME(theVolume),
        });
        /* const updated = */ await mutateVolume.update(theVolume);
        setVolume(null); // TODO - trigger refresh somehow?
    }

    const included = (theVolume: Volume): boolean => {
        let result = false;
        if (fetchParent.parent instanceof Library) {
            result = true;
        } else if ((fetchParent.parent instanceof Author)
                    || (fetchParent.parent instanceof Story)) {
            if (fetchParent.parent.volumes) {
                fetchParent.parent.volumes.forEach(volume => {
                    if (theVolume.id === volume.id) {
                        result = true;
                    }
                })
            }
        }
        return result;
    }

    return (
        <Container fluid id="VolumesStage">

            {/* List View */}
            {(!volume) ? (
                <>

                    <Row className="mb-3">
                        <Col className="text-center">
                            <span>Add, Edit, or Select Volume for {fetchParent.parent._model}: </span>
                            <span className="text-info">{fetchParent.parent._title}</span>
                        </Col>
                    </Row>

                    <VolumesList
                        handleAdd={canInsert ? handleAdd : undefined}
                        handleEdit={(canInsert || canUpdate) ? handleEdit : undefined}
                        // TODO - handleExclude and handleInclude when supported
                        handleSelect={handleSelect}
                        included={included}
                        parent={fetchParent.parent}
                    />

                </>
            ) : null }

            {/* Detail View */}
            {(volume) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            {(volume.id > 0) ? (
                                <span>Edit Existing</span>
                            ) : (
                                <span>Add New</span>
                            )}
                            &nbsp;Volume for {fetchParent.parent._model}:&nbsp;
                            <span className="text-info">
                                {fetchParent.parent._title}
                            </span>
                        </Col>
                        <Col className="text-end">
                            <Button
                                onClick={() => setVolume(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <VolumeForm
                        autoFocus
                        handleInsert={canInsert ? handleInsert : undefined}
                        handleRemove={canRemove ? handleRemove : undefined}
                        handleUpdate={canUpdate ? handleUpdate : undefined}
                        volume={volume}
                    />

                </>
            ) : null }

        </Container>
    )

}

export default VolumesStage;

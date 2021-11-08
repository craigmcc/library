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
import {HandleAction, HandleVolume, Parent, Scope} from "../../types";
import useFetchParent from "../../hooks/useFetchParent";
import useMutateVolume from "../../hooks/useMutateVolume";
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
    const [canSave, setCanSave] = useState<boolean>(false);
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
        setCanInsert(loginContext.validateLibrary(libraryContext.library));
        setCanRemove(loginContext.validateScope(Scope.SUPERUSER));
        setCanSave(loginContext.validateLibrary(libraryContext.library));
    }, [props.parent,
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
        logger.debug({
            context: "VolumesStage.handleAdd",
            volume: theVolume,
        });
        setVolume(theVolume);
    }

    const handleEdit: HandleVolume = async (theVolume) => {
        logger.debug({
            context: "VolumesStage.handleEdit",
            volume: Abridgers.VOLUME(theVolume),
        });
        setVolume(theVolume);
    }

    const handleInsert: HandleVolume = async (theVolume) => {
        logger.debug({
            context: "VolumesStage.handleInsert",
            volume: Abridgers.VOLUME(theVolume),
        });
        const inserted = await mutateVolume.insert(theVolume);
        handleSelect(inserted);
    }

    const handleRemove: HandleVolume = async (theVolume) => {
        logger.debug({
            context: "VolumesStage.handleRemove",
            volume: Abridgers.VOLUME(theVolume),
        });
        /* const removed = */ await mutateVolume.remove(theVolume);
        setVolume(null); // TODO - trigger refresh somehow?
    }

    const handleSelect: HandleVolume = (theVolume) => {
        logger.debug({
            context: "VolumessStage.handleSelect",
            volume: Abridgers.VOLUME(theVolume),
        });
        if (props.handleVolume) {
            props.handleVolume(theVolume);
        }
    }

    const handleUpdate: HandleVolume = async (theVolume) => {
        logger.debug({
            context: "VolumesStage.handleUpdate",
            volume: Abridgers.VOLUME(theVolume),
        });
        /* const updated = */ await mutateVolume.update(theVolume);
        setVolume(null); // TODO - trigger refresh somehow?
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
                        canInsert={canInsert}
                        handleAdd={handleAdd}
                        handleEdit={handleEdit}
                        handleSelect={handleSelect}
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
                        canRemove={canRemove}
                        canSave={canSave}
                        handleInsert={handleInsert}
                        handleRemove={handleRemove}
                        handleUpdate={handleUpdate}
                        volume={volume}
                    />

                </>
            ) : null }

        </Container>
    )

}

export default VolumesStage;

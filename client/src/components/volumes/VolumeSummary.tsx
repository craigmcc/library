// VolumeSummary -------------------------------------------------------------

// Render a summary of the currently selected Volume and its associated
// currently selected Authors and Stories (with their authors).

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import {HandleAction} from "../../types";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/Abridgers";
import logger from "../../util/ClientLogger";
import {authorsNames, storiesNames} from "../../util/Transformations";

// Incoming Properties ------------------------------------------------------

export interface Props {
    volume: Volume;                     // Currently selected Volume (must have children)
}

// Component Details --------------------------------------------------------

const VolumeSummary = (props: Props) => {

    const [expand, setExpand] = useState<boolean>(true);

    useEffect(() => {
        logger.debug({
            context: "VolumeSummary.useEffect",
            volume: Abridgers.VOLUME(props.volume),
        });
    }, [props.volume]);

    const toggleExpand: HandleAction = () => {
        setExpand(!expand);
    }

    return (
        <>
            {(props.volume.id > 0) ? (
                <Container fluid id="VolumeSummary">

                    <Row className="mb-1">
                        <Col className="text-center">
                            <span>Summary for Volume:&nbsp;</span>
                            <span className="text-info">
                        {props.volume.name}&nbsp;&nbsp;
                    </span>
                            {(expand) ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-caret-up-square" viewBox="0 0 16 16"
                                     onClick={toggleExpand}>
                                    <path
                                        d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                    <path
                                        d="M3.544 10.705A.5.5 0 0 0 4 11h8a.5.5 0 0 0 .374-.832l-4-4.5a.5.5 0 0 0-.748 0l-4 4.5a.5.5 0 0 0-.082.537z"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-caret-down-square" viewBox="0 0 16 16"
                                     onClick={toggleExpand}>
                                    <path d="M3.626 6.832A.5.5 0 0 1 4 6h8a.5.5 0 0 1 .374.832l-4 4.5a.5.5 0 0 1-.748 0l-4-4.5z"/>
                                    <path
                                        d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2z"/>
                                </svg>
                            )}
                        </Col>
                    </Row>

                    {(expand) ? (
                        <>
                            <Row className="mb-1">
                                <Col className="text-center">
                                    <span>Authors:&nbsp;</span>
                                    <span className="text-info">
                               {authorsNames(props.volume.authors)}
                            </span>
                                </Col>
                            </Row>
                            <Row className="mb-1">
                                <Col className="text-center">
                                    <span>Stories:&nbsp;</span>
                                    <span className="text-info">
                                {storiesNames(props.volume.stories)}
                            </span>
                                </Col>
                            </Row>
                        </>
                    ) : null}

                    <hr/>

                </Container>
            ) : null }
        </>
    )

}

export default VolumeSummary;

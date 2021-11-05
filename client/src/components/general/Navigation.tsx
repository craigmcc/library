// Navigation ----------------------------------------------------------------

// Top-level navigation menu, with support for react-router-dom@6.

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {Link, Outlet} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import LoggedInUser from "../login/LoggedInUser";
import LibrarySelector from "../libraries/LibrarySelector";

// Component Details ---------------------------------------------------------

function Navigation() {
    return (
        <>
        <Container fluid>
            <Row>
                <Col>
                    <Link to="/">Home</Link>&nbsp;&nbsp;
                    <Link to="/authors">Authors</Link>&nbsp;&nbsp;
                    <Link to="/series">Series</Link>&nbsp;&nbsp;
                    <Link to="/stories">Stories</Link>&nbsp;&nbsp;
                    <Link to="/volumes">Volumes</Link>
                </Col>
                <Col>
                    <Link to="/libraries">Libraries</Link>&nbsp;&nbsp;
                    <Link to="/users">Users</Link>
                </Col>
                <Col>
                        <LoggedInUser/>
                </Col>
                <Col>
                        <LibrarySelector/>
                </Col>
            </Row>
            <hr/>
        </Container>
        <Outlet/>
        </>
    )
}

export default Navigation;

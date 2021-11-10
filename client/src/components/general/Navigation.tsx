// Navigation ----------------------------------------------------------------

// Top-level navigation menu, with support for react-router-dom@6.

// External Modules ----------------------------------------------------------

import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import {Link, Outlet} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import LoggedInUser from "../login/LoggedInUser";
import LibrarySelector from "../libraries/LibrarySelector";

// Component Details ---------------------------------------------------------

function Navigation() {
    return (
        <>
            <Navbar bg="primary" className="mb-3" sticky="top" variant="dark">
                <Navbar.Brand className="ms-2" href="/">
                    <img
                        alt="Library Management"
                        height={60}
                        src="./books.jpeg"
                        width={100}
                    />
                    <span className="ms-2">Library Management</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Link className="nav-link" to="/">Home</Link>
                        <Link className="nav-link" to="/authors">Authors</Link>
                        <Link className="nav-link" to="/series">Series</Link>
                        <Link className="nav-link" to="/stories">Stories</Link>
                        <Link className="nav-link" to="/volumes">Volumes</Link>
                        <NavDropdown id="admin" title="Admin">
                            <Link to="/libraries" data-rr-ui-dropdown-item className="dropdown-item">
                                Libraries
                            </Link>
                            <Link to="/users" data-rr-ui-dropdown-item className="dropdown-item">
                                Users
                            </Link>
                        </NavDropdown>
                    </Nav>
                    <LoggedInUser/>
                    <span className="me-4"/>
                    <LibrarySelector/>
                    <span className="me-2"/>
                </Navbar.Collapse>
            </Navbar>
            <Outlet/>
        </>
    )
}

export default Navigation;

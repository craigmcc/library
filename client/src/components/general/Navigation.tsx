// Navigation ----------------------------------------------------------------

// Top-level navigation menu, with support for react-router-dom@6.

// External Modules ----------------------------------------------------------

import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import {NavLink, Outlet} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import LoggedInUser from "../login/LoggedInUser";
import LibrarySelector from "../libraries/LibrarySelector";

// Component Details ---------------------------------------------------------

function Navigation() {
    return (
        <>
            <Navbar
                bg="primary"
                className="mb-3"
                collapseOnSelect
                sticky="top"
                variant="dark"
            >
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
                        <NavLink className="nav-link" to="/">Home</NavLink>
                        <NavLink className="nav-link" to="/authors">Authors</NavLink>
                        <NavLink className="nav-link" to="/series">Series</NavLink>
                        <NavLink className="nav-link" to="/stories">Stories</NavLink>
                        <NavLink className="nav-link" to="/volumes">Volumes</NavLink>
                        <NavDropdown id="admin" title="Admin">
                            <NavDropdown.Item>
                                <NavLink to="/libraries">Libraries</NavLink>
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <NavLink to="/users">Users</NavLink>
                            </NavDropdown.Item>
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

// App -----------------------------------------------------------------------

// Overall user interface implementation.

// External Modules ----------------------------------------------------------

import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Internal Modules ----------------------------------------------------------

import AuthorsView from "./components/authors/AuthorsView";
import HomeView from "./components/general/HomeView";
import LibrariesView from "./components/libraries/LibrariesView";
import LoggedInUser from "./components/login/LoggedInUser";
import SeriesView from "./components/series/SeriesView";
import StoriesView from "./components/stories/StoriesView";
import UsersView from "./components/users/UsersView";
import VolumesView from "./components/volumes/VolumesView";

// Component Details ---------------------------------------------------------

function App() {
    return (
        <Router>

            <Navbar bg="light" expand="lg">
                <Navbar
                    bg="primary"
                    className="mb-3"
                    expand="lg"
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
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/authors">Authors</Nav.Link>
                            <Nav.Link href="/series">Series</Nav.Link>
                            <Nav.Link href="/stories">Stories</Nav.Link>
                            <Nav.Link href="/volumes">Volumes</Nav.Link>
                            <NavDropdown title="Admin" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/libraries">Libraries</NavDropdown.Item>
                                <NavDropdown.Item href="/users">Users</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                    <Nav>
                        <LoggedInUser/>
                        {/*<span className="me-4">LibrarySelector</span>*/}
                    </Nav>
                </Navbar>
            </Navbar>

            <Switch>
                <Route exact path="/authors"><AuthorsView/></Route>
                <Route exact path="/libraries"><LibrariesView/></Route>
                <Route exact path="/series"><SeriesView/></Route>
                <Route exact path="/stories"><StoriesView/></Route>
                <Route exact path="/users"><UsersView/></Route>
                <Route exact path="/volumes"><VolumesView/></Route>
                <Route path="/"><HomeView/></Route>
            </Switch>

        </Router>
    )
}

export default App;

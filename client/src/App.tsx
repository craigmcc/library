// App -----------------------------------------------------------------------

// Overall user interface implementation.

// External Modules ----------------------------------------------------------

import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";

// Internal Modules ----------------------------------------------------------

// Component Details ---------------------------------------------------------

function App() {
return (
    <Navbar bg="light" expand="lg">
        <Navbar
            bg="primary"
            className="mb-3"
            sticky="top"
            variant="dark"
        >
            <span className="me-4"></span>
            <Navbar.Brand href="#Home">
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
                    <Nav.Link href="#">Home</Nav.Link>
                    <Nav.Link href="#Authors">Authors</Nav.Link>
                    <Nav.Link href="#Series">Series</Nav.Link>
                    <Nav.Link href="#Stories">Stories</Nav.Link>
                    <Nav.Link href="#Volumes">Volumes</Nav.Link>
                    <NavDropdown title="Admin" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#Libraries">Libraries</NavDropdown.Item>
                        <NavDropdown.Item href="#Users">Users</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav className="ms-4">
                    <span className="me-4">LoggedInUser</span>
                    <span className="me-4">LibrarySelector</span>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </Navbar>
)


/*
  return (
      <Navbar
          bg="success"
          className="mb-3"
          expand="md"
          sticky="top"
          variant="dark"
      >

          <Navbar.Brand>
              <img
                  alt="Library Management"
                  height={60}
                  src="./books.jpeg"
                  width={100}
              />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-brand"/>

          <Navbar.Collapse id="basic-navbar-nav">

              <Nav className="me-auto">
                  <Nav.Link href="/">Home</Nav.Link>
                  <Nav.Link href="/authors">Authors</Nav.Link>
                  <Nav.Link href="/series">Series</Nav.Link>
                  <Nav.Link href="/stories">Stories</Nav.Link>
                  <Nav.Link href="/volumes">Volumes</Nav.Link>
              </Nav>
          </Navbar.Collapse>

          <span className="me-4">LoggedInUser</span>
          <span className="me-4">LibrarySelector</span>

      </Navbar>

  )
*/
}

export default App;

// components/general/Sidebar.tsx

// External Modules ----------------------------------------------------------

import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";

// Incoming Properties -------------------------------------------------------

/**
 * Properties for the Sidebar component.
 */
export interface SidebarProps {
}

/**
 * The sidebar component that is present on all pages.
 */
const Sidebar = (props: SidebarProps) => {

    return (
        <Container id="Sidebar"
                   className="vh-100 bg-secondary-light"
        >
            <Row>
                <Col className="pt-1">
{/*                    <div style={{backgroundColor: '#ffe02f'}}> */}
                    <div className="bg-secondary-other">
{/*                        <span><h1 style={{color: 'hsl(18, 83%, 60%)'}}>📚 Library</h1></span> */}
                        <span className="text-warning"><h1>📚 Library</h1></span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
{/*
                    <Nav defaultActiveKey="/home" className="flex-column">
                        <Nav.Link  style={{color: 'hsl(250, 50%, 100%)'}} href="/home">Home</Nav.Link>
                        <Nav.Link  style={{color: 'hsl(250, 60%, 100%)'}} eventKey="link-1">Link 1</Nav.Link>
                        <Nav.Link  style={{color: 'hsl(250, 70%, 100%)'}} eventKey="link-2">Link 2</Nav.Link>
                        <Nav.Link  style={{color: 'hsl(250, 34%, 100%)'}} eventKey="link-3" disabled>Link 3</Nav.Link>
                    </Nav>
*/}
                    <Nav defaultActiveKey="/home" className="flex-column">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <hr/>
                        <Nav.Link eventKey="link-1">Link</Nav.Link>
                        <Nav.Link eventKey="link-2">Link</Nav.Link>
                        <Nav.Link eventKey="disabled" disabled>
                            Disabled
                        </Nav.Link>
                    </Nav>
                </Col>
            </Row>
        </Container>
    )

}

export default Sidebar;

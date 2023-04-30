import React from 'react';
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
//import "bootstrap/dist/css/bootstrap.min.css";
import "./scss/custom.css";

import Sidebar from "./components/general/Sidebar";

function App() {

  return (
      <Container fluid id="App">
        <Row>
          <Col className="col-2">
            <Sidebar/>
          </Col>
          <Col>
            <p className="text-secondary-other">The rest of the story.</p>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="info">Info</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="secondary-light">Secondary Light</Button>
              <Button variant="secondary-other">Secondary Other</Button>
          </Col>
        </Row>
      </Container>
  );

}

export default App;

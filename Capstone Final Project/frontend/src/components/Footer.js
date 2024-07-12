import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6} className="text-center">
            <p>&copy; 2024 Atlas Adventure. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;

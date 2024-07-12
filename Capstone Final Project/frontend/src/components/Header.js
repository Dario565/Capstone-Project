import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col, Button } from 'react-bootstrap';
import { AuthContext } from '../components/AuthContext';
import '../styles/Header.css';

function Header() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, user: null });
    localStorage.removeItem('token');
    navigate('/auth'); 
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Row className="w-100 align-items-center">
          <Col xs="auto">
            <Navbar.Brand as={Link} to="/home">
              {<img src="/images/logo.jpg" alt="Travel Agency Logo" className="logo" />}
              
            </Navbar.Brand>
          </Col>
          <Col xs className="text-center">
            <h1 className="navbar-title"> Atlas Adventure</h1>
          </Col>
          <Col xs="auto">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/home">Home</Nav.Link>
                <Nav.Link as={Link} to="/tours">Tours</Nav.Link>
                <Nav.Link as={Link} to="/contact">Contact us</Nav.Link>
                {auth.isAuthenticated && auth.user.role === 'user' && (
                  <>
                    <Nav.Link as={Link} to="/add-tour">Add Tour</Nav.Link>
                    <Button variant="outline-secondary" onClick={handleLogout}>Logout</Button>
                  </>
                )}
                {auth.isAuthenticated && auth.user.role === 'guest' && (
                  <Button variant="outline-secondary" onClick={handleLogout}>Logout</Button>
                )}
                {!auth.isAuthenticated && <Nav.Link as={Link} to="/auth">Login</Nav.Link>}
              </Nav>
            </Navbar.Collapse>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Header;

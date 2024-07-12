import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import '../styles/AuthPage.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:5000/users/login', { username, password });
        setAuth({ isAuthenticated: true, user: response.data.user });
        navigate('/home');
      } else {
        const newUser = { firstName, lastName, email, username, password };
        await axios.post('http://localhost:5000/users/register', newUser);
        setFirstName('');
        setLastName('');
        setEmail('');
        setUsername('');
        setPassword('');
        setSuccess(true);
        setError('');
      }
    } catch (error) {
      console.error('There was an error!', error);
      setError('Errore durante l\'autenticazione');
      setSuccess(false);
    }
  };

  const handleGuestAccess = () => {
    setAuth({ isAuthenticated: true, user: { username: 'guest', role: 'guest' } });
    navigate('/home');
  };

  return (
    <Container className="auth-form">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1>{isLogin ? 'Login' : 'Register'}</h1>
          {success && !isLogin && <Alert variant="success">Registrazione avvenuta con successo!</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <Form.Group controlId="formFirstName">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formLastName">
                  <Form.Label>Cognome</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
              </>
            )}
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100">
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </Form>
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="mt-3 w-100">
            {isLogin ? 'Switch to Register' : 'Switch to Login'}
          </Button>
          <Button variant="secondary" onClick={handleGuestAccess} className="mt-3 w-100">
            Access as Guest
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default AuthPage;

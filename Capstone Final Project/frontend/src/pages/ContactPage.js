import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import '../styles/ContactPage.css';

function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComment = { name, email, message };
    try {
      const response = await axios.post('http://localhost:5000/comments', newComment);
      console.log('Comment saved:', response.data);
      setName('');
      setEmail('');
      setMessage('');
      setSuccess(true);
      setError(false);
    } catch (error) {
      console.error('Error saving comment:', error);
      setSuccess(false);
      setError(true);
    }
  };

  return (
    <Container className="contact-page">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1>Contattaci</h1>
          {success && <Alert variant="success">Commento inviato con successo!</Alert>}
          {error && <Alert variant="danger">Errore nell'invio del commento</Alert>}
          <Form onSubmit={handleSubmit} className="contact-form">
            <Form.Group controlId="formName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            <Form.Group controlId="formMessage">
              <Form.Label>Messaggio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Invia
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ContactPage;

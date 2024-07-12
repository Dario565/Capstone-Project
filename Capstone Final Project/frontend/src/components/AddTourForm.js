import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import '../styles/AddTourForm.css';

function AddTourForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/tours', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setName('');
      setDescription('');
      setPrice('');
      setImage(null);
      setSuccess(true);
      setError(false);
    } catch (error) {
      console.error('Error adding tour:', error);
      setSuccess(false);
      setError(true);
    }
  };

  return (
    <Container className="add-tour-form">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1>Aggiungi un Nuovo Tour</h1>
          {success && <Alert variant="success">Tour aggiunto con successo!</Alert>}
          {error && <Alert variant="danger">Errore nell'aggiunta del tour</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTourName">
              <Form.Label>Nome del Tour</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTourDescription">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTourPrice">
              <Form.Label>Prezzo</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTourImage">
              <Form.Label>Immagine</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Aggiungi Tour
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default AddTourForm;

 
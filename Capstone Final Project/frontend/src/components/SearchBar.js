import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import '../styles/SearchBar.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm, minPrice, maxPrice);
  };

  return (
    <Form onSubmit={handleSearch} className="mb-4">
      <Row  className="align-items-center">
        <Col xs={12} md={3}>
          <Form.Control 
            type="text"
            placeholder="Cerca per nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col xs={12} md={3}>
          <Form.Control
            type="number"
            placeholder="Prezzo minimo..."
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </Col>
        <Col xs={12} md={3}>
          <Form.Control
            type="number"
            placeholder="Prezzo massimo..."
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </Col>
        <Col xs={12} md={3}>
          <Button type="submit" block>
            Cerca
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchBar;

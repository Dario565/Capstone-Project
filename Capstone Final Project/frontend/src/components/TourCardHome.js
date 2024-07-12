import React, { useState } from 'react';
import { Card, Modal, Button } from 'react-bootstrap';
import '../styles/TourCard.css';

const TourCardHome = ({ tour }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Card className="tour-card" onClick={handleCardClick}>
        <Card.Img 
          variant="top" 
          src={`http://localhost:5000${tour.image}`} 
          alt={tour.name} 
          className="tour-image"
        />
        <Card.Body>
          <Card.Title>{tour.name}</Card.Title>
          <Card.Text>{tour.description.substring(0, 100)}...</Card.Text>
          <Card.Text className="tour-price">${tour.price}</Card.Text>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{tour.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={`http://localhost:5000${tour.image}`} alt={tour.name} className="img-fluid mb-3" />
          <p>{tour.description}</p>
          <p className="tour-price">${tour.price}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Chiudi</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TourCardHome;

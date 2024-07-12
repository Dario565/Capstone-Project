import React, { useState } from 'react';
import { Card, Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/TourCard.css';

const TourCardTour = ({ tour, onEdit, onDelete, onBook }) => {
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [numPeople, setNumPeople] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setShowBookingModal(false);
    setShowDeleteModal(false);
  };

  const calculateTotalPrice = (start, end, people) => {
    const basePrice = tour.price;
    const numDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const dailyIncrement = 0.05; 
    const peopleIncrement = 0.05; 

    const dayPrice = basePrice * Math.pow(1 + dailyIncrement, numDays - 1);
    const finalPrice = dayPrice * Math.pow(1 + peopleIncrement, people - 1);
    return finalPrice * people;
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    const newTotalPrice = calculateTotalPrice(date, endDate, numPeople);
    setTotalPrice(newTotalPrice);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    const newTotalPrice = calculateTotalPrice(startDate, date, numPeople);
    setTotalPrice(newTotalPrice);
  };

  const handleNumPeopleChange = (e) => {
    const people = e.target.value;
    setNumPeople(people);
    const newTotalPrice = calculateTotalPrice(startDate, endDate, people);
    setTotalPrice(newTotalPrice);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    onBook({
      tourName: tour.name,
      startDate,
      endDate,
      numPeople,
      totalPrice
    });
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowBookingModal(false);
    }, 2000);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(tour._id);
    setShowDeleteModal(false);
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
          <div className="d-flex justify-content-between">
            <Button 
              variant="warning" 
              onClick={(e) => { 
                e.stopPropagation(); 
                onEdit(tour); 
              }}>
              Modifica
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteClick}>
              Elimina
            </Button>
            <Button 
              variant="primary" 
              onClick={(e) => { 
                e.stopPropagation(); 
                setShowBookingModal(true); 
                const newTotalPrice = calculateTotalPrice(startDate, endDate, numPeople);
                setTotalPrice(newTotalPrice);
              }}>
              Prenota
            </Button>
          </div>
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

      <Modal show={showBookingModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Prenota il Tour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingSuccess ? (
            <p>Prenotazione effettuata con successo!</p>
          ) : (
            <Form onSubmit={handleBookingSubmit}>
              <Form.Group controlId="formStartDate">
                <Form.Label>Data di inizio</Form.Label>
                <DatePicker 
                  selected={startDate} 
                  onChange={handleStartDateChange}
                  selectsStart 
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                />
              </Form.Group>
              <Form.Group controlId="formEndDate">
                <Form.Label>Data di fine</Form.Label>
                <DatePicker 
                  selected={endDate} 
                  onChange={handleEndDateChange}
                  selectsEnd 
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                />
              </Form.Group>
              <Form.Group controlId="formNumPeople">
                <Form.Label>Numero di persone</Form.Label>
                <Form.Control 
                  type="number" 
                  value={numPeople} 
                  onChange={handleNumPeopleChange}
                  min="1" 
                  required 
                />
              </Form.Group>
              <p className="mt-3">Prezzo totale: ${totalPrice.toFixed(2)}</p>
              <Button variant="primary" type="submit">
                Conferma Prenotazione
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Conferma Eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sei sicuro di voler eliminare questo tour?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Annulla</Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>Elimina</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TourCardTour;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TourListTour from '../components/TourList';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import '../styles/ToursPage.css';

function ToursPage() {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [editingTour, setEditingTour] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tours');
        setTours(response.data);
        setFilteredTours(response.data);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchTours();
    fetchBookings();

    const handleNewBooking = (event) => {
      setBookings([...bookings, event.detail]);
    };

    window.addEventListener('newBooking', handleNewBooking);

    return () => {
      window.removeEventListener('newBooking', handleNewBooking);
    };
  }, [bookings]);



  const handleEditTour = (tour) => {
    setEditingTour(tour);
  };

  const handleDeleteTour = async (tourId) => {
    try {
      await axios.delete(`http://localhost:5000/tours/${tourId}`);
      setTours(tours.filter(tour => tour._id !== tourId));
      setFilteredTours(filteredTours.filter(tour => tour._id !== tourId));
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  };

  const handleSaveTour = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editingTour.name);
      formData.append('description', editingTour.description);
      formData.append('price', editingTour.price);
      if (editingTour.image instanceof File) {
        formData.append('image', editingTour.image);
      }

      const response = await axios.put(`http://localhost:5000/tours/${editingTour._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setTours(tours.map(tour => (tour._id === editingTour._id ? response.data : tour)));
      setFilteredTours(filteredTours.map(tour => (tour._id === editingTour._id ? response.data : tour)));
      setEditingTour(null);
    } catch (error) {
      console.error('Error updating tour:', error);
    }
  };

  const handleBooking = async (booking) => {
    try {
      const response = await axios.post('http://localhost:5000/bookings', booking);
      setBookings([...bookings, response.data]);
    } catch (error) {
      console.error('Errore nella prenotazione:', error);
    }
  };

  const handleBookingClick = (booking) => {
    if (selectedBooking && selectedBooking._id === booking._id) {
      setSelectedBooking(null);
    } else {
      setSelectedBooking(booking);
    }
  };

  const handleEditClick = (booking) => {
    setEditingBooking(booking);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    handleEditBooking(editingBooking);
    setEditingBooking(null);
  };

  const handleEditStartDateChange = (date) => {
    setEditingBooking({ ...editingBooking, startDate: date });
  };

  const handleEditEndDateChange = (date) => {
    setEditingBooking({ ...editingBooking, endDate: date });
  };

  const handleEditBooking = async (booking) => {
    try {
      const response = await axios.put(`http://localhost:5000/bookings/${booking._id}`, booking);
      setBookings(bookings.map(b => (b._id === booking._id ? response.data : b)));
    } catch (error) {
      console.error('Errore nella modifica della prenotazione:', error);
    }
  };

  return (
    <Container fluid className="tours-page">
      <Row>
        <Col xs={12} md={8}>
          <h1 className="text-center">Esplora i Nostri Tour</h1>
          <TourListTour 
            tours={filteredTours} 
            onEdit={handleEditTour} 
            onDelete={handleDeleteTour} 
            onBook={handleBooking}
          />
        </Col>
        <Col xs={12} md={4}>
          <div className="bookings-container">
            <h2>Prenotazioni</h2>
            <ul>
              {bookings.map((booking) => (
                <li key={booking._id} onClick={() => handleBookingClick(booking)} style={{ cursor: 'pointer' }}>
                  <strong>{booking.tourName}</strong><br />
                  <p>{booking.numDays} giorni, {booking.numPeople} persone</p>
                  <p>Prezzo totale: ${booking.totalPrice.toFixed(2)}</p>
                  {selectedBooking && selectedBooking._id === booking._id && (
                    <Button variant="warning" onClick={() => handleEditClick(booking)}>Modifica</Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>

      <Modal show={!!selectedTour} onHide={() => setSelectedTour(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTour?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={`http://localhost:5000${selectedTour?.image}`} alt={selectedTour?.name} className="img-fluid mb-3" />
          <p>{selectedTour?.description}</p>
          <p className="tour-price">${selectedTour?.price}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedTour(null)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!editingTour} onHide={() => setEditingTour(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Tour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveTour}>
            <Form.Group controlId="formTourName">
              <Form.Label>Nome del Tour</Form.Label>
              <Form.Control
                type="text"
                value={editingTour?.name || ''}
                onChange={(e) => setEditingTour({ ...editingTour, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTourDescription">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editingTour?.description || ''}
                onChange={(e) => setEditingTour({ ...editingTour, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTourPrice">
              <Form.Label>Prezzo</Form.Label>
              <Form.Control
                type="number"
                value={editingTour?.price || ''}
                onChange={(e) => setEditingTour({ ...editingTour, price: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTourImage">
              <Form.Label>Immagine (URL)</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setEditingTour({ ...editingTour, image: e.target.files[0] })}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Salva
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={!!editingBooking} onHide={() => setEditingBooking(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Prenotazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingBooking && (
            <Form onSubmit={handleEditSave}>
              <Form.Group controlId="formEditStartDate">
                <Form.Label>Data di inizio</Form.Label>
                <DatePicker 
                  selected={new Date(editingBooking.startDate)}
                  onChange={handleEditStartDateChange}
                  selectsStart
                  startDate={new Date(editingBooking.startDate)}
                  endDate={new Date(editingBooking.endDate)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                />
              </Form.Group>
              <Form.Group controlId="formEditEndDate">
                <Form.Label>Data di fine</Form.Label>
                <DatePicker 
                  selected={new Date(editingBooking.endDate)}
                  onChange={handleEditEndDateChange}
                  selectsEnd
                  startDate={new Date(editingBooking.startDate)}
                  endDate={new Date(editingBooking.endDate)}
                  minDate={new Date(editingBooking.startDate)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                />
              </Form.Group>
              <Form.Group controlId="formEditNumPeople">
                <Form.Label>Numero di persone</Form.Label>
                <Form.Control
                  type="number"
                  value={editingBooking.numPeople}
                  onChange={(e) => setEditingBooking({ ...editingBooking, numPeople: e.target.value })}
                  min="1"
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">Salva</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ToursPage;

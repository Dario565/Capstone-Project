import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TourListHome from '../components/TourListHome';
import SearchBar from '../components/SearchBar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Container, Row, Col, Modal, Button, Form,  Carousel } from 'react-bootstrap';
import '../styles/HomePage.css';

function HomePage() {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [bookingTour, setBookingTour] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [numPeople, setNumPeople] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

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
    fetchTours();
  }, []);

  const handleSearch = (searchTerm, minPrice, maxPrice) => {
    const results = tours.filter(tour => {
      const matchesName = tour.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMinPrice = minPrice ? tour.price >= parseFloat(minPrice) : true;
      const matchesMaxPrice = maxPrice ? tour.price <= parseFloat(maxPrice) : true;
      return matchesName && matchesMinPrice && matchesMaxPrice;
    });
    setFilteredTours(results);
  };

  const handleDiscoverMore = () => {
    setShowServicesModal(true);
  };

  const handleBookTour = (tour) => {
    setBookingTour(tour);
    calculateTotalPrice(tour.price, startDate, endDate, numPeople);
  };

  const calculateTotalPrice = (basePrice, startDate, endDate, numPeople) => {
    const numDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const dailyIncrement = 0.05;
    const peopleIncrement = 0.05;
    const dayPrice = basePrice * Math.pow(1 + dailyIncrement, numDays - 1);
    const finalPrice = dayPrice * Math.pow(1 + peopleIncrement, numPeople - 1);
    setTotalPrice(finalPrice * numPeople);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const booking = {
        tourName: bookingTour.name,
        startDate,
        endDate,
        numPeople,
        totalPrice
      };

      await axios.post('http://localhost:5000/bookings', booking);
      window.dispatchEvent(new CustomEvent('newBooking', { detail: booking }));
      setBookingTour(null);
    } catch (error) {
      console.error('Error making booking:', error);
    }
  };

  return (
    <Container fluid className="home-page">
      
      <Carousel className="home-carousel">
        {tours.slice(0, 7).map((tour, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 carousel-image"
              src={`http://localhost:5000${tour.image}`}
              alt={tour.name}
            />
            <Carousel.Caption>
              <h3>{tour.name}</h3>
              <p>{tour.description.substring(0, 100)}...</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <SearchBar onSearch={handleSearch} />
          <h2 className="text-center mt-4">I nostri tour principali</h2>
          <TourListHome tours={filteredTours} />
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

      <Modal show={showServicesModal} onHide={() => setShowServicesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>I nostri servizi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Offriamo una vasta gamma di servizi per rendere il tuo viaggio indimenticabile. Dalla pianificazione personalizzata 
            alle escursioni guidate, garantiamo un'esperienza unica e su misura per ogni viaggiatore.
          </p>
          <ul>
            <li>Pianificazione di itinerari personalizzati</li>
            <li>Pacchetti vacanza all-inclusive</li>
            <li>Escursioni e tour guidati</li>
            <li>Estrema attenzione agli interessi dell'utente</li>
            <li>Supporto clienti 24/7</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowServicesModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!bookingTour} onHide={() => setBookingTour(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Prenota il Tour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingTour && (
            <Form onSubmit={handleBookingSubmit}>
              <Form.Group controlId="formStartDate">
                <Form.Label>Data di inizio</Form.Label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    calculateTotalPrice(bookingTour.price, date, endDate, numPeople);
                  }}
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
                  onChange={(date) => {
                    setEndDate(date);
                    calculateTotalPrice(bookingTour.price, startDate, date, numPeople);
                  }}
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
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10);
                    setNumPeople(num);
                    calculateTotalPrice(bookingTour.price, startDate, endDate, num);
                  }}
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
    </Container>
  );
}

export default HomePage;

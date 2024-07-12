import React from 'react';
import { Row, Col } from 'react-bootstrap';
import TourCard from './TourCard';
import '../styles/TourList.css';

const TourList = ({ tours, onEdit, onDelete, onBook }) => {
  return (
    <Row>
      {tours.map(tour => (
        <Col key={tour._id} xs={12} md={6} lg={4} className="mb-4">
          <TourCard tour={tour} onEdit={onEdit} onDelete={onDelete} onBook={onBook} />
        </Col>
      ))}
    </Row>
  );
};

export default TourList;

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import TourCardHome from './TourCardHome';
import '../styles/TourList.css';

const TourListHome = ({ tours }) => {
  return (
    <Row>
      {tours.map(tour => (
        <Col key={tour._id} xs={12} md={6} lg={4} className="mb-4">
          <TourCardHome tour={tour} />
        </Col>
      ))}
    </Row>
  );
};

export default TourListHome;

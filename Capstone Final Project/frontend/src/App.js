import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ToursPage from './pages/ToursPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './components/AuthPage';
import RegisterForm from './pages/RegisterForm'; 
import TourList from './components/TourList';
import AddTourForm from './components/AddTourForm';
import { AuthProvider, AuthContext } from './components/AuthContext';
import './styles/App.css';

function ProtectedRoute({ children, role }) {
  const { auth } = useContext(AuthContext);
  if (!auth.isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  if (role && auth.user.role !== role) {
    return <Navigate to="/home" />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="page-container">
          <Header />
          <div className="content-wrap">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/tours" element={<ProtectedRoute><ToursPage /></ProtectedRoute>} />
              <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
              <Route path="/register" element={<ProtectedRoute><RegisterForm /></ProtectedRoute>} />
              <Route path="/add-tour" element={<ProtectedRoute role="user"><AddTourForm /></ProtectedRoute>} />
              <Route path="/tour-list" element={<ProtectedRoute><TourList /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/auth" />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;





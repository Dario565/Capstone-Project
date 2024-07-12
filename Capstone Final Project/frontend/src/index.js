import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';  // Importa createRoot da react-dom/client
import App from './App';
import { AuthProvider } from './components/AuthContext';
import './index.css';

const root = document.getElementById('root');

// Utilizza createRoot al posto di ReactDOM.render
const initializeApp = () => {
  createRoot(root).render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
};

initializeApp();

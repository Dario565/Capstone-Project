import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RegisterForm.css'; 

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { username, password };
    try {
      await axios.post('http://localhost:5000/users/register', newUser);
      setUsername('');
      setPassword('');
      alert('Registrazione avvenuta con successo!');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Errore nella registrazione');
    }
  };

  return (
    <div className="register-form">
      <h1>Registrati</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrati</button>
      </form>
    </div>
  );
}

export default RegisterForm;


import React, { useState } from 'react';

interface PasswordGateProps {
  onAuthenticated: () => void;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_DASHBOARD_PASSWORD || 'wandermesh2024';
    
    if (password === correctPassword) {
      onAuthenticated();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="gate-wrapper">
      <div className="gate-card">
        <h2>WanderMesh Dashboard</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Please enter the password to access community leads.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">Access Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
            />
            {error && <p className="error-message">{error}</p>}
          </div>
          
          <button type="submit" className="primary-button">
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordGate;

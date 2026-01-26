import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateMatch() {
  const [opponent, setOpponent] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert("You must be logged in!");
      return;
    }

    // Send the data to NestJS
    const response = await fetch('http://localhost:3000/matches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Critical: The Coach's Badge
      },
      body: JSON.stringify({ 
        opponent, 
        date: new Date(date).toISOString() // Convert to the format NestJS expects
      }),
    });

    if (response.ok) {
      alert("Match created successfully! 📅");
      navigate('/'); // Go back to the dashboard
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`); // Will show "Match already scheduled" if date conflicts
    }
  };

  return (
    <div className="form-container">
      <h2>Schedule a New Match 📋</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
        
        <label>
          <strong>Opponent Team:</strong>
          <input 
            type="text" 
            value={opponent} 
            onChange={(e) => setOpponent(e.target.value)}
            required 
            placeholder="e.g. Paris Handball"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>

        <label>
          <strong>Date & Time:</strong>
          <input 
            type="datetime-local" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>

        <button className="btn-primary">
          Create Match
        </button>
        
        <button className="btn-primary">
          Cancel
        </button>
      </form>
    </div>
  );
}

export default CreateMatch;
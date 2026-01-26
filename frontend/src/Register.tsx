import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'joueur'
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Account created! 🎉 Please login.");
      navigate('/login');
    } else {
      const data = await response.json();
      alert("Error: " + data.message);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', color: '#0056b3' }}>Join the Club 🤾</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
        Create your profile to get started.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        </div>
        
        <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        
        <label style={{ fontSize: '0.9em', fontWeight: 'bold', color: '#444' }}>I am a:</label>
        <select name="role" onChange={handleChange}>
          <option value="joueur">Player (Joueur)</option>
          <option value="coach">Coach</option>
          <option value="contributeur">Contributor (News)</option>
        </select>

        <button type="submit" className="btn-success" style={{ width: '100%', marginTop: '10px' }}>
          Create Account
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.9em' }}>
        Already have an account? <Link to="/login" style={{ color: '#0056b3' }}>Login here</Link>
      </div>
    </div>
  );
}

export default Register;
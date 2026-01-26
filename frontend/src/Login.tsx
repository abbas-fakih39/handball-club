import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      navigate('/');
    } else {
      alert('Login Failed! ❌ Check your email/password.');
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', color: '#0056b3' }}>Welcome Back 👋</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
        Please login to manage your team.
      </p>
      
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
          Login
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.9em' }}>
        Don't have an account? <Link to="/register" style={{ color: '#0056b3' }}>Sign up here</Link>
      </div>
    </div>
  );
}

export default Login;
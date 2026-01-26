import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import CreateMatch from './CreateMatch';
import CreateNews from './CreateNews';
import { jwtDecode } from 'jwt-decode';

// --- Types ---
interface Match {
  id: number;
  opponent: string;
  date: string;
  participants: { id: number }[];
}

interface NewsItem {
  id: number;
  title: string;
  content: string;
  category: string;
  publishedAt: string;
}

interface UserToken {
  sub: number;
  role: string;
  firstName: string;
}

function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  let user: UserToken | null = null;
  if (token) {
    try { user = jwtDecode<UserToken>(token); } catch (err) {}
  }

  useEffect(() => {
    fetch('http://localhost:3000/matches').then(res => res.json()).then(data => setMatches(data));
    fetch('http://localhost:3000/news').then(res => res.json()).then(data => setNews(data));
  }, []);

  const handleJoin = async (matchId: number) => {
    if (!token) return alert("Please login first!");
    const response = await fetch(`http://localhost:3000/matches/${matchId}/join`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      alert("Joined! 🏃");
      window.location.reload();
    }
  };

  return (
    <div className="container">
      {/* HEADER */}
      <header>
        <h1>Handball Club 🤾</h1>
        {token ? (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>Hello, <strong>{user?.firstName}</strong></span>
            <button className="btn-logout" onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Logout</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/login" className="btn-outline" style={{textDecoration: 'none', padding: '8px 16px'}}>Login</Link>
            <Link to="/register" className="btn-primary" style={{textDecoration: 'none', padding: '8px 16px'}}>Sign Up</Link>
          </div>
        )}
      </header>

      {/* ACTION DASHBOARD */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {user?.role === 'coach' && (
          <button className="btn-primary" onClick={() => navigate('/create-match')}>+ Create Match</button>
        )}
        {user?.role === 'contributeur' && (
          <button className="btn-secondary" onClick={() => navigate('/create-news')}>+ Post News</button>
        )}
      </div>

      <div className="grid">
        {/* LEFT COLUMN: MATCHES */}
        <div className="form-container">
          <h2>📅 Upcoming Matches</h2>
          {matches.map(match => {
             const isJoined = user && match.participants?.some(p => p.id === user.sub);
             return (
              <div key={match.id} className="card card-match">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>Vs {match.opponent}</strong>
                    <div className="tag">🗓️ {new Date(match.date).toLocaleString()}</div>
                    <div style={{fontSize: '0.9em', marginTop: '5px'}}>Players: {match.participants?.length || 0}</div>
                  </div>
                  {user?.role === 'joueur' && (
                    isJoined ? <span style={{color:'green', fontWeight:'bold'}}>✅ Joined</span> : 
                    <button className="btn-success" onClick={() => handleJoin(match.id)}>Join</button>
                  )}
                </div>
              </div>
             )
          })}
        </div>

        {/* RIGHT COLUMN: NEWS */}
        <div className="form-container">
          <h2>📰 Club News</h2>
          {news.length === 0 && <p>No news yet.</p>}
          {news.map(item => (
            <div key={item.id} className="card card-news">
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{item.title}</h3>
              <p style={{ margin: 0, fontSize: '0.95em', color: '#555' }}>{item.content}</p>
              <div className="tag">
                {item.category} • {new Date(item.publishedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-match" element={<CreateMatch />} />
        <Route path="/create-news" element={<CreateNews />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
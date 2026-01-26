import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateNews() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // Changed from description to content
  const [category, setCategory] = useState('General');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:3000/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      // Now we send 'content' to match the database column!
      body: JSON.stringify({ title, content, category }), 
    });

    if (response.ok) {
      alert("News Posted! 📰");
      navigate('/');
    } else {
      const error = await response.json();
      alert("Error: " + (error.message || "Failed"));
    }
  };

  return (
    <div className="form-container">
      <h2>Post Club News 📰</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          placeholder="Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          style={{ padding: '8px' }} 
        />
        <textarea 
          placeholder="News Content..." 
          value={content} 
          onChange={e => setContent(e.target.value)} 
          required 
          rows={4} 
          style={{ padding: '8px' }} 
        />
        <input 
          placeholder="Category" 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          style={{ padding: '8px' }} 
        />
        
        <button className="btn-primary">Publish</button>
      </form>
    </div>
  );
}

export default CreateNews;
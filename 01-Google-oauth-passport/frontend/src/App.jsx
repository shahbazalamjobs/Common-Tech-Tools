import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, redirect } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

const Navigation = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/auth/user', { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout', { withCredentials: true })
      .then(() => {
        setUser(null);
        navigate('/'); // Redirect to the home page after logout
      })
      .catch(err => console.error('Logout Error:', err));
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      {user ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <a href="http://localhost:3000/auth/google">Login with Google</a>
      )}
    </nav>
  );
};

const Home = () => {
  return (
  <div className="container">
    <h1>Home</h1>
    <a href="http://localhost:3000/auth/google">Login with Google</a> <br />
    {/* <button onClick={handleClick}>Dashboard</button> */}
    <a href="http://localhost:5173/dashboard">Dashboard</a>
  </div>
);
}
  
 

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/auth/user', { withCredentials: true })
      .then(response => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <img src={user.picture} alt="Profile" className="profile-pic" />
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};

export default App;

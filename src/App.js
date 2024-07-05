// src/App.js or your main routing file
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from "@vercel/speed-insights/react"
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import Admin from './pages/Admin';
import UserPage from './pages/UserPage';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;

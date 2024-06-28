// src/pages/Login.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Determine if the user is admin based on email
      const isAdmin = email === 'admin@gmail.com'; // Replace with your actual admin email check

      // Store user role in local storage
      localStorage.setItem('userRole', isAdmin ? 'admin' : 'user');

      // Redirect based on user role
      if (isAdmin) {
        navigate('/admin'); // Redirect to admin page
      } else {
        navigate('/quiz'); // Redirect to quiz page for regular user
      }
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error (e.g., display error message to the user)
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;

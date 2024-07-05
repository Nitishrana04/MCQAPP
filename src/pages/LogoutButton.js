import React from 'react';
import { auth } from '../firebase'; // Import your Firebase auth instance
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user using Firebase auth
      localStorage.removeItem('userRole'); // Remove user role from local storage
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle any errors (optional)
    }
  };

  return (
    <button className="nav-link btn btn-link" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;

// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import LogoutButton from '../pages/LogoutButton';

const Navbar = ({ user }) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Quiz App</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">{user.email}</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/user">My Tests</Link>
                </li>
                {user.email === 'admin@gmail.com' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin</Link>
                  </li>
                )}
                <ul className="navbar-nav">
            <li className="nav-item">
              <LogoutButton /> {/* Render your logout button component */}
            </li>
          </ul>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

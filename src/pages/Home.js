import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const handleStartQuiz = () => {
    alert('Quiz will start after login or registration.');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Quiz App</h1>
      
      <Link to="/login"> {/* Redirect to your login page */}
        <button onClick={handleStartQuiz} style={{ padding: '10px 20px', fontSize: '1.2rem', marginTop: '20px' }}>
          Start Quiz
        </button>
      </Link>
    </div>
  );
}

export default Home;

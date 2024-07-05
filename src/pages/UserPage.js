// src/pages/UserPage.js
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const UserPage = () => {
  const [tests, setTests] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const q = query(collection(db, 'tests'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userTests = querySnapshot.docs.map(doc => doc.data());
        setTests(userTests);
      } else {
        setUser(null);
        setTests([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Test Results</h2>
      {user ? (
        <div>
          {tests.length > 0 ? (
            <ul>
              {tests.map((test, index) => (
                <li key={index}>
                  <strong>Test Date:</strong> {new Date(test.date).toLocaleDateString()} - <strong>Score:</strong> {test.score}
                </li>
              ))}
            </ul>
          ) : (
            <p>No test results found.</p>
          )}
        </div>
      ) : (
        <p>Please log in to view your test results.</p>
      )}
    </div>
  );
};

export default UserPage;

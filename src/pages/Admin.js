import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import './CSS/Admin.css'; 

const Admin = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [mcqs, setMcqs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchMCQs = async () => {
      try {
        const mcqsCollection = db.collection('mcqs');
        const snapshot = await mcqsCollection.get();
        const mcqList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMcqs(mcqList);
      } catch (error) {
        console.error('Error fetching MCQs: ', error);
      }
    };

    fetchMCQs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing MCQ
        const mcqRef = db.collection('mcqs').doc(editingId);
        await mcqRef.update({
          question,
          options,
          correctAnswer
        });
        setEditingId(null);
      } else {
        // Add new MCQ
        const mcqRef = db.collection('mcqs');
        await mcqRef.add({
          question,
          options,
          correctAnswer
        });
      }

      // Clear form fields after successful submission
      setQuestion('');
      setOptions([]);
      setCorrectAnswer('');

      alert(editingId ? 'MCQ updated successfully!' : 'MCQ added successfully!');
    } catch (error) {
      console.error('Error adding/updating MCQ: ', error);
      alert('Failed to add/update MCQ. Check console for details.');
    }
  };

  const handleEdit = (mcq) => {
    setQuestion(mcq.question);
    setOptions(mcq.options);
    setCorrectAnswer(mcq.correctAnswer);
    setEditingId(mcq.id);
  };

  const handleDelete = async (id) => {
    try {
      const mcqRef = db.collection('mcqs').doc(id);
      await mcqRef.delete();
      alert('MCQ deleted successfully!');
    } catch (error) {
      console.error('Error deleting MCQ: ', error);
      alert('Failed to delete MCQ. Check console for details.');
    }
  };

  const handleOptionChange = (e, index) => {
    const updatedOptions = [...options];
    updatedOptions[index] = e.target.value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (indexToRemove) => {
    const updatedOptions = options.filter((option, index) => index !== indexToRemove);
    setOptions(updatedOptions);
  };

  return (
    <div className="admin-container">
      <h2>Add/Manage MCQs</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Question:
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="input-field"
          />
        </label>
        <br />
        <label>
          Options:
          {options.map((option, index) => (
            <div key={index} className="option-container">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(e, index)}
                required
                className="option-field"
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="remove-option-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addOption} className="add-option-btn">Add Option</button>
        </label>
        <br />
        <label>
          Correct Answer:
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
            className="input-field"
          />
        </label>
        <br />
        <button type="submit" className="submit-btn">{editingId ? 'Update MCQ' : 'Submit MCQ'}</button>
      </form>

      <div className="mcq-list">
        <h2>Existing MCQs</h2>
        <ul>
          {mcqs.map(mcq => (
            <li key={mcq.id} className="mcq-item">
              <div>
                <strong>Question:</strong> {mcq.question}
              </div>
              <div>
                <strong>Options:</strong> {mcq.options.join(', ')}
              </div>
              <div>
                <strong>Correct Answer:</strong> {mcq.correctAnswer}
              </div>
              <button onClick={() => handleEdit(mcq)} className="edit-btn">Edit</button>
              <button onClick={() => handleDelete(mcq.id)} className="delete-btn">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;

import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Import db and auth from Firebase
import { collection, addDoc } from 'firebase/firestore';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [quizTime] = useState(60); // Quiz time in seconds per question
  const [timeLeft, setTimeLeft] = useState(0); // Time left for current question in seconds
  const [questionTimer, setQuestionTimer] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsSnapshot = await db.collection('mcqs').get();
        const fetchedQuestions = questionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    return () => {
      if (questionTimer) {
        clearInterval(questionTimer);
      }
    };
  }, [questionTimer]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    startQuestionTimer();
  };

  const startQuestionTimer = () => {
    if (questionTimer) {
      clearInterval(questionTimer);
    }
    setTimeLeft(quizTime);
    setQuestionTimer(setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(questionTimer);
          nextQuestion();
          return quizTime;
        }
        return prevTime - 1;
      });
    }, 1000));
  };

  const finishQuiz = async () => {
    setQuizEnded(true);
    setQuizStarted(false);
    calculateResults();

    // Save test results to Firestore
    const user = auth.currentUser;
  if (user) {
    try {
      await addDoc(collection(db, 'tests'), {
        userId: user.uid,
        date: new Date().toISOString(),
        score: correctAnswers,
        // Add other necessary details
      });
    } catch (error) {
      console.error('Error saving test results:', error);
    }
  } else {
    console.error('User not authenticated.');
  }
};

  const calculateResults = () => {
    let correctCount = 0;
    let incorrectQs = [];
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      } else {
        incorrectQs.push(index + 1);
      }
    });
    setCorrectAnswers(correctCount);
    setWrongAnswers(questions.length - correctCount);
    setIncorrectQuestions(incorrectQs);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const nextQuestion = () => {
    if (selectedOption) {
      setAnsweredQuestions(prev => ({
        ...prev,
        [currentQuestionIndex]: true
      }));
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: selectedOption
      }));
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption('');
      startQuestionTimer(); // Start timer for next question
    } else {
      clearInterval(questionTimer); // Stop timer if last question
      finishQuiz();
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  const getQuestionBoxStyle = (index) => {
    if (index === currentQuestionIndex) {
      return { backgroundColor: 'white', borderRadius: '50%', padding: '10px', border: '2px solid #000' };
    } else if (answeredQuestions[index]) {
      return { backgroundColor: 'green', borderRadius: '50%', padding: '10px', border: '2px solid #000' };
    } else {
      return { backgroundColor: '#ccc', borderRadius: '50%', padding: '10px', border: '2px solid #000' };
    }
  };

  if (!quizStarted && !quizEnded) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Start Quiz</h1>
        <button onClick={handleStartQuiz} style={{ padding: '10px 20px', fontSize: '1.2rem' }}>Start Quiz</button>
      </div>
    );
  }

  if (quizStarted && !quizEnded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: '0 0 70%', padding: '20px' }}>
          <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
          {questions[currentQuestionIndex] && (
            <>
              <h3>{questions[currentQuestionIndex].question}</h3>
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <input
                    type="radio"
                    id={`option${index}`}
                    name="options"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => handleOptionSelect(option)}
                    style={{ marginRight: '10px' }}
                  />
                  <label htmlFor={`option${index}`}>{option}</label>
                </div>
              ))}
            </>
          )}
          <br />
          <button onClick={nextQuestion} style={{ padding: '10px 20px', fontSize: '1.2rem' }}>Next Question</button>
        </div>
        <div style={{ flex: '0 0 30%', padding: '20px', borderLeft: '1px solid #ccc' }}>
          <p>Time Left: {formatTime(timeLeft)}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {questions.map((_, index) => (
              <div key={index} style={getQuestionBoxStyle(index)}>
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Quiz Results</h2>
        <p>Correct Answers: {correctAnswers}</p>
        <p>Wrong Answers: {wrongAnswers}</p>
        <p>Percentage: {(correctAnswers / questions.length) * 100}%</p>
        {incorrectQuestions.length > 0 && (
          <div>
            <h3>Incorrect Questions:</h3>
            <ul>
              {incorrectQuestions.map((qNum, index) => (
                <li key={index}>Question {qNum}</li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', fontSize: '1.2rem' }}>Start Again</button>
      </div>
    );
  }

  return null;
};

export default Quiz;

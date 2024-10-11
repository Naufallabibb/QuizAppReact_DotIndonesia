import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Loading from './components/Loading';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    const storedQuizData = localStorage.getItem('quizData');
    
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
    }
    
    if (storedQuizData) {
      setQuizData(JSON.parse(storedQuizData));
      setCurrentQuestionNumber(parseInt(localStorage.getItem('currentQuestionNumber')) || 1);
      setAnswers(JSON.parse(localStorage.getItem('answers')) || []);
      setTimeRemaining(parseInt(localStorage.getItem('timeRemaining')) || 600);
    }
  }, []);

  useEffect(() => {
    if (quizData) {
      localStorage.setItem('quizData', JSON.stringify(quizData));
      localStorage.setItem('currentQuestionNumber', currentQuestionNumber);
      localStorage.setItem('answers', JSON.stringify(answers));
      localStorage.setItem('timeRemaining', timeRemaining);
      localStorage.setItem('isLoggedIn', isLoggedIn);
    }
  }, [quizData, currentQuestionNumber, answers, timeRemaining, isLoggedIn]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await fetchQuizData();
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/quiz');
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setQuizData(null);
      setCurrentQuestionNumber(1);
      setAnswers([]);
      setTimeRemaining(600);
      localStorage.clear();
      setIsLoading(false);
      navigate('/');
    }, 1000); // Simulating a short delay for the loading state
  };

  const fetchQuizData = async () => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&category=31&difficulty=easy&type=multiple');
      const data = await response.json();
      setQuizData(data.results);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
      throw error;
    }
  };

  const handleAnswer = (answer, questionIndex) => {
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = answer;
      return newAnswers;
    });
  };

  const handleTimeout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/result');
    }, 1000);
  };

  const handleQuizCompletion = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/result');
    }, 1000);
  };

  const handleRetry = async () => {
    setIsLoading(true);
    try {
      await fetchQuizData();
      setCurrentQuestionNumber(1);
      setAnswers([]);
      setTimeRemaining(600);
      navigate('/quiz');
    } catch (error) {
      console.error('Error retrying quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="app-container">
      <Routes>
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/quiz" replace /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/quiz" 
          element={
            isLoggedIn ? (
              <Quiz
                questions={quizData}
                onAnswer={handleAnswer}
                timeRemaining={timeRemaining}
                setTimeRemaining={setTimeRemaining}
                onTimeout={handleTimeout}
                totalQuestions={quizData?.length || 0}
                currentQuestionNumber={currentQuestionNumber}
                setCurrentQuestionNumber={setCurrentQuestionNumber}
                answers={answers}
                onComplete={handleQuizCompletion}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/result" 
          element={
            isLoggedIn ? (
              <Result 
                answers={answers} 
                questions={quizData} 
                onRetry={handleRetry}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
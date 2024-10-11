import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CustomAlert({ isOpen, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="custom-alert-overlay">
            <div className="custom-alert">
                <p className="custom-alert-message">{message}</p>
                <div className="custom-alert-buttons">
                    <button onClick={onConfirm} className="custom-alert-button confirm">Yes</button>
                    <button onClick={onCancel} className="custom-alert-button cancel">No</button>
                </div>
            </div>
        </div>
    );
}

function Quiz({
    questions,
    onAnswer,
    timeRemaining,
    setTimeRemaining,
    onTimeout,
    totalQuestions,
    currentQuestionNumber,
    setCurrentQuestionNumber,
    answers,
    onComplete,
}) {
    // eslint-disable-next-line
    const navigate = useNavigate();
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    const currentQuestion = questions[currentQuestionNumber - 1];

    const questionAnswers = useMemo(() => {
        if (!currentQuestion) return [];
        return [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort();
    }, [currentQuestion]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    onTimeout();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [setTimeRemaining, onTimeout]);

    useEffect(() => {
        setSelectedAnswer(answers[currentQuestionNumber - 1] || null);
    }, [currentQuestionNumber, answers]);

    if (!currentQuestion) return null;

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
        onAnswer(answer, currentQuestionNumber - 1);
        
        if (currentQuestionNumber < totalQuestions) {
            setTimeout(() => {
                setCurrentQuestionNumber(currentQuestionNumber + 1);
            }, 500);
        }
    };

    const handleQuestionChange = (questionNumber) => {
        setCurrentQuestionNumber(questionNumber);
    };

    const handlePrevious = () => {
        if (currentQuestionNumber > 1) {
            setCurrentQuestionNumber(currentQuestionNumber - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionNumber < totalQuestions) {
            setCurrentQuestionNumber(currentQuestionNumber + 1);
        } else {
            setShowAlert(true);
        }
    };

    const handleConfirmSubmit = () => {
        setShowAlert(false);
        onComplete();
    };

    const handleCancelSubmit = () => {
        setShowAlert(false);
    };

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <h2 className="question-number">Question {currentQuestionNumber} of {totalQuestions}</h2>
                <p className="timer">Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</p>
            </div>
            <div className="question-navigation">
                {[...Array(totalQuestions)].map((_, index) => (
                    <button
                        key={index}
                        className={`question-nav-button ${index + 1 === currentQuestionNumber ? 'active' : ''} ${answers[index] ? 'answered' : ''}`}
                        onClick={() => handleQuestionChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <h3 className="question-text" dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></h3>
            <div className="answers-container">
                {questionAnswers.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerSelect(answer)}
                        className={`answer-button ${selectedAnswer === answer ? 'selected' : ''}`}
                    >
                        <span dangerouslySetInnerHTML={{ __html: answer }}></span>
                    </button>
                ))}
            </div>
            <div className="navigation-buttons">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestionNumber === 1}
                >
                    Previous
                </button>
                <button onClick={handleNext}>
                    {currentQuestionNumber === totalQuestions ? 'Finish' : 'Next'}
                </button>
            </div>

            <CustomAlert
                isOpen={showAlert}
                message="Are you sure you want to submit your answers?"
                onConfirm={handleConfirmSubmit}
                onCancel={handleCancelSubmit}
            />
        </div>
    );
}

export default Quiz;
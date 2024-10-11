import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function Result({ answers = [], questions = [], onRetry, onLogout }) {
    if (!answers.length || !questions.length) {
        return (
            <div className="result-container">
                <h1 className="result-title">No Quiz Data Available</h1>
                <button onClick={onRetry} className="retry-button">Start New Quiz</button>
            </div>
        );
    }

    const correctAnswers = answers.filter((answer, index) => 
        questions[index] && answer === questions[index].correct_answer
    );
    const incorrectAnswers = answers.filter((answer, index) => 
        questions[index] && answer !== questions[index].correct_answer
    );
    const score = (correctAnswers.length / questions.length) * 100;

    return (
        <div className="result-container">
            <button onClick={onLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt } className="logout-icon" />
                </button>
            <div className="result-summary">
                <h1 className="result-title">Quiz Results</h1>
                <div className="score-circle">
                    <div className="score-number">{Math.round(score)}%</div>
                    <div className="score-label">Score</div>
                </div>
                <div className="stats-grid">
                    <div className="stat-box correct">
                        <div className="stat-number">{correctAnswers.length}</div>
                        <div className="stat-label">Correct</div>
                    </div>
                    <div className="stat-box incorrect">
                        <div className="stat-number">{incorrectAnswers.length}</div>
                        <div className="stat-label">Incorrect</div>
                    </div>
                    <div className="stat-box total">
                        <div className="stat-number">{questions.length}</div>
                        <div className="stat-label">Total</div>
                    </div>
                </div>
            </div>

            <div className="answers-review">
                <h2>Detailed Review</h2>
                {questions.map((question, index) => (
                    question && (
                        <div key={index} className={`question-review ${
                            answers[index] === question.correct_answer ? 'correct' : 'incorrect'
                        }`}>
                            <div className="question-number">Question {index + 1}</div>
                            <h3 className="question-text" dangerouslySetInnerHTML={{ __html: question.question }}></h3>
                            <div className="answer-section">
                                <p className="user-answer">
                                    <span className="answer-label">Your Answer:</span>
                                    <span className="answer-text" dangerouslySetInnerHTML={{ 
                                        __html: answers[index] || "Not answered" 
                                    }}></span>
                                </p>
                                {answers[index] !== question.correct_answer && (
                                    <p className="correct-answer">
                                        <span className="answer-label">Correct Answer:</span>
                                        <span className="answer-text" dangerouslySetInnerHTML={{ 
                                            __html: question.correct_answer 
                                        }}></span>
                                    </p>
                                )}
                            </div>
                        </div>
                    )
                ))}
            </div>
            
            <button onClick={onRetry} className="retry-button">Try Again</button>
        </div>
    );
}

export default Result;
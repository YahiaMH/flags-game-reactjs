// src/components/Quiz.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { getFlags } from '../data/flags';
import '../styles/Quiz.css';

export default function Quiz({ difficulty, onBack, user }) {
    const [currentCountry, setCurrentCountry] = useState(null);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [feedback, setFeedback] = useState(null);
    const [remainingCountries, setRemainingCountries] = useState([]);
    const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);

    useEffect(() => {
        setRemainingCountries(getFlags(difficulty));
        fetchHighScore();
    }, [difficulty, user]);

    useEffect(() => {
        if (remainingCountries.length > 0) {
            generateQuestion();
        }
    }, [remainingCountries]);

    const fetchHighScore = async () => {
        if (!user) return;
        const userScoreDoc = doc(db, 'userScores', user.uid);
        const docSnap = await getDoc(userScoreDoc);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setHighScore(data[difficulty] || 0);
        }
    };

    const updateHighScore = async (newScore) => {
        if (!user) return;
        const userScoreDoc = doc(db, 'userScores', user.uid);
        const docSnap = await getDoc(userScoreDoc);
        const currentData = docSnap.exists() ? docSnap.data() : {};
        
        if (newScore > (currentData[difficulty] || 0)) {
            await setDoc(userScoreDoc, {
                ...currentData,
                [difficulty]: newScore,
                displayName: user.displayName,
                photoURL: user.photoURL
            }, { merge: true });
            setHighScore(newScore);
        }
    };

    const generateQuestion = () => {
        if (remainingCountries.length === 0) {
            return;
        }

        const index = Math.floor(Math.random() * remainingCountries.length);
        const correct = remainingCountries[index];

        const others = getFlags(difficulty)
            .filter(c => c.name !== correct.name)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        const allOptions = [...others, correct]
            .sort(() => 0.5 - Math.random());

        setCurrentCountry(correct);
        setOptions(allOptions);
        setFeedback(null);
    };

    const handleAnswer = (selected) => {
        if (isProcessingAnswer) return;
        setIsProcessingAnswer(true);

        const correct = selected.name === currentCountry.name;

        if (correct) {
            const newScore = score + 1;
            setScore(newScore);
            updateHighScore(newScore);
            setFeedback({ type: 'correct', message: 'Correct!' });
        } else {
            setScore(0);
            setFeedback({ type: 'wrong', message: 'Incorrect!' });
        }

        setTimeout(() => {
            if (correct && remainingCountries.length <= 1) {
                setFeedback({ type: 'complete', message: `Congratulations! You've completed the ${difficulty} difficulty!` });
            } else {
                if (correct) {
                    setRemainingCountries(countries => countries.filter(c => c.name !== currentCountry.name));
                }
                generateQuestion();
                setIsProcessingAnswer(false);
            }
        }, correct ? 1500 : 3500);
    };

    if (!currentCountry) return null;

    return (
        <div className="quiz-container">
            <div className="header">
                <button onClick={onBack} className="back-button">
                    Back
                </button>
                <div className="score-container">
                    <div className="current-score">Score: {score}</div>
                    <div className="high-score">High Score: {highScore}</div>
                </div>
            </div>

            <div className="content">
                <div className="flag-container">
                    <img
                        src={`https://flagcdn.com/w640/${currentCountry.code}.png`}
                        alt="Flag"
                        className="flag-image"
                    />
                </div>

                <div className="options-grid">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            disabled={isProcessingAnswer}
                            className={`option-button ${
                                feedback
                                    ? option.name === currentCountry.name
                                        ? 'correct'
                                        : 'incorrect'
                                    : ''
                            }`}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>

                {feedback && (
                    <div className={`feedback ${feedback.type}`}>
                        {feedback.message}
                    </div>
                )}
            </div>
        </div>
    );
}
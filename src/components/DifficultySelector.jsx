// src/components/DifficultySelector.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import '../styles/DifficultySelector.css';

export default function DifficultySelector({ onSelectDifficulty, user }) {
    const difficulties = ['easy', 'medium', 'hard'];
    const [userScores, setUserScores] = useState({});

    useEffect(() => {
        fetchUserScores();
    }, [user]);

    const fetchUserScores = async () => {
        if (!user) return;
        const userScoreDoc = doc(db, 'userScores', user.uid);
        const docSnap = await getDoc(userScoreDoc);
        if (docSnap.exists()) {
            setUserScores(docSnap.data());
        }
    };

    return (
        <div className="difficulty-screen">
            <h2 className="difficulty-title">Select Difficulty</h2>
            <div className="difficulty-buttons">
                {difficulties.map((difficulty) => (
                    <button
                        key={difficulty}
                        onClick={() => onSelectDifficulty(difficulty)}
                        className={`difficulty-button ${difficulty}`}
                    >
                        <span className="difficulty-name">{difficulty}</span>
                        <span className="difficulty-score">
                            High Score: {userScores[difficulty] || 0}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
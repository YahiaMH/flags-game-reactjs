import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import '../styles/Leaderboard.css';

export default function Leaderboard({ onBack }) {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchScores() {
            const scoresRef = collection(db, 'highScores');
            const q = query(scoresRef, orderBy('score', 'desc'), limit(10));
            const querySnapshot = await getDocs(q);
            const scoresList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setScores(scoresList);
            setLoading(false);
        }
        fetchScores();
    }, []);

    return (
        <div className="leaderboard-container">
            <div className="header">
                <button onClick={onBack} className="back-button">
                    Back
                </button>
                <h2 className="leaderboard-title">Top Scores</h2>
            </div>
            
            {loading ? (
                <div className="loading">Loading scores...</div>
            ) : (
                <div className="scores-list">
                    {scores.map((score, index) => (
                        <div key={score.id} className="score-item">
                            <div className="rank">{index + 1}</div>
                            <div className="player-info">
                                <img src={score.photoURL} alt="" className="player-avatar" />
                                <span className="player-name">{score.displayName}</span>
                            </div>
                            <div className="score-details">
                                <div className="score">{score.score}</div>
                                <div className="difficulty">{score.difficulty}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 
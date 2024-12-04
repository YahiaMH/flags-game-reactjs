// src/App.jsx
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import LoginScreen from './components/LoginScreen';
import DifficultySelector from './components/DifficultySelector';
import Quiz from './components/Quiz';
import UserMenu from './components/UserMenu';
import './styles/App.css';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setScreen('difficulty');
      } else {
        setUser(null);
        setScreen('login');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    setScreen('difficulty');
  };

  const handleSelectDifficulty = (diff) => {
    setDifficulty(diff);
    setScreen('quiz');
  };

  const handleBackToMenu = () => {
    setScreen('difficulty');
    setDifficulty(null);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {user && <UserMenu user={user} />}
        {screen === 'login' && <LoginScreen onLogin={handleLogin} />}
        {screen === 'difficulty' && <DifficultySelector onSelectDifficulty={handleSelectDifficulty} user={user} />}
        {screen === 'quiz' && <Quiz difficulty={difficulty} onBack={handleBackToMenu} user={user} />}
      </div>
    </div>
  );
}
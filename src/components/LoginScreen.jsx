import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';
import '../styles/LoginScreen.css';

export default function LoginScreen({ onLogin }) {
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            onLogin(result.user);
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    return (
        <div className="login-screen">
            <div className="login-card">
                <h1 className="login-title">Flag Quiz Game</h1>
                <button onClick={handleGoogleLogin} className="google-login-button">
                    <img 
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                        alt="Google logo" 
                        className="google-icon" 
                    />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
} 
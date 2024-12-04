import '../styles/UserMenu.css';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';

export default function UserMenu({ user }) {
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="user-menu">
            <div className="user-info">
                <img 
                    src={user.photoURL} 
                    alt={user.displayName} 
                    className="user-avatar"
                />
                <span className="user-name">{user.displayName}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
                Sign Out
            </button>
        </div>
    );
} 
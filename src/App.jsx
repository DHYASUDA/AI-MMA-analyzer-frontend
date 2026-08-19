import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import SignUp from './SignUp';
import Login from './Login';
import Home from './Home';
import UpcomingFights from './UpcomingFights';
import FightAnalyzer from './fightAnalyzer';
import { getStoredUser, storeUser, clearStoredUser } from './auth';

function App() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => getStoredUser());

    const handleLoginSuccess = (userData) => {
        const safeUser = storeUser(userData);
        setUser(safeUser);
    };

    const handleLogout = () => {
        clearStoredUser();
        setUser(null);
        navigate('/login');
    };

    const requireAuth = (element) =>
        user ? element : <Navigate to="/login" replace />;

    return (
        <Routes>
            <Route
                path="/"
                element={
                    user
                        ? <Navigate to="/home" replace />
                        : (
                            <div className="landing">
                                <h1>MMA Fight Hub</h1>
                                <div className="landing-actions">
                                    <button onClick={() => navigate('/login')}>Login</button>
                                    <button onClick={() => navigate('/signup')}>Sign up</button>
                                </div>
                            </div>
                        )
                }
            />
            <Route path="/signup" element={<SignUp />} />
            <Route
                path="/login"
                element={
                    user
                        ? <Navigate to="/home" replace />
                        : <Login onLoginSuccess={handleLoginSuccess} />
                }
            />
            <Route path="/home" element={requireAuth(<Home user={user} onLogout={handleLogout} />)} />
            <Route path="/upcomingfights" element={requireAuth(<UpcomingFights user={user} onLogout={handleLogout} />)} />
            <Route path="/fightAnalyzer" element={requireAuth(<FightAnalyzer user={user} onLogout={handleLogout} />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addScore } from '../services/api';
import Leaderboard from './Leaderboard';
import '../index.css';

const Game = () => {
    const [score, setScore] = useState('');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [refreshLeaderboard, setRefreshLeaderboard] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(loggedInUser));
        }
    }, [navigate]);

    const handleSubmitScore = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!score || isNaN(score)) {
            setMessage('Please enter a valid number');
            return;
        }

        try {
            const response = await addScore({
                user_id: user.id,
                score: parseInt(score)
            });

            setMessage(`Success! Last Score: ${response.data.userUpdates.last_score}, Best Score: ${response.data.userUpdates.best_score}`);
            setScore('');

            const updatedUser = { ...user, best_score: response.data.userUpdates.best_score };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            // Trigger leaderboard refresh
            setRefreshLeaderboard(prev => prev + 1);

        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to add score');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="game-page-layout" style={{
            display: 'flex',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
            gap: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
        }}>
            <div className="game-container" style={{ flex: '1', minWidth: '350px', maxWidth: '500px' }}>
                <h1>Dummy Game</h1>
                <div style={{ marginBottom: '2rem', padding: '1rem', background: '#333', borderRadius: '8px' }}>
                    <p>Logged in as: <strong>{user.username}</strong></p>
                    <p>Your Best Score: <strong>{user.best_score}</strong></p>
                    <p>My Profile: <span style={{ color: '#646cff', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate(`/profile/${user.id}`)}>View</span></p>
                </div>

                <form onSubmit={handleSubmitScore} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label>Enter Dummy Score:</label>
                    <input
                        type="number"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="e.g. 100"
                        style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#2a2a2a', color: 'white' }}
                    />
                    <button type="submit">Submit Score</button>
                </form>

                {message && <p style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>{message}</p>}

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/')} style={{ background: '#444' }}>Back to Home</button>
                    <button onClick={handleLogout} style={{ background: '#c0392b' }}>Logout</button>
                </div>
            </div>

            <div className="side-leaderboard" style={{ flex: '1', minWidth: '350px', maxWidth: '600px' }}>
                <Leaderboard isComponent={true} refreshTrigger={refreshLeaderboard} />
            </div>
        </div>
    );
};

export default Game;

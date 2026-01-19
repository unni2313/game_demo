import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../services/api';
import '../index.css';

const Leaderboard = ({ isComponent = false, refreshTrigger }) => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchLeaderboard = async () => {
        try {
            const response = await getLeaderboard();
            setLeaders(response.data);
        } catch (err) {
            setError('Failed to load leaderboard');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [refreshTrigger]);

    return (
        <div className="leaderboard-container" style={{ width: '100%', maxWidth: isComponent ? '100%' : '600px', margin: isComponent ? '0' : '0 auto', padding: isComponent ? '1rem' : '2rem' }}>
            <h1>Scoreboard</h1>
            {!isComponent && <p>Top Players & Their Scores</p>}

            <div style={{ marginTop: '1rem', background: '#333', borderRadius: '12px', overflow: 'hidden' }}>
                {loading ? (
                    <p style={{ padding: '2rem' }}>Loading scores...</p>
                ) : error ? (
                    <p style={{ padding: '2rem', color: '#ff6b6b' }}>{error}</p>
                ) : leaders.length === 0 ? (
                    <p style={{ padding: '2rem' }}>No scores yet. Be the first!</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#444' }}>
                                <th style={{ padding: '1rem' }}>Rank</th>
                                <th style={{ padding: '1rem' }}>Player</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaders.map((player, index) => (
                                <tr key={player._id} style={{ borderBottom: '1px solid #555' }}>
                                    <td style={{ padding: '1rem' }}>#{index + 1}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span
                                            style={{ color: '#646cff', cursor: 'pointer', textDecoration: 'underline' }}
                                            onClick={() => navigate(`/profile/${player.username}`)}
                                        >
                                            {player.username}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#646cff', width: '100px' }}>
                                        {player.best_score}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {!isComponent && (
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/game')}>Play Game</button>
                    <button onClick={() => navigate('/')} style={{ background: '#444' }}>Back to Home</button>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;

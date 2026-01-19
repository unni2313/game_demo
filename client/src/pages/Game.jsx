import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startMatch, addBall, getMatchDetails } from '../services/api';
import Leaderboard from './Leaderboard';
import '../index.css';

const Game = () => {
    const [user, setUser] = useState(null);
    const [gameState, setGameState] = useState('setup'); // setup, playing, result
    const [matchData, setMatchData] = useState(null);
    const [balls, setBalls] = useState([]);
    const [message, setMessage] = useState('');
    const [refreshLeaderboard, setRefreshLeaderboard] = useState(0);

    // Setup Form State
    const [setupForm, setSetupForm] = useState({
        totalOvers: 2,
        totalRunsNeeded: 20,
        difficulty: 'medium',
        innings: 1
    });

    // Ball Input State
    const [ballForm, setBallForm] = useState({
        runs: 0,
        wicket: false,
        angle: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(loggedInUser));
        }
    }, [navigate]);

    const handleStartMatch = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await startMatch({
                ...setupForm,
                playerId: user.id
            });
            setMatchData(response.data.matchStatus || response.data.data);
            setMatchData(prev => ({ ...prev, _id: response.data.matchId })); // Ensure matchId is stored
            setBalls([]); // Reset balls for new match
            setGameState('playing');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to start match');
        }
    };

    const handleAddBall = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await addBall({
                matchId: matchData._id,
                runs: parseInt(ballForm.runs),
                wicket: ballForm.wicket,
                angle: ballForm.angle
            });

            const updatedMatch = response.data.matchStatus;
            setMatchData(updatedMatch);
            setBalls(prev => [...prev, response.data.ball]); // Add new ball
            setBallForm({ runs: 0, wicket: false, angle: '' });

            if (updatedMatch.status !== 'in-progress') {
                setGameState('result');
                // Use the updated total score from backend
                const updatedUser = { ...user, best_score: updatedMatch.userTotalScore };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setRefreshLeaderboard(prev => prev + 1);
            }
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to add ball');
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
            <div className="game-container" style={{ flex: '1', minWidth: '350px', maxWidth: '500px', background: '#222', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#646cff' }}>Cricket Demo</h1>

                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#333', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <p>Player: <strong>{user.username}</strong> | Total scores: <strong>{user.best_score}</strong></p>
                </div>

                {gameState === 'setup' && (
                    <div className="setup-section">
                        <h3>Match Settings</h3>
                        <form onSubmit={handleStartMatch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <div className="form-group">
                                <label>Total Overs:</label>
                                <input
                                    type="number"
                                    value={setupForm.totalOvers}
                                    onChange={(e) => setSetupForm({ ...setupForm, totalOvers: e.target.value })}
                                    min="1" max="20" required
                                />
                            </div>
                            <div className="form-group">
                                <label>Target Runs:</label>
                                <input
                                    type="number"
                                    value={setupForm.totalRunsNeeded}
                                    onChange={(e) => setSetupForm({ ...setupForm, totalRunsNeeded: e.target.value })}
                                    min="1" required
                                />
                            </div>
                            <div className="form-group">
                                <label>Difficulty:</label>
                                <select
                                    value={setupForm.difficulty}
                                    onChange={(e) => setSetupForm({ ...setupForm, difficulty: e.target.value })}
                                    style={{ padding: '0.8rem', borderRadius: '6px', background: '#2a2a2a', color: 'white' }}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Innings:</label>
                                <input
                                    type="number"
                                    value={setupForm.innings}
                                    onChange={(e) => setSetupForm({ ...setupForm, innings: e.target.value })}
                                    min="1" max="2" required
                                />
                            </div>
                            <button type="submit" style={{ marginTop: '1rem' }}>Start Match</button>
                        </form>
                    </div>
                )}

                {gameState === 'playing' && matchData && (
                    <div className="playing-section">
                        <div style={{ background: '#111', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.8rem', color: '#646cff', marginBottom: '0.5rem', fontWeight: 'bold' }}>INNINGS {matchData.innings}</div>
                            <h2 style={{ margin: 0 }}>Score: {matchData.currentScore} / {matchData.currentWickets}</h2>
                            <p style={{ margin: '0.5rem 0 0', color: '#aaa' }}>Target: {matchData.totalRunsNeeded} (Max Overs: {matchData.targetOvers})</p>
                        </div>

                        <form onSubmit={handleAddBall} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Runs on this ball:</label>
                                <select
                                    value={ballForm.runs}
                                    onChange={(e) => setBallForm({ ...ballForm, runs: e.target.value })}
                                >
                                    {[0, 1, 2, 3, 4, 6].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    id="wicket"
                                    checked={ballForm.wicket}
                                    onChange={(e) => setBallForm({ ...ballForm, wicket: e.target.checked })}
                                />
                                <label htmlFor="wicket">Wicket!</label>
                            </div>
                            <div className="form-group">
                                <label>Shot Angle (Optional):</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 45"
                                    value={ballForm.angle}
                                    onChange={(e) => setBallForm({ ...ballForm, angle: e.target.value })}
                                />
                            </div>
                            <button type="submit" style={{ background: '#27ae60' }}>Add Ball</button>
                        </form>

                        {/* Over Log Section */}
                        <div style={{ marginTop: '2rem', padding: '1rem', background: '#1a1a1a', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#aaa', fontSize: '0.8rem', textTransform: 'uppercase' }}>Over Log</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {[...Array(Number(matchData.targetOvers))].map((_, i) => {
                                    const overNum = i + 1;
                                    const overBalls = balls.filter(b => b.overNumber === overNum);
                                    if (overBalls.length === 0 && overNum > 1 && overNum > Math.max(...balls.map(b => b.overNumber || 0))) return null;

                                    return (
                                        <div key={overNum}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#888', minWidth: '50px' }}>Over {overNum}</span>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    {overBalls.map((b, idx) => (
                                                        <div key={idx} style={{
                                                            width: '28px', height: '28px', borderRadius: '50%',
                                                            background: b.wicket ? '#e74c3c' : (b.runs === 4 || b.runs === 6 ? '#2ecc71' : '#333'),
                                                            border: '1px solid #444',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '0.8rem', fontWeight: 'bold', color: 'white'
                                                        }}>
                                                            {b.wicket ? 'W' : b.runs}
                                                        </div>
                                                    ))}
                                                    {[...Array(Math.max(0, 6 - overBalls.length))].map((_, idx) => (
                                                        <div key={`empty-${idx}`} style={{
                                                            width: '28px', height: '28px', borderRadius: '50%',
                                                            background: 'transparent', border: '1px dashed #444',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                        }}></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="result-section" style={{ textAlign: 'center' }}>
                        <div style={{
                            padding: '2rem',
                            background: matchData.status === 'won' ? 'rgba(39, 174, 96, 0.2)' : 'rgba(192, 57, 43, 0.2)',
                            borderRadius: '12px',
                            marginBottom: '1.5rem'
                        }}>
                            <h2 style={{ color: matchData.status === 'won' ? '#2ecc71' : '#e74c3c' }}>
                                MATCH {matchData.status.toUpperCase()}!
                            </h2>
                            <p>Final Score: {matchData.currentScore} / {matchData.currentWickets}</p>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem' }}>
                                Rank Points: <span style={{ color: matchData.matchPoints >= 0 ? '#2ecc71' : '#e74c3c' }}>
                                    {matchData.matchPoints >= 0 ? '+' : ''}{matchData.matchPoints}
                                </span>
                            </p>
                        </div>
                        <button onClick={() => setGameState('setup')} style={{ width: '100%' }}>New Match</button>
                    </div>
                )}

                {message && <p className="status-message">{message}</p>}

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/')} style={{ background: '#444' }}>Home</button>
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

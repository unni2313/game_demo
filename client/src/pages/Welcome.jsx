import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'; 

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <h1>Multiplayer Dash</h1>
            <p>Compete, Score, Win!</p>

            <div className="action-buttons" style={{ marginTop: '2rem', display: 'flex' ,gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/register')}>Register</button>
            </div>

            <footer style={{ marginTop: '3rem', fontSize: '0.8rem', opacity: 0.7 }}>
                <p>Prepare for the challenge.</p>
            </footer>
        </div>
    );
};

export default Welcome;

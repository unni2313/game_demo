import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import '../index.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await loginUser(formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/game');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container" style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem', textAlign: 'left' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login</h2>
            {error && <p style={{ color: '#ff6b6b', textAlign: 'center', background: 'rgba(255, 107, 107, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#2a2a2a', color: 'white', fontSize: '1rem' }}
                    />
                </div>
                <div>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#2a2a2a', color: 'white', fontSize: '1rem' }}
                    />
                </div>
                <button type="submit" style={{ marginTop: '1rem', width: '100%', padding: '0.8rem' }}>Login</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                Don't have an account? <span onClick={() => navigate('/register')} style={{ color: '#646cff', cursor: 'pointer', textDecoration: 'underline' }}>Register</span>
            </p>
        </div>
    );
};

export default Login;

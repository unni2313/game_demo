import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import '../index.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        age: '',
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
            if (formData.age < 0) {
                setError('Age cannot be negative');
                return;
            }

            await registerUser(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container" style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem', textAlign: 'left' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Register</h2>
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
                        minLength={3}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#2a2a2a', color: 'white', fontSize: '1rem' }}
                    />
                </div>
                <div>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#2a2a2a', color: 'white', fontSize: '1rem' }}
                    />
                </div>
                <div>
                    <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem' }}>Phone</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#2a2a2a', color: 'white', fontSize: '1rem' }}
                    />
                </div>
                <div>
                    <label htmlFor="age" style={{ display: 'block', marginBottom: '0.5rem' }}>Age</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        min={1}
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
                        minLength={6}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', background: '#2a2a2a', color: 'white', fontSize: '1rem' }}
                    />
                </div>
                <button type="submit" style={{ marginTop: '1rem', width: '100%', padding: '0.8rem' }}>Create Account</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#646cff', cursor: 'pointer', textDecoration: 'underline' }}>Login</span>
            </p>
        </div>
    );
};

export default Register;

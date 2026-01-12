import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserProfile } from '../services/api';
import '../index.css';

const Profile = () => {
    const { id } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile(id);
                setProfileData(response.data);
            } catch (err) {
                setError('Failed to load profile');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading profile...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>{error}</div>;

    const { user, rank } = profileData;

    return (
        <div className="profile-container" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
            <h1>User Profile</h1>

            <div style={{ background: '#333', padding: '2rem', borderRadius: '12px', marginTop: '1.5rem', textAlign: 'left' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Username: <strong>{user.username}</strong></p>
                <p style={{ marginBottom: '1rem' }}>Age: <strong>{user.age}</strong></p>

                <div style={{ height: '1px', background: '#555', margin: '1.5rem 0' }}></div>

                <p style={{ fontSize: '1.5rem', color: '#646cff', marginBottom: '0.5rem' }}>Global Rank: <strong>#{rank}</strong></p>
                <p>Best Score: <strong>{user.best_score}</strong></p>
                <p>Last Score: <strong>{user.last_score}</strong></p>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => navigate('/game')}>Play Game</button>
                <button onClick={() => navigate('/leaderboard')} style={{ background: '#444' }}>Scoreboard</button>
            </div>
        </div>
    );
};

export default Profile;

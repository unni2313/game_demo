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

    const { user, rank, stats } = profileData;

    return (
        <div className="profile-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <h1>User Profile</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                {/* Account Details */}
                <div style={{ background: '#333', padding: '1.5rem', borderRadius: '12px', textAlign: 'left' }}>
                    <h3 style={{ color: '#646cff', marginTop: 0 }}>Account Details</h3>
                    <p style={{ margin: '0.5rem 0' }}>Username: <strong>{user.username}</strong></p>
                    <p style={{ margin: '0.5rem 0' }}>Rank: <strong>#{rank}</strong></p>
                    <p style={{ margin: '0.5rem 0' }}>Total Score: <strong>{user.total_score}</strong></p>
                    <p style={{ margin: '0.5rem 0' }}>Age: <strong>{user.age}</strong></p>
                    <p style={{ margin: '0.5rem 0' }}>Email: <strong>{user.email}</strong></p>
                </div>

                {/* Match Statistics */}
                <div style={{ background: '#333', padding: '1.5rem', borderRadius: '12px', textAlign: 'left' }}>
                    <h3 style={{ color: '#27ae60', marginTop: 0 }}>Match Stats</h3>
                    <p style={{ margin: '0.5rem 0' }}>Matches Played: <strong>{stats.played}</strong></p>
                    <p style={{ margin: '0.5rem 0' }}>Matches Won: <strong>{stats.wins}</strong></p>
                    <p style={{ margin: '0.5rem 0' }}>Win Rate: <strong>{stats.winRate}</strong></p>
                    <p style={{ margin: '0.5rem 0' }}>Total Sixes: <strong>{stats.sixes}</strong></p>
                    <p style={{ margin: '0.5rem 0' }}>Total Fours: <strong>{stats.fours}</strong></p>
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => navigate('/game')}>Play Game</button>
            </div>
        </div>
    );
};

export default Profile;

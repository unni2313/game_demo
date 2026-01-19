const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

exports.addScore = async (req, res) => {
    try {
        const { user_id, score } = req.body;
        const db = getDb();

        if (!user_id || score === undefined) {
            return res.status(400).json({ message: 'User ID and score are required' });
        }

        // Create new game result
        const newResult = {
            user_id: new ObjectId(user_id),
            score,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('game_results').insertOne(newResult);

        // Update user scores
        const user = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(user_id) },
            {
                $inc: { best_score: score },
                $set: { updatedAt: new Date() }
            },
            { returnDocument: 'after' }
        );

        res.status(201).json({
            message: 'Score added successfully',
            result: { ...newResult, _id: result.insertedId },
            userUpdates: {
                best_score: user.best_score
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const db = getDb();
        const topScores = await db.collection('users')
            .find({})
            .project({ username: 1, best_score: 1 })
            .sort({ best_score: -1, updatedAt: 1 })
            .toArray();

        res.json(topScores);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

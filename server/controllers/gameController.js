const GameResult = require('../models/GameResult');
const User = require('../models/User');

exports.addScore = async (req, res) => {
    try {
        const { user_id, score } = req.body;

        if (!user_id || score === undefined) {
            return res.status(400).json({ message: 'User ID and score are required' });
        }

        // Create new game result
        const newResult = new GameResult({
            user_id,
            score
        });

        await newResult.save();

        // Update user scores
        const user = await User.findById(user_id);
        if (user) {
            if (score > user.best_score) {
                user.best_score = score;
            }
            await user.save();
        }

        res.status(201).json({
            message: 'Score added successfully',
            result: newResult,
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
        const topScores = await User.find()
            .sort({ best_score: -1 })
            .select('username best_score');

        res.json(topScores);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

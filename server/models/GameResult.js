const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
    game_id: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString() // generating a unique ID if not provided
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const GameResult = mongoose.model('GameResult', gameResultSchema);

module.exports = GameResult;

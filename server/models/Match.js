const { ObjectId } = require('mongodb');

const createMatch = (data) => {
    const { playerId, innings, difficultyLevel, totalRunsNeeded, targetOvers } = data;

    return {
        playerId: playerId ? new ObjectId(playerId) : null,
        innings: parseInt(innings) || 1,
        difficultyLevel: difficultyLevel || 'medium',
        totalRunsNeeded: parseInt(totalRunsNeeded) || 0,
        targetOvers: parseInt(targetOvers) || 0,
        currentScore: 0,
        currentWickets: 0,
        fours: 0,
        sixes: 0,
        status: 'in-progress',
        createdAt: new Date(),
        updatedAt: new Date()
    };
};

module.exports = { createMatch };

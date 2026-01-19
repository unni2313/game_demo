const { ObjectId } = require('mongodb');

const createBall = (data) => {
    const { matchId, innings, overId, overNumber, ballNumber, runs, wicket, angle } = data;

    return {
        matchId: matchId ? new ObjectId(matchId) : null,
        innings: parseInt(innings) || 1,
        overId: overId ? new ObjectId(overId) : null,
        overNumber: parseInt(overNumber) || 1,
        ballNumber: parseInt(ballNumber) || 1,
        runs: parseInt(runs) || 0,
        wicket: !!wicket,
        angle: angle !== undefined ? angle : null,
        createdAt: new Date()
    };
};

module.exports = { createBall };

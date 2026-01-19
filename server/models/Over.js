const { ObjectId } = require('mongodb');

const createOver = (data) => {
    const { matchId, overNumber } = data;

    return {
        matchId: matchId ? new ObjectId(matchId) : null,
        overNumber: parseInt(overNumber) || 1,
        createdAt: new Date()
    };
};

module.exports = { createOver };

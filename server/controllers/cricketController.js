const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');
const { createMatch } = require('../models/Match');
const { createOver } = require('../models/Over');
const { createBall } = require('../models/Ball');

// 1. Start a New Game
exports.startMatch = async (req, res) => {
    try {
        const { playerId, difficulty, totalRunsNeeded, totalOvers, innings } = req.body;
        const db = getDb();

        const newMatch = createMatch({
            playerId: playerId || req.user.id,
            innings,
            difficultyLevel: difficulty,
            totalRunsNeeded,
            targetOvers: totalOvers
        });

        const result = await db.collection('matches').insertOne(newMatch);

        res.status(201).json({
            message: 'Match started successfully',
            matchId: result.insertedId,
            data: newMatch
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 2. Add a Ball (The "Split" Logic)
exports.addBall = async (req, res) => {
    try {
        const { matchId, runs, wicket, angle } = req.body;
        const db = getDb();
        const runValue = parseInt(runs) || 0;

        const match = await db.collection('matches').findOne({ _id: new ObjectId(matchId) });
        if (!match) return res.status(404).json({ message: 'Match not found' });
        if (match.status !== 'in-progress') return res.status(400).json({ message: 'Match is already over' });

        // Find the current over
        let currentOver = await db.collection('overs')
            .find({ matchId: new ObjectId(matchId) })
            .sort({ overNumber: -1 })
            .limit(1)
            .toArray();

        let overDoc = currentOver[0];
        let overNumber = overDoc ? overDoc.overNumber : 1;
        let ballNumberInOver = 1;

        // Determine if we need a new over
        if (overDoc) {
            const ballCount = await db.collection('balls').countDocuments({ overId: overDoc._id });
            if (ballCount >= 6) {
                // Current over finished, create new one
                overNumber++;
                const newOverData = createOver({ matchId, overNumber });
                const newOverResult = await db.collection('overs').insertOne(newOverData);
                overDoc = { _id: newOverResult.insertedId, overNumber };
            } else {
                ballNumberInOver = ballCount + 1;
            }
        } else {
            // No overs yet, create first one
            const newOverData = createOver({ matchId, overNumber: 1 });
            const newOverResult = await db.collection('overs').insertOne(newOverData);
            overDoc = { _id: newOverResult.insertedId, overNumber: 1 };
        }

        // Insert the ball
        const newBall = createBall({
            matchId,
            innings: match.innings,
            overId: overDoc._id,
            overNumber: overDoc.overNumber,
            ballNumber: ballNumberInOver,
            runs: runValue,
            wicket,
            angle
        });

        await db.collection('balls').insertOne(newBall);

        // Update Match Stats (including 4s and 6s)
        const matchUpdate = {
            $inc: {
                currentScore: runValue,
                currentWickets: newBall.wicket ? 1 : 0,
                fours: runValue === 4 ? 1 : 0,
                sixes: runValue === 6 ? 1 : 0
            },
            $set: { updatedAt: new Date() }
        };

        let updatedMatch = await db.collection('matches').findOneAndUpdate(
            { _id: new ObjectId(matchId) },
            matchUpdate,
            { returnDocument: 'after' }
        );

        // Check for Match End
        let isOver = false;
        if (updatedMatch.currentScore >= updatedMatch.totalRunsNeeded) {
            updatedMatch.status = 'won';
            isOver = true;
        } else if (updatedMatch.currentWickets >= updatedMatch.innings || updatedMatch.currentWickets >= 10 || (overNumber >= updatedMatch.targetOvers && ballNumberInOver >= 6)) {
            updatedMatch.status = 'lost';
            isOver = true;
        }

        if (isOver) {
            // Formula Logic
            // +total runs*10
            // +no of 6s*6
            // +no of 4s*4
            // -no of wickets*30
            // -if fail (score needed - score achived)*5

            let matchScore = (updatedMatch.currentScore * 10) +
                (updatedMatch.sixes * 6) +
                (updatedMatch.fours * 4) -
                (updatedMatch.currentWickets * 30);

            if (updatedMatch.status === 'lost') {
                const deficit = updatedMatch.totalRunsNeeded - updatedMatch.currentScore;
                matchScore -= (deficit * 5);
            }

            await db.collection('matches').updateOne(
                { _id: new ObjectId(matchId) },
                { $set: { status: updatedMatch.status, finalCalculatedScore: matchScore } }
            );

            // Update user's aggregate total_score (acting as total rank score)
            // Use $inc because user said "negative and positive score will affect the leader board"
            await db.collection('users').updateOne(
                { _id: new ObjectId(updatedMatch.playerId) },
                {
                    $inc: { total_score: matchScore },
                    $set: { updatedAt: new Date() }
                }
            );

            // Fetch final user score for frontend update
            const user = await db.collection('users').findOne({ _id: new ObjectId(updatedMatch.playerId) });
            updatedMatch.userTotalScore = user.total_score;
            updatedMatch.matchPoints = matchScore;
        }

        res.status(201).json({
            message: isOver ? `Match ${updatedMatch.status}!` : 'Ball added',
            ball: newBall,
            matchStatus: updatedMatch
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 3. Get Full Match View (Combines the split data)
exports.getMatchDetails = async (req, res) => {
    try {
        const { matchId } = req.params;
        const db = getDb();

        const match = await db.collection('matches').findOne({ _id: new ObjectId(matchId) });
        if (!match) return res.status(404).json({ message: 'Match not found' });

        // Use aggregation to reconstruct the "Wide View" from the split collections
        const fullMatch = await db.collection('matches').aggregate([
            { $match: { _id: new ObjectId(matchId) } },
            {
                $lookup: {
                    from: 'overs',
                    localField: '_id',
                    foreignField: 'matchId',
                    as: 'overs'
                }
            },
            { $unwind: { path: '$overs', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'balls',
                    localField: 'overs._id',
                    foreignField: 'overId',
                    as: 'overs.balls'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    matchData: { $first: '$$ROOT' },
                    overs: { $push: '$overs' }
                }
            }
        ]).toArray();

        res.json(fullMatch[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const cricketController = require('../controllers/cricketController');
const auth = require('../middleware/auth');

// Legacy routes
router.post('/add-score', auth, gameController.addScore);
router.get('/leaderboard', gameController.getLeaderboard);

// New Cricket Demo Routes
router.post('/start-match', auth, cricketController.startMatch);
router.post('/add-ball', auth, cricketController.addBall);
router.get('/match/:matchId', auth, cricketController.getMatchDetails);

module.exports = router;

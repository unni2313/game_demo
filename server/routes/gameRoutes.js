const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const auth = require('../middleware/auth');

// Protected route: Only authenticated users can submit scores
router.post('/add-score', auth, gameController.addScore);

// Public route: Anyone can see the leaderboard
router.get('/leaderboard', gameController.getLeaderboard);

module.exports = router;

Authentication Endpoints
Register a new user: POST http://localhost:5000/api/users/register
User Login: POST http://localhost:5000/api/users/login
Game & Scoreboard Endpoints
Add a new score: POST http://localhost:5000/api/game/add-score
Get Leaderboard (Top 10): GET http://localhost:5000/api/game/leaderboard
To get the user profile : GET http://localhost:5000/api/users/userwithrank/:id
leaderboard logic : selecting all the socuments and sorting them in descending order of best_score 

To run the application run the following commands in the root directory
npm run dev
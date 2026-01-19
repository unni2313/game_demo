Cricket Game Demo - API Documentation

USER APIs:
- POST /api/users/register: Creates a new user account and returns a JWT token.
- POST /api/users/login: Authenticates user credentials and returns a JWT token.
- GET /api/users/userwithrank/:id: Fetches user profile details along with their global leaderboard rank.

GAME & CRICKET APIs:
- POST /api/games/start-match: Initializes a new cricket match session for the player.
- POST /api/games/add-ball: Records a ball delivery, updates match status/scores, and adds points to the total_score on completion.
- GET /api/games/match/:matchId: Retrieves the full historical log of balls and overs for a specific match via aggregation.
- GET /api/games/leaderboard: Retrieves a list of all players sorted by their highest total scores.
- POST /api/games/add-score: Manually adds points to a user's total_score (Auth required).

DATABASE STRUCTURE:
- Users: Stores login credentials and cumulative total_score.
- Matches: Stores overall game settings (innings, overs, target) and final results.
- Overs: Serves as a link between matches and balls to group deliveries.
- Balls: Records individual delivery details (runs, wicket, angle).
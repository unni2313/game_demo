const { MongoClient } = require('mongodb');
require('dotenv').config();

async function reset() {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db();

        // Clear all game history collections
        const collections = ['matches', 'overs', 'balls', 'game_results'];
        for (const col of collections) {
            try {
                await db.collection(col).drop();
                console.log(`Dropped collection: ${col}`);
            } catch (e) {
                console.log(`Collection ${col} not found or already dropped`);
            }
        }

        // Reset user scores
        const result = await db.collection('users').updateMany({}, { $set: { total_score: 0 } });
        console.log(`Reset scores for ${result.modifiedCount} users`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

reset();

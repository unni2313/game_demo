const { MongoClient } = require('mongodb');
require('dotenv').config();

async function migrate() {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db();

        // Rename best_score to total_score for all users
        const result = await db.collection('users').updateMany(
            { best_score: { $exists: true } },
            [
                { $set: { total_score: "$best_score" } },
                { $unset: "best_score" }
            ]
        );

        console.log(`Migrated ${result.modifiedCount} users from best_score to total_score`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();

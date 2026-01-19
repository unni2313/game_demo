const { MongoClient } = require('mongodb');

let dbConnection;

const connectToDb = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI);
        dbConnection = client.db();

        // Ensure unique indexes
        const users = dbConnection.collection('users');
        await users.createIndex({ username: 1 }, { unique: true });
        // Use sparse: true to handle cases where multiple existing users might not have an email
        await users.createIndex({ email: 1 }, { unique: true, sparse: true });

        console.log('Successfully connected to MongoDB and ensured indexes');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
};

const getDb = () => dbConnection;

module.exports = { connectToDb, getDb };

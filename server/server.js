const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToDb } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);

app.get('/', (req, res) => {
    res.send('Game Server is running');
});

// Connect to Database using native driver and start server
connectToDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to the database', err);
        process.exit(1);
    });

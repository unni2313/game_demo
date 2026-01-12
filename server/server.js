const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log('MongoDB connection error: ', err));


const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);

app.get('/', (req, res) => {
    res.send('Game Server is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { username, age, password, email, phone } = req.body;
        const db = getDb();
        const users = db.collection('users');

        // Check if user already exists
        const existingUser = await users.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = {
            username,
            age,
            password: hashedPassword,
            email,
            phone,
            best_score: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await users.insertOne(newUser);

        // Create Token
        const token = jwt.sign(
            { id: result.insertedId },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertedId,
                username,
                age,
                email,
                phone
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = getDb();
        const users = db.collection('users');

        // Find user
        const user = await users.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Create Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                age: user.age,
                email: user.email,
                phone: user.phone,
                best_score: user.best_score
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const db = getDb();
        const users = db.collection('users');

        const user = await users.findOne({ username: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove password from response
        delete user.password;

        // Calculate rank: count users with best_score > current user's best_score
        const rank = await users.countDocuments({ best_score: { $gt: user.best_score } }) + 1;

        res.json({
            user,
            rank
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

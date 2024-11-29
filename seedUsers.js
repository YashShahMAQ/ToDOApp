const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const connectDB = require('./config/db');
require('dotenv').config();

const seedUsers = async () => {

    try {

        await connectDB();

        await User.deleteMany();

        const users = [
            {
                username: 'Yash',
                password: await bcrypt.hash('Yash1234', 10)
            },
            {
                username: 'admin',
                password: await bcrypt.hash('admin123', 10)
            },
            {
                username: 'user2',
                password: await bcrypt.hash('user2123', 10)
            },
        ];

        await User.insertMany(users);

        console.log('Users added successfully');
        process.exit();

    } catch (error) {
        console.error('Error adding users');
        process.exit(1);
    }
};

seedUsers();
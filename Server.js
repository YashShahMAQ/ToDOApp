const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./Routes/authRoute');
const listRoutes = require('./routes/listRoutes');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/api', authRoutes);
app.use('/api', listRoutes);
app.use('/api', taskRoutes);

app.get('/', (req, res) => {
    res.send('API is running....');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

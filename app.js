const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('./utils/db');
const coinRoutes = require('./routes/coin');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => res.send('Crypto Tracker API'));
app.use('/api', coinRoutes);

module.exports = app;
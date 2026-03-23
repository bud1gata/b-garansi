const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'wst-db'
})
.then(() => console.log('MongoDB Connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// Route files
const auth = require('./routes/auth');
const items = require('./routes/items');
const services = require('./routes/services');

// Define Routes
app.use('/api/auth', auth);
app.use('/api/items', items);
app.use('/api/services', services);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

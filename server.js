const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const Admin = require('./backend/models/Admin');
const auth = require('./backend/middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    // Initialize preset admin
    const existingAdmin = await Admin.findOne({ username: 'tarek' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('tarek123', 10);
      const admin = new Admin({ username: 'tarek', password: hashedPassword });
      await admin.save();
      console.log('Preset admin created');
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/clients', auth, require('./backend/routes/clients'));
app.use('/api/vehicleTypes', auth, require('./backend/routes/vehicleTypes'));

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// For Vercel deployment
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

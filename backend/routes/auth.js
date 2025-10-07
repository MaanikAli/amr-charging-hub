import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import auth from '../middleware/auth.js';
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update admin credentials
router.put('/update', auth, async (req, res) => {
  const { currentUsername, currentPassword, newUsername, newPassword } = req.body;
  try {
    const admin = await Admin.findOne({ username: currentUsername });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    admin.username = newUsername || admin.username;
    if (newPassword) {
      admin.password = await bcrypt.hash(newPassword, 10);
    }
    await admin.save();

    res.json({ message: 'Credentials updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

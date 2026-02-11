const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { username, name, password } = req.body;

  try {
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      name,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        name: user.name,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Allow login with either username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create Admin User (Protected with Secret Key)
// @route   POST /api/auth/create-admin
// @access  Protected (requires ADMIN_SECRET_KEY)
router.post('/create-admin', async (req, res) => {
  const { name, email, password, secretKey } = req.body;

  try {
    // Verify secret key
    const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'super-secret-admin-key-2024';
    if (secretKey !== ADMIN_SECRET) {
      return res.status(403).json({ message: 'Invalid secret key. Unauthorized.' });
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      username: email, // Use email as username for admin
      password,
      role: 'admin'
    });

    if (admin) {
      res.status(201).json({
        message: 'Admin created successfully',
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();

// POST /api/auth/verify — verify token is valid
router.post('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    res.json({
      valid: true,
      uid: decoded.uid,
      email: decoded.email,
    });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

// POST /api/auth/logout — just a confirmation (actual logout is client-side)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
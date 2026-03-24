const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();
const db = admin.firestore();

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// POST /api/inquiries — public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }

    const inquiryData = {
      name,
      email,
      phone: phone || '',
      message,
      status: 'new',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('inquiries').add(inquiryData);

    res.status(201).json({
      id: docRef.id,
      message: 'Inquiry submitted successfully',
      ...inquiryData,
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// GET /api/inquiries — admin only
router.get('/', verifyToken, async (req, res) => {
  try {
    const snapshot = await db
      .collection('inquiries')
      .orderBy('createdAt', 'desc')
      .get();

    const inquiries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
    }));

    res.json(inquiries);
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// PUT /api/inquiries/:id — admin only
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    delete updates.createdAt;
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await db.collection('inquiries').doc(id).update(updates);

    res.json({ id, message: 'Inquiry updated successfully' });
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

// DELETE /api/inquiries/:id — admin only
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('inquiries').doc(id).delete();
    res.json({ id, message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

module.exports = router;
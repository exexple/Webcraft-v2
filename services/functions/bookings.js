const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();
const db = admin.firestore();

// Verify Firebase Auth token
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

// POST /api/bookings — public (clients submit bookings)
router.post('/', async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      budget,
      projectDescription,
      preferredDate,
    } = req.body;

    if (!clientName || !clientEmail || !clientPhone || !serviceType || !projectDescription) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const bookingData = {
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      budget: budget || 'not-specified',
      projectDescription,
      preferredDate: preferredDate || '',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('bookings').add(bookingData);

    res.status(201).json({
      id: docRef.id,
      message: 'Booking submitted successfully',
      ...bookingData,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// GET /api/bookings — admin only
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    let query = db.collection('bookings').orderBy('createdAt', 'desc');

    if (status && status !== 'all') {
      query = db.collection('bookings').where('status', '==', status);
    }

    const snapshot = await query.get();
    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
    }));

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// PUT /api/bookings/:id — admin only
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates.createdAt;
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await db.collection('bookings').doc(id).update(updates);

    res.json({ id, message: 'Booking updated successfully', ...updates });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// DELETE /api/bookings/:id — admin only
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('bookings').doc(id).delete();
    res.json({ id, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

module.exports = router;
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

// GET /api/reviews — public (only approved)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db
      .collection('reviews')
      .where('approved', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    const reviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
    }));

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET /api/reviews/all — admin only (all reviews including unapproved)
router.get('/all', verifyToken, async (req, res) => {
  try {
    const snapshot = await db
      .collection('reviews')
      .orderBy('createdAt', 'desc')
      .get();

    const reviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
    }));

    res.json(reviews);
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews — public (clients submit reviews)
router.post('/', async (req, res) => {
  try {
    const { clientName, clientCompany, content, rating } = req.body;

    if (!clientName || !content) {
      return res.status(400).json({ error: 'Name and content are required' });
    }

    const reviewData = {
      clientName,
      clientCompany: clientCompany || '',
      content,
      rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
      approved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('reviews').add(reviewData);

    res.status(201).json({
      id: docRef.id,
      message: 'Review submitted. Pending approval.',
      ...reviewData,
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// PUT /api/reviews/:id — admin only (approve/update)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    delete updates.createdAt;
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await db.collection('reviews').doc(id).update(updates);

    res.json({ id, message: 'Review updated successfully' });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE /api/reviews/:id — admin only
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('reviews').doc(id).delete();
    res.json({ id, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
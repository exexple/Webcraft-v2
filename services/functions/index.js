// services/functions/index.js
// Main Firebase Cloud Functions entry point
// Aggregates all microservices

const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin
admin.initializeApp();

// Import all microservice routers
const projectsRouter = require('./projects');
const bookingsRouter = require('./bookings');
const reviewsRouter = require('./reviews');
const inquiriesRouter = require('./inquiries');
const contentRouter = require('./content');
const authRouter = require('./auth');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/content', contentRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'UNKNOWN_ERROR',
  });
});

// Export as Cloud Function
exports.api = functions.https.onRequest(app);

// Scheduled Functions (Optional)
// Run every 6 hours to clean up expired data
exports.cleanupExpiredData = functions.pubsub
  .schedule('every 6 hours')
  .onRun(async (context) => {
    try {
      const db = admin.firestore();
      const expiredDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days

      // Clean expired bookings
      const expiredBookings = await db
        .collection('bookings')
        .where('date', '<', expiredDate)
        .limit(100)
        .get();

      const batch = db.batch();
      expiredBookings.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      console.log(`Cleaned up ${expiredBookings.size} expired bookings`);
      return { success: true, cleanedCount: expiredBookings.size };
    } catch (error) {
      console.error('Cleanup error:', error);
      throw error;
    }
  });

// Welcome message
console.log('✅ Webcraft Studio API Initialized');
console.log('🚀 Available endpoints:');
console.log('   - /api/auth');
console.log('   - /api/projects');
console.log('   - /api/bookings');
console.log('   - /api/reviews');
console.log('   - /api/inquiries');
console.log('   - /api/content');

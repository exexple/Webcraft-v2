// services/functions/shared/middleware.js
// Authentication & authorization middleware for all services

const admin = require('firebase-admin');
const { UnauthorizedError, ForbiddenError } = require('./errorHandler');

/**
 * Verify Firebase ID Token
 * Middleware to extract and verify token from Authorization header
 */
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Invalid or expired token',
      details: error.message,
    });
  }
};

/**
 * Verify Admin Role
 * Middleware to check if user has admin role
 */
const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.uid) {
      throw new UnauthorizedError('No user context');
    }

    const userDoc = await admin.firestore().collection('admins').doc(req.uid).get();

    if (!userDoc.exists) {
      throw new ForbiddenError('User is not an admin');
    }

    if (!userDoc.data().isActive) {
      throw new ForbiddenError('Admin account is inactive');
    }

    req.admin = userDoc.data();
    next();
  } catch (error) {
    res.status(403).json({
      error: 'Admin access required',
      details: error.message,
    });
  }
};

/**
 * Rate limiting middleware
 * Simple in-memory rate limiter (use Redis for production)
 */
const requests = new Map();

const rateLimit = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    if (!requests.has(key)) {
      requests.set(key, []);
    }

    const timestamps = requests.get(key).filter((t) => now - t < windowMs);

    if (timestamps.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests, please try again later',
      });
    }

    timestamps.push(now);
    requests.set(key, timestamps);
    next();
  };
};

/**
 * Error wrapper - wrap async functions to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * CORS handler
 */
const corsHandler = (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
  rateLimit,
  asyncHandler,
  corsHandler,
};

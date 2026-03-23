// services/functions/projects/index.js
// Projects Microservice - All project-related endpoints

const express = require('express');
const admin = require('firebase-admin');
const {
  verifyToken,
  verifyAdmin,
  asyncHandler,
  corsHandler,
} = require('../shared/middleware');
const {
  ValidationError,
  NotFoundError,
  errorHandler,
} = require('../shared/errorHandler');
const { db } = require('../shared/firestore');

const router = express.Router();
const projectsCollection = db.collection('projects');

// Enable CORS
router.use(corsHandler);

/**
 * GET /api/projects
 * Fetch all projects with optional filtering/sorting
 * Public endpoint
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status, category, sortBy, limit = 12, offset = 0 } = req.query;

    let query = projectsCollection.where('isPublished', '==', true);

    // Apply filters
    if (status) {
      query = query.where('status', '==', status);
    }
    if (category) {
      query = query.where('category', '==', category);
    }

    // Apply sorting
    const sort = sortBy === 'newest' ? 'createdAt' : 'featured';
    query = query.orderBy(sort, 'desc');

    // Pagination
    const snapshot = await query
      .limit(parseInt(limit) + 1)
      .offset(parseInt(offset))
      .get();

    const projects = [];
    snapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({
      success: true,
      data: projects,
      hasMore: projects.length > limit,
    });
  })
);

/**
 * GET /api/projects/:id
 * Fetch single project by ID
 * Public endpoint
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const projectDoc = await projectsCollection.doc(id).get();

    if (!projectDoc.exists || !projectDoc.data().isPublished) {
      throw new NotFoundError('Project not found');
    }

    res.json({
      success: true,
      data: {
        id: projectDoc.id,
        ...projectDoc.data(),
      },
    });
  })
);

/**
 * POST /api/projects
 * Create new project (Admin only)
 */
router.post(
  '/',
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const {
      title,
      description,
      category,
      images,
      liveUrl,
      gitUrl,
      features,
      technologies,
      featured,
      status,
    } = req.body;

    // Validation
    if (!title || !description || !category) {
      throw new ValidationError('Missing required fields: title, description, category');
    }

    const projectRef = await projectsCollection.add({
      title,
      description,
      category,
      images: images || [],
      liveUrl: liveUrl || '',
      gitUrl: gitUrl || '',
      features: features || [],
      technologies: technologies || [],
      featured: featured || false,
      status: status || 'active',
      isPublished: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.uid,
    });

    res.status(201).json({
      success: true,
      data: {
        id: projectRef.id,
        message: 'Project created successfully',
      },
    });
  })
);

/**
 * PUT /api/projects/:id
 * Update project (Admin only)
 */
router.put(
  '/:id',
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Verify project exists
    const projectDoc = await projectsCollection.doc(id).get();
    if (!projectDoc.exists) {
      throw new NotFoundError('Project not found');
    }

    // Update
    await projectsCollection.doc(id).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      data: { id, message: 'Project updated successfully' },
    });
  })
);

/**
 * DELETE /api/projects/:id
 * Delete project (Admin only)
 */
router.delete(
  '/:id',
  verifyToken,
  verifyAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Verify project exists
    const projectDoc = await projectsCollection.doc(id).get();
    if (!projectDoc.exists) {
      throw new NotFoundError('Project not found');
    }

    // Soft delete
    await projectsCollection.doc(id).update({
      isPublished: false,
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      data: { id, message: 'Project deleted successfully' },
    });
  })
);

// Global error handler
router.use(errorHandler);

module.exports = router;

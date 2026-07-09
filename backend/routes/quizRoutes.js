import express from 'express';
import {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizResults,
  deleteQuiz
} from '../controllers/quizController.js';

import protect from '../middleware/auth.js';

const router = express.Router();

// All routes protected
router.use(protect);

// Get single quiz by ID
router.get('/quiz/:id', getQuizById);

// Get all quizzes for a document
router.get('/:documentId', getQuizzes);

// Submit quiz
router.post('/:id/submit', protect, submitQuiz);

// Get quiz results
router.get('/:id/results', getQuizResults);

// Delete quiz
router.delete('/:id', deleteQuiz);

export default router;
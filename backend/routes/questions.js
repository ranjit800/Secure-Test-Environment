const express = require('express');
const router = express.Router();
const questions = require('../data/questions.json');

// @route   GET /api/questions
// @desc    Get all questions (without correct answers)
// @access  Public
router.get('/', (req, res) => {
  try {
    // Remove correct answers from response
    const questionsWithoutAnswers = questions.map(({ correctAnswer, ...rest }) => rest);
    
    res.status(200).json({
      success: true,
      count: questionsWithoutAnswers.length,
      questions: questionsWithoutAnswers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   POST /api/questions/grade
// @desc    Grade student answers (admin/internal use)
// @access  Public (should be protected)
router.post('/grade', (req, res) => {
  try {
    const { answers } = req.body; // { 1: "A", 2: "C", ... }
    
    let correctCount = 0;
    const results = {};
    
    questions.forEach(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      
      results[q.id] = {
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect
      };
    });
    
    const score = Math.round((correctCount / questions.length) * 100);
    
    res.status(200).json({
      success: true,
      score,
      correctCount,
      totalQuestions: questions.length,
      results
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;

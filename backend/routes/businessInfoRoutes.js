const express = require('express');
const router = express.Router();
const businessInfoController = require('../controllers/businessInfoController');

// Routes
router.post('/submit', businessInfoController.submitBusinessInfo);


module.exports = router;

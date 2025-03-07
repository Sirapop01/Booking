const express = require('express');
const router = express.Router();
const businessInfoController = require('../controllers/businessInfoController');

// ✅ เปลี่ยนให้ `/submit` ส่งคำร้องขอไปที่ `businessInfoRequests`
router.post('/submit', businessInfoController.submitBusinessInfo);

module.exports = router;

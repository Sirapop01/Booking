const express = require('express');
const router = express.Router();
const businessInfoRequestController = require('../controllers/businessInfoRequestController');

router.post('/submit', businessInfoRequestController.submitBusinessRequest);

// ✅ ดึงคำร้องทั้งหมด (Admin ใช้ดูคำร้อง)
router.get('/', businessInfoRequestController.getAllRequests);

// ✅ อนุมัติคำร้อง (ย้ายไป `businessinfos`)
router.put('/approve/:id', businessInfoRequestController.approveRequest);

// ✅ ปฏิเสธคำร้อง (ลบจาก `businessInfoRequests`)
router.delete('/reject/:id', businessInfoRequestController.rejectRequest);

module.exports = router;

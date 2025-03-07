const express = require('express');
const router = express.Router();
const businessInfoRequestController = require('../controllers/businessInfoRequestController');

router.post('/submit', businessInfoRequestController.submitBusinessRequest);

// ✅ ดึงคำร้องทั้งหมด (Admin ใช้ดูคำร้อง)
router.get("/pending", businessInfoRequestController.getPendingRequests);

// ✅ อนุมัติคำร้อง (ย้ายไป `businessinfos`)
router.put("/approve/:id", businessInfoRequestController.approveRequest);

// ✅ Route ปฏิเสธคำร้อง พร้อมเหตุผล
router.delete("/reject/:id", businessInfoRequestController.rejectRequest);

module.exports = router;

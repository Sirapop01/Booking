const express = require('express');
const router = express.Router();
const { createAdmin, getAllAdmins, deleteAdmin } = require('../controllers/adminController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

// สร้าง Admin (เฉพาะ Super Admin เท่านั้น)
router.post('/', authMiddleware, roleMiddleware(['superadmin']), createAdmin);

// ดู Admin ทั้งหมด (เฉพาะ Super Admin)
router.get('/', authMiddleware, roleMiddleware(['superadmin', 'admin']), getAllAdmins);

// ลบ Admin (Super Admin ได้ทั้งหมด, Admin ลบ Admin ด้วยกันเองไม่ได้)
router.delete('/:id', authMiddleware, deleteAdmin);

module.exports = router;

const express = require('express');
const { registerSuperAdmin, loginSuperAdmin, getSuperAdminProfile } = require('../controllers/superAdminController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerSuperAdmin);
router.post('/login', loginSuperAdmin);
router.get('/profile', authMiddleware, getSuperAdminProfile);

module.exports = router;

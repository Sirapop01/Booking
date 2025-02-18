const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController'); // ✅ นำเข้ามาให้ถูกต้อง

const upload = multer({ storage: multer.memoryStorage() }); // ✅ ใช้ memoryStorage

router.post('/single', upload.single('image'), uploadImage); // ✅ ใส่ callback function

module.exports = router;

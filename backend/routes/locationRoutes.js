const express = require("express");
const {
  getProvinces,
  getDistricts,
  getSubdistricts,
} = require("../controllers/locationController");

const router = express.Router();

// ✅ เส้นทาง API ดึงข้อมูลจังหวัด
router.get("/provinces", getProvinces);

// ✅ เส้นทาง API ดึงข้อมูลอำเภอจากจังหวัดที่เลือก
router.get("/districts/:provinceId", getDistricts);

// ✅ เส้นทาง API ดึงข้อมูลตำบลจากอำเภอที่เลือก
router.get("/subdistricts/:provinceId/:districtId", getSubdistricts);

module.exports = router;

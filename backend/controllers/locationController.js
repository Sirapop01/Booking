const fs = require("fs");
const path = require("path");

// ✅ โหลดข้อมูลจาก JSON
const locationData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/locations.json"), "utf-8")
);

// ✅ ดึงรายชื่อจังหวัดทั้งหมด
exports.getProvinces = (req, res) => {
  const provinces = locationData.map((province) => ({
    id: province.id,
    name_th: province.name_th,
    name_en: province.name_en,
  }));
  res.json(provinces);
};

// ✅ ดึงอำเภอจากจังหวัดที่เลือก
exports.getDistricts = (req, res) => {
  const { provinceId } = req.params;
  const province = locationData.find((p) => p.name_th  === provinceId);

  if (!province) return res.status(404).json({ message: "ไม่พบจังหวัด" });

  const districts = province.amphure.map((district) => ({
    id: district.id,
    name_th: district.name_th,
    name_en: district.name_en,
  }));

  res.json(districts);
};

// ✅ ดึงตำบลจากอำเภอที่เลือก
exports.getSubdistricts = (req, res) => {
  const { provinceId, districtId } = req.params;
  const province = locationData.find((p) => p.name_th  === provinceId);

  if (!province) return res.status(404).json({ message: "ไม่พบจังหวัด" });

  const district = province.amphure.find((d) => d.name_th === districtId);
  if (!district) return res.status(404).json({ message: "ไม่พบอำเภอ" });

  const subdistricts = district.tambon.map((sub) => ({
    id: sub.id,
    name_th: sub.name_th,
    name_en: sub.name_en,
  }));

  res.json(subdistricts);
};

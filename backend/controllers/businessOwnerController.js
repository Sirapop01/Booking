const BusinessOwner = require("../models/BusinessOwner");

// Get all business owners
exports.getAllBusinessOwners = async (req, res) => {
  try {
    const owners = await BusinessOwner.find();
    res.status(200).json(owners);
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลเจ้าของสนามได้", error });
  }
};

// Get business owner by ID
exports.getBusinessOwnerById = async (req, res) => {
  try {
    const owner = await BusinessOwner.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ message: "ไม่พบเจ้าของสนาม" });
    }
    res.status(200).json(owner);
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลเจ้าของสนามได้", error });
  }
};

// Approve business owner
exports.approveBusinessOwner = async (req, res) => {
  try {
    const owner = await BusinessOwner.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!owner) {
      return res.status(404).json({ message: "ไม่พบเจ้าของสนาม" });
    }
    res.status(200).json({ message: "อนุมัติเจ้าของสนามสำเร็จ", owner });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถอนุมัติเจ้าของสนามได้", error });
  }
};

// Reject business owner
exports.rejectBusinessOwner = async (req, res) => {
  try {
    const owner = await BusinessOwner.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!owner) {
      return res.status(404).json({ message: "ไม่พบเจ้าของสนาม" });
    }
    res.status(200).json({ message: "ปฏิเสธเจ้าของสนามสำเร็จ", owner });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถปฏิเสธเจ้าของสนามได้", error });
  }
};

// Delete business owner
exports.deleteBusinessOwner = async (req, res) => {
  try {
    const owner = await BusinessOwner.findByIdAndDelete(req.params.id);
    if (!owner) {
      return res.status(404).json({ message: "ไม่พบเจ้าของสนาม" });
    }
    res.status(200).json({ message: "ลบเจ้าของสนามสำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถลบเจ้าของสนามได้", error });
  }
};

const Payment = require("../models/Payment");
const User = require("../models/User");

// ✅ ดึงรายชื่อผู้ใช้ที่มีการชำระเงิน
exports.getPaymentUsers = async (req, res) => {
    try {
      const users = await User.find({ _id: { $in: await Payment.distinct("userId") } })
        .select("_id firstName lastName email");
  
      if (!users.length) {
        return res.status(404).json({ error: "❌ ไม่พบผู้ใช้ที่มีการชำระเงิน" });
      }
  
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
    }
  };

// ✅ ดึงรายการชำระเงินของผู้ใช้
exports.getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "❌ ต้องระบุ userId" });
    }

    const transactions = await Payment.find({ userId }).sort({ dateTime: -1 });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ error: "❌ ไม่พบรายการชำระเงิน" });
    }

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงประวัติการชำระเงิน" });
  }
};

// ✅ ยืนยันการชำระเงิน
exports.confirmPayment = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "❌ ต้องระบุ userId" });
    }

    const updated = await Payment.updateMany({ userId, status: "pending" }, { status: "confirmed" });

    if (updated.modifiedCount === 0) {
      return res.status(404).json({ error: "❌ ไม่พบการชำระเงินที่รอการยืนยัน" });
    }

    res.json({ message: "✅ การชำระเงินได้รับการยืนยันแล้ว" });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการยืนยันการชำระเงิน" });
  }
};

// ✅ ปฏิเสธการชำระเงิน
exports.rejectPayment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "❌ ต้องระบุ userId" });
    }
    if (!reason || reason.trim() === "") {
      return res.status(400).json({ error: "❌ ต้องระบุเหตุผลในการปฏิเสธ" });
    }

    const updated = await Payment.updateMany(
      { userId, status: "pending" },
      { status: "rejected", rejectReason: reason }
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({ error: "❌ ไม่พบการชำระเงินที่รอการปฏิเสธ" });
    }

    res.json({ message: "🚫 การชำระเงินถูกปฏิเสธแล้ว" });
  } catch (error) {
    console.error("Error rejecting payment:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการปฏิเสธการชำระเงิน" });
  }
};

// ✅ ดึงข้อมูลการชำระเงินของผู้ใช้
exports.getPaymentUsers = async (req, res) => {
    try {
      const usersWithPayments = await Payment.distinct("userId");
      
      if (!usersWithPayments.length) {
        return res.status(404).json({ error: "❌ ไม่พบผู้ใช้ที่มีการชำระเงิน" });
      }
  
      const users = await User.find({ _id: { $in: usersWithPayments } }).select("_id username email");
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
    }
  };
  

// ✅ ดึงสลิปการโอนเงิน
exports.getPaymentSlip = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "❌ ต้องระบุ userId" });
    }

    const payment = await Payment.findOne({ userId, status: "pending" }).select("slipImageUrl");

    if (!payment || !payment.slipImageUrl) {
      return res.status(404).json({ error: "❌ ไม่พบสลิปการโอนเงิน" });
    }

    res.json({ slipImageUrl: payment.slipImageUrl });
  } catch (error) {
    console.error("Error fetching payment slip:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงสลิปการโอนเงิน" });
  }
};

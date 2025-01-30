const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // ตรวจสอบว่า import ถูกต้อง!
const jwt = require("jsonwebtoken");
const secret = "MatchWeb";

exports.register = async (req, res) => {
  try {
    const {
      email, password, confirmPassword, firstName, lastName,
      gender, phoneNumber, interestedSports, province, district, subdistrict,
    } = req.body;

    const profileImage = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "รหัสผ่านกับยืนยันรหัสผ่านไม่ตรงกัน" });
    }

    // ตรวจสอบว่าอีเมลถูกใช้ไปแล้วหรือไม่
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });
    }

    // แฮชรหัสผ่านก่อนบันทึกลงฐานข้อมูล
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึกข้อมูลลง MongoDB
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      gender,
      phoneNumber,
      interestedSports,
      province,
      district,
      subdistrict,
      profileImage,
      role : "user"
    });

    res.status(201).json({ message: "สมัครสมาชิกสำเร็จ!", user: newUser });

  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
  }
};

exports.login = async (req, res) => {


  try {
    const { email, password, } = req.body;

    // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
    if (password == null || email == null) {
      return res.json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const exitResult = await User.findOne({ email });

    if(exitResult == null){
      return res.json({message: "ไม่พบอีเมลนี้"});
    }

    
    const LoginOK = await bcrypt.compare(password, exitResult.password)
    if(LoginOK){
      const name = exitResult.firstName;
      const id = exitResult._id;
      const role = exitResult.role;
      const token = jwt.sign({email, name, id, role}, secret, { expiresIn : '1h'})

      //password 123456
      console.log("เข้าสู่ระบบสำเร็จ");
      return res.json({message: "เข้าสู่ระบบสำเร็จ",token}
        
      );
    }else{
      console.log("เข้าสู่ระบบไม่สำเร็จ");
      return res.json({message: "เข้าสู่ระบบไม่สำเร็จ"});
    }

    } catch (err) {
      console.error("Error Login user:", err);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ" });
    }
}; 

exports.getMB = async (req, res) => {
  console.log("✅ GET Member Requested:", req.params.id);
  try {
      const userData = await User.findById(req.params.id);  // ✅ ใช้ findById() แทน findOne()
      
      if (!userData) {
          return res.status(404).json({ message: "ไม่พบข้อมูล" });
      }

      return res.status(200).json(userData);
  } catch (error) {
      console.error("❌ Error fetching user data:", error);
      return res.status(500).json({ message: "เกิดปัญหาในระบบ" });
  }
};

exports.logout = async (req, res) => {
  try {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "ไม่สามารถออกจากระบบได้" });
        }
      });
    }
    console.log("✅ Logout API Called");
    res.clearCookie("connect.sid"); // ✅ แก้ชื่อให้ถูกต้อง
    return res.status(200).json({ message: "ออกจากระบบเสร็จสิ้น" });
  } catch (error) {
    console.error("❌ Logout Error:", error);
    return res.status(500).json({ message: "เกิดปัญหาในระบบ" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // รับ ID จาก URL
    const updateData = req.body; // ข้อมูลที่ส่งมาอัปเดต

    // ตรวจสอบว่าผู้ใช้มีอยู่จริงหรือไม่
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้ในระบบ" });
    }

    // อัปเดตข้อมูลผู้ใช้
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(200).json({
      message: "✅ อัปเดตข้อมูลสำเร็จ!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "ไม่มีไฟล์ที่อัปโหลด" });
    }

    const profileImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(id, { profileImage }, { new: true });

    res.status(200).json({ message: "อัปโหลดรูปภาพสำเร็จ!", profileImage });
  } catch (error) {
    console.error("❌ Error updating profile image:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตรูปภาพ" });
  }
};

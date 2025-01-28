const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // ตรวจสอบว่า import ถูกต้อง!
const jwt = require("jsonwebtoken");
const secret = "MatchWeb";

exports.register = async (req, res) => {
  try {
    const {
      email, password, confirmPassword, firstName, lastName,
      gender, phoneNumber, interestedSports, province, district, subdistrict
    } = req.body;

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

      const token = jwt.sign({email}, secret, { expiresIn : '1h'})

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

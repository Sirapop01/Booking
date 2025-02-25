import React from "react";
import "./Opera.css";
import { useNavigate } from "react-router-dom";
import NavbarRegis from "../NavbarRegis/NavbarRegis";

const OperaRequri = () => {
  const navigate = useNavigate(); // ใช้ useNavigate เพื่อจัดการการนำทาง

  const handleConfirm = () => {
    navigate("/RegisterOpera"); // เปลี่ยน URL ไปยัง RegisterOpera
  };

  return (
    <>
      
      <div className="container8383">
        <main className="main-content">
          <h2>ข้อกำหนดและเงื่อนไข</h2>
          <ol>
            <li>
              การให้ข้อมูลส่วนตัวผู้ประกอบการที่ต้องการเข้าสู่เว็บไซต์จะต้องให้ข้อมูลส่วนตัวที่ถูกต้องและครบถ้วนตามที่ระบุ ได้แก่
              ชื่อและนามสกุล, เลขบัตรประชาชน, วัน/เดือน/ปีเกิด, เบอร์โทรศัพท์, อีเมล, รหัสผ่าน
              ข้อมูลเหล่านี้จะถูกใช้เพื่อวัตถุประสงค์ในการยืนยันตัวตนและการให้บริการเท่านั้น
            </li>
            <li>
              การรักษาความปลอดภัยของข้อมูลส่วนตัว ข้อมูลส่วนตัวของคุณจะถูกเก็บรักษาไว้อย่างปลอดภัย
              และไม่ถูกเปิดเผยแก่บุคคลภายนอก
              ยกเว้นในกรณีที่มีคำสั่งศาลหรือผู้ประกอบการมีการยินยอมด้วยรหัสผ่าน
            </li>
            <li>
              การเข้าถึงเว็บไซต์นี้เพื่อให้บริการต้องปฏิบัติตามข้อกำหนดและเงื่อนไขทั้งหมด
              หากมีการกระทำที่ฝ่าฝืนเว็บไซต์มีสิทธิ์ปิดการเข้าถึงของผู้ใช้ทันที
            </li>
            <li>
              เงื่อนไขการใช้เว็บไซต์นี้อาจมีการเปลี่ยนแปลงตามที่เห็นสมควรโดยไม่มีการแจ้งล่วงหน้า
            </li>
            <li>
              ความรับผิดชอบของผู้ใช้ผู้ประกอบการรับผิดชอบต่อเนื้อหาทั้งหมดที่เผยแพร่บนเว็บไซต์ของตน หากพบว่าผู้ประกอบการละเมิดกฎเกณฑ์หรือข้อตกลง 
              อาจมีการระงับหรือยกเลิกการให้บริการโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
            </li>
            <li>
              การยินยอมการลงทะเบียนเพื่อเช่าเว็บไซต์ถือเป็นการยินยอมให้เราจัดเก็บและใช้งานข้อมูลส่วนตัวตามข้อกำหนดนี้
              หากมีข้อสงสัยเพิ่มเติมเกี่ยวกับข้อกำหนดและเงื่อนไข โปรดติดต่อฝ่ายผู้พัฒนาเว็บไซต์
            </li>
          </ol>
          <button className="accept-button" onClick={handleConfirm}>
            ยืนยัน
          </button>
        </main>
      </div>
    </>
  );
};

export default OperaRequri;
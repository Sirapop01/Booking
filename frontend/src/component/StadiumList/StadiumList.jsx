import React, { useState } from 'react';
import './StadiumList.css';
import logo from "../assets/logo.png";
import { AiOutlineHome } from 'react-icons/ai';

function StadiumList() {
  // ------------------------------------------------------------------
  // 1) จำลองข้อมูลสนาม (stadiums) ไว้ใน useState เพื่อให้แก้ไขสถานะได้
  // ------------------------------------------------------------------
  const [stadiums, setStadiums] = useState([
    {
      id: 1,
      name: 'Wichai Arena',
      status: 'ยืนยัน',
      open: true, // true = เปิดให้จอง, false = ปิดชั่วคราว
    },
    {
      id: 2,
      name: 'Sophia Arena',
      status: 'ยืนยัน',
      open: true,
    },
    {
      id: 3,
      name: 'Arena Tepzaxx',
      status: 'ยืนยัน',
      open: true,
    },
    {
      id: 4,
      name: 'Sophon Arena',
      status: 'ยืนยัน',
      open: true,
    },
    {
      id: 5,
      name: 'Tety Arena',
      status: 'รอการยืนยัน',
      open: false,
    },
  ]);

  /**
   * toggleStadium
   * ฟังก์ชันสำหรับเปลี่ยนสถานะเปิด/ปิด (open) ของสนามที่มี id ตรงกับ stadiumId
   * @param {number} stadiumId - ไอดีของสนามที่ต้องการเปลี่ยน
   * @param {boolean} openState - สถานะใหม่ (true=เปิด, false=ปิด)
   */
  const toggleStadium = (stadiumId, openState) => {
    // ตัวอย่าง: ถ้าต้องการเชื่อมต่อกับฐานข้อมูลจริง ให้เรียก fetch/axios ที่นี่
    // แล้วค่อย setState (stadiums) ตามข้อมูลที่อัปเดตจากเซิร์ฟเวอร์
    setStadiums((prev) =>
      prev.map((st) =>
        st.id === stadiumId
          ? { ...st, open: openState } // เปลี่ยนเฉพาะ open
          : st
      )
    );
  };

  return (
    <div className="stadium-page-container">

    {/* ปุ่มกลับไปยังหน้า Home */}
    <a href="/" className="home-button">
        <AiOutlineHome className="home-icon" />
      </a>

      <h1 className="page-title">
        <img src={logo} alt="Logo" className="logo" />
        สนามของฉัน
      </h1>

      <table className="stadium-table">
        <thead>
          <tr>
            <th style={{ width: '40%' }}>ชื่อสนาม</th>
            <th style={{ width: '20%' }}>สถานะ</th>
            <th style={{ width: '20%' }}>ตัวเลือก</th>
            <th style={{ width: '20%' }}>เปิด/ปิด</th>
          </tr>
        </thead>
        <tbody>
          {stadiums.map((stadium) => (
            <tr
              key={stadium.id}
              className={`table-row ${
                stadium.open ? 'open-row' : 'closed-row'
              }`}
            >
              <td>{stadium.name}</td>
              <td>{stadium.status}</td>
              <td>
                {stadium.open ? (
                  <button
                    className="toggle-btn btn-close"
                    onClick={() => toggleStadium(stadium.id, false)}
                  >
                    กดเพื่อปิดชั่วคราว
                  </button>
                ) : (
                  <button
                    className="toggle-btn btn-open"
                    onClick={() => toggleStadium(stadium.id, true)}
                  >
                    กดเพื่อเปิด
                  </button>
                )}
              </td>
              <td>{stadium.open ? 'เปิด' : 'ปิด'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bottom-buttons">
        <a href="/edit">แก้ไข</a>
        <a href="/add_new_stadium">เพิ่มสนามใหม่</a>
        <a href="/manage_sub_stadium">จัดการสนามย่อย</a>
      </div>
    </div>
  );
}

export default StadiumList;

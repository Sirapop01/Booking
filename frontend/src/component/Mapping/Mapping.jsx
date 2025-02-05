import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const DEFAULT_LOCATION = [13.736717, 100.523186]; // ✅ พิกัดดีฟอลต์ (กรุงเทพฯ)

// ✅ ปรับไอคอน Marker เพราะ Leaflet ไม่โหลดไอคอนเริ่มต้นใน React
const customMarkerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Mapping = ({ location, setLocation }) => {
  // ✅ ป้องกัน `location` เป็น `undefined`
  const safeLocation = Array.isArray(location) && location.length === 2 ? location : DEFAULT_LOCATION;

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setLocation([e.latlng.lat, e.latlng.lng]); // ✅ อัปเดตค่าพิกัด
      },
    });
    return null;
  };

  return (
    <MapContainer center={safeLocation} zoom={13}  style={{ width: "100%", height: "300px", maxHeight: "300px", overflow: "hidden" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler />
      <Marker position={safeLocation} icon={customMarkerIcon} draggable={true} eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          setLocation([lat, lng]); // ✅ อัปเดตค่าพิกัดเมื่อลาก Marker
        },
      }}>
        <Popup>ตำแหน่งสนามของคุณ</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Mapping;

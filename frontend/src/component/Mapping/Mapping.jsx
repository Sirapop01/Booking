import React, { useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMap, useMapEvents } from "react-leaflet/hooks";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./Mapping.css";

const DEFAULT_LOCATION = [13.736717, 100.523186];

const customMarkerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// ✅ แยก Component: ปุ่มตำแหน่งผู้ใช้
const MapController = ({ setLocation }) => {
  const map = useMap();

  const goToUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("เบราว์เซอร์ของคุณไม่รองรับ Geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const newLocation = [coords.latitude, coords.longitude];
        setLocation(newLocation);
        map.flyTo(newLocation, 15, { duration: 1.5 });
      },
      (error) => {
        console.error("❌ Geolocation error:", error);
        alert("ไม่สามารถดึงตำแหน่งของคุณได้");
      }
    );
  }, [map, setLocation]);

  return (
    <button onClick={goToUserLocation} className="map-button" title="ไปยังตำแหน่งปัจจุบันของคุณ">
      📍ตำแหน่งของฉัน
    </button>
  );
};

// ✅ แยก Component: จัดการการคลิกแผนที่
const MapClickHandler = ({ setLocation }) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      const newLocation = [e.latlng.lat, e.latlng.lng];
      setLocation(newLocation);
      map.flyTo(newLocation, 15, { duration: 1.5 });
    },
  });

  return null;
};

const Mapping = ({ location, setLocation }) => {
  const safeLocation =
    Array.isArray(location) && location.length === 2 ? location : DEFAULT_LOCATION;

  const handleMarkerDragEnd = useCallback(
    (e) => {
      const { lat, lng } = e.target.getLatLng();
      setLocation([lat, lng]);
    },
    [setLocation]
  );

  return (
    <div className="map-container">
      <MapContainer center={safeLocation} zoom={13} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController setLocation={setLocation} />
        <MapClickHandler setLocation={setLocation} />
        <Marker
          position={safeLocation}
          icon={customMarkerIcon}
          draggable
          eventHandlers={{ dragend: handleMarkerDragEnd }}
        >
          <Popup>ตำแหน่งสนามของคุณ</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Mapping;

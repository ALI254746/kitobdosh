"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt, FaCrosshairs, FaCheck, FaTimes } from "react-icons/fa";

const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  // Use a custom icon to avoid default icon loading issues in Next.js
  const customIcon = useMemo(() => L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }), []);

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
};

// Component to handle auto-panning
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const MapPicker = ({ onSelect, onClose, initialPosition, darkMode }) => {
  // Default to Tashkent coordinates if no initial position
  const defaultPos = { lat: 41.2995, lng: 69.2401 };
  const [position, setPosition] = useState(initialPosition || null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Reverse geocoding to get address from lat/lng
  useEffect(() => {
    if (position) {
      const getAddress = async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          }
        } catch (e) {
          console.error("Geocoding error:", e);
        }
      };
      getAddress();
    }
  }, [position]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(newPos);
          setLoading(false);
        },
        () => {
          setLoading(false);
          alert("Joylashuvingizni aniqlab bo'lmadi");
        }
      );
    }
  };

  const handleConfirm = () => {
    if (position) {
      onSelect({
        lat: position.lat,
        lng: position.lng,
        address: address
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className={`w-full max-w-4xl h-[80vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl ${
        darkMode ? "bg-slate-900 border border-slate-700" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`p-6 border-b flex justify-between items-center ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
        }`}>
          <div>
            <h3 className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-800"}`}>
              Joylashuvni tanlang
            </h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Xaritadan aniq manzilni belgilang</p>
          </div>
          <button onClick={onClose} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            darkMode ? "bg-slate-800 text-gray-400 hover:bg-slate-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
          }`}>
            <FaTimes />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer 
            center={position || defaultPos} 
            zoom={13} 
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={darkMode 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
            />
            <LocationMarker position={position} setPosition={setPosition} />
            {position && <ChangeView center={position} />}
          </MapContainer>

          {/* Floating Controls */}
          <button 
            onClick={handleGetCurrentLocation}
            className={`absolute bottom-6 right-6 z-[1000] w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
              darkMode ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-white text-blue-600 hover:bg-blue-50"
            }`}
            title="Mening joylashuvim"
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : <FaCrosshairs className="text-xl" />}
          </button>
        </div>

        {/* Footer Info */}
        <div className={`p-6 border-t ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-gray-50 border-gray-100"
        }`}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                darkMode ? "bg-slate-800 text-blue-400" : "bg-white text-[#96C7B9] shadow-sm"
              }`}>
                <FaMapMarkerAlt />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Tanlangan manzil:</p>
                <p className={`text-sm font-bold line-clamp-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {address || "Xaritadan belgilang..."}
                </p>
              </div>
            </div>
            
            <button 
              disabled={!position}
              onClick={handleConfirm}
              className={`w-full md:w-auto px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-[#1F2937] text-white hover:bg-[#96C7B9]"
              }`}
            >
              <FaCheck /> Tasdiqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;


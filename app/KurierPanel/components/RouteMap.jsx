"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TASHKENT = [41.3111, 69.2797];

function dotIcon(color, ring) {
  return L.divIcon({
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 0 0 5px ${ring}"></span>`,
  });
}

function pinIcon() {
  return L.divIcon({
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 16],
    html: `<span style="display:block;width:14px;height:14px;background:#fb7185;border:2px solid #fff;border-radius:9999px 9999px 9999px 0;transform:rotate(-45deg)"></span>`,
  });
}

function Fit({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) {
      map.setView(TASHKENT, 12);
      return;
    }
    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }
    map.fitBounds(points, { padding: [36, 36], maxZoom: 15 });
  }, [map, points]);
  return null;
}

export default function RouteMap({
  origin = null,
  destination = null,
  markers = [],
  selectedId = null,
  onSelect,
  className = "h-full w-full",
}) {
  const courierIcon = useMemo(() => dotIcon("#3B82F6", "rgba(59,130,246,0.35)"), []);
  const destIcon = useMemo(() => pinIcon(), []);
  const idleIcon = useMemo(() => dotIcon("#64748B", "rgba(100,116,139,0.25)"), []);
  const activeIcon = useMemo(() => dotIcon("#60A5FA", "rgba(96,165,250,0.35)"), []);

  const points = [];
  if (origin) points.push([origin.lat, origin.lng]);
  markers.forEach((m) => {
    if (Number.isFinite(m.lat) && Number.isFinite(m.lng)) points.push([m.lat, m.lng]);
  });
  if (destination && Number.isFinite(destination.lat) && Number.isFinite(destination.lng)) {
    points.push([destination.lat, destination.lng]);
  }

  const line =
    origin && destination && Number.isFinite(destination.lat) && Number.isFinite(destination.lng)
      ? [
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
        ]
      : null;

  return (
    <div className={`courier-dark-map ${className}`} style={{ height: "100%", width: "100%", background: "#0b1220" }}>
      <style>{`
        .courier-dark-map .leaflet-control-attribution { background: rgba(7,14,28,0.75); color: #8EA0B8; font-size: 10px; }
        .courier-dark-map .leaflet-control-attribution a { color: #8EA0B8; }
      `}</style>
    <MapContainer
      center={points[0] || TASHKENT}
      zoom={12}
      zoomControl={false}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ height: "100%", width: "100%", background: "#0b1220" }}
    >
      <TileLayer
        attribution='Tiles &copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
      />
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}" />
      <Fit points={points} />
      {origin && <Marker position={[origin.lat, origin.lng]} icon={courierIcon} />}
      {markers.map((m) =>
        Number.isFinite(m.lat) && Number.isFinite(m.lng) ? (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={m.id === selectedId ? destIcon : m.active ? activeIcon : idleIcon}
            eventHandlers={onSelect ? { click: () => onSelect(m.id) } : undefined}
          />
        ) : null
      )}
      {!markers.length && destination && Number.isFinite(destination.lat) && (
        <Marker position={[destination.lat, destination.lng]} icon={destIcon} />
      )}
      {line && <Polyline positions={line} pathOptions={{ color: "#3B82F6", weight: 4, opacity: 0.95 }} />}
    </MapContainer>
    </div>
  );
}

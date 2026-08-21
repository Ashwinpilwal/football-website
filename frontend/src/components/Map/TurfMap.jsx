import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Crosshair } from "lucide-react";

// Marker Icons
const turfPinIcon = L.divIcon({
  className: "custom-pitch-pin",
  html: `<div style="
    background: #10b981;
    color: #0a0a0a;
    width: 36px;
    height: 36px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 16px;
    border: 2.5px solid white;
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.85);
    cursor: pointer;
  ">⚽</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const municipalPitchIcon = L.divIcon({
  className: "custom-municipal-pin",
  html: `<div style="
    background: #0ea5e9;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    border: 2px solid white;
    box-shadow: 0 0 16px rgba(14, 165, 233, 0.8);
    cursor: pointer;
  ">🏟️</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userPinIcon = L.divIcon({
  className: "custom-user-pin",
  html: `<div style="
    background: #ef4444;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 24px rgba(239, 68, 68, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
  ">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function CenterMapButton({ targetCoords }) {
  const map = useMap();
  return (
    <button
      type="button"
      onClick={() => {
        if (targetCoords && Array.isArray(targetCoords)) {
          map.flyTo(targetCoords, 14, { duration: 1.2 });
        }
      }}
      className="absolute top-4 right-4 z-[1000] p-2.5 rounded-2xl bg-black/90 hover:bg-black text-emerald-400 hover:text-emerald-300 border border-white/15 shadow-2xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
      title="Recenter map to your GPS location"
    >
      <Crosshair className="size-4" />
      <span className="hidden sm:inline">My Location</span>
    </button>
  );
}

export default function TurfMap({
  turfs = [],
  pitches = [],
  userCoords = null,
  selectedTurf = null,
  selectedPitch = null,
  onSelectTurf,
  onSelectPitch,
  height = "100%",
}) {
  const fallbackCoords = [12.9716, 77.5946];
  const activeUserCoords = userCoords && Array.isArray(userCoords) && userCoords.length === 2 ? userCoords : fallbackCoords;

  let center = activeUserCoords;
  if (selectedTurf?.location?.coordinates) {
    center = [selectedTurf.location.coordinates[1], selectedTurf.location.coordinates[0]];
  } else if (selectedPitch?.geometry?.coordinates) {
    center = [selectedPitch.geometry.coordinates[1], selectedPitch.geometry.coordinates[0]];
  } else if (selectedPitch?.properties?.lat && selectedPitch?.properties?.lon) {
    center = [selectedPitch.properties.lat, selectedPitch.properties.lon];
  }

  return (
    <div className="w-full h-full min-h-[420px] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl bg-[#070b10]">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full"
        style={{ height: height, minHeight: "420px", background: "#070b10" }}
      >
        <MapInvalidator />
        <MapRecenter center={center} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Center on My Location Button */}
        <CenterMapButton targetCoords={activeUserCoords} />

        {/* User GPS Live Location Pin */}
        {activeUserCoords && (
          <Marker position={activeUserCoords} icon={userPinIcon}>
            <Popup className="dark-leaflet-popup">
              <div className="p-2 text-neutral-900 min-w-[150px]">
                <div className="font-extrabold text-xs text-red-600 flex items-center gap-1">
                  <span>📍 Your GPS Location</span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-0.5">
                  Scanning real-time venues around you.
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* MongoDB Database Turfs (Used when rendering MongoDB turf views) */}
        {turfs.map((turf) => {
          const lat = turf.location?.coordinates ? turf.location.coordinates[1] : 12.9716;
          const lng = turf.location?.coordinates ? turf.location.coordinates[0] : 77.5946;

          return (
            <Marker
              key={turf._id}
              position={[lat, lng]}
              icon={turfPinIcon}
              eventHandlers={{
                click: () => onSelectTurf && onSelectTurf(turf),
              }}
            >
              <Popup className="dark-leaflet-popup">
                <div className="p-2 text-neutral-900 min-w-[190px]">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-sm text-neutral-900 truncate">{turf.name}</h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {turf.type?.toUpperCase() || "TURF"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 truncate mt-0.5">{turf.address}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200">
                    <span className="font-bold text-emerald-700 text-xs">
                      ₹{turf.pricePerHour || 1200}/hr
                    </span>
                    <Link
                      to={`/turfs/${turf._id}`}
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
                    >
                      Book <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Real Turfs & Football Grounds from Live Places API (Live Radar) */}
        {pitches.map((pitch, idx) => {
          const lat = pitch.geometry?.coordinates ? pitch.geometry.coordinates[1] : pitch.properties?.lat;
          const lng = pitch.geometry?.coordinates ? pitch.geometry.coordinates[0] : pitch.properties?.lon;
          if (!lat || !lng) return null;

          const isTurf = pitch.properties?.venueType === "turf";
          const title = pitch.properties?.name || pitch.properties?.address_line1 || `Football Venue #${idx + 1}`;
          const address = pitch.properties?.formatted || pitch.properties?.address_line2 || "Local Sports Ground";
          const distanceStr = pitch.properties?.distance ? `${(pitch.properties.distance / 1000).toFixed(1)} km away` : "Nearby";

          return (
            <Marker
              key={`venue_${idx}`}
              position={[lat, lng]}
              icon={isTurf ? turfPinIcon : municipalPitchIcon}
              eventHandlers={{
                click: () => onSelectPitch && onSelectPitch(pitch),
              }}
            >
              <Popup className="dark-leaflet-popup">
                <div className="p-2 text-neutral-900 min-w-[200px]">
                  <div className="flex items-center justify-between gap-1.5">
                    <h4 className="font-bold text-sm text-neutral-900 truncate">{title}</h4>
                    <span
                      className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
                        isTurf ? "bg-emerald-100 text-emerald-800" : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {isTurf ? "TURF ARENA" : "PUBLIC GROUND"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 truncate mt-0.5">{address}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-200">
                    <span className="text-[11px] text-neutral-500 font-medium">{distanceStr}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-0.5"
                    >
                      Directions <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

import type { LocationSelection } from '../types';

/**
 * Custom glowing pin SVG for the dark theme.
 */
const glowPin = L.divIcon({
  className: '',
  html: `
    <div style="position:relative; width:36px; height:48px;">
      <div style="
        position:absolute; inset:0;
        background: radial-gradient(circle, rgba(163,230,53,0.65) 0%, rgba(163,230,53,0) 65%);
        filter: blur(6px);
        animation: pulse 2.4s ease-in-out infinite;
      "></div>
      <svg viewBox="0 0 36 48" width="36" height="48" style="position:relative;">
        <defs>
          <linearGradient id="pinG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#a3e635"/>
            <stop offset="100%" stop-color="#22a04a"/>
          </linearGradient>
        </defs>
        <path d="M18 0C8 0 0 8 0 18c0 13 18 30 18 30s18-17 18-30c0-10-8-18-18-18z"
              fill="url(#pinG)"
              stroke="#0a2e19"
              stroke-width="1.5"
              filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))" />
        <circle cx="18" cy="18" r="6" fill="#06180e" />
        <circle cx="18" cy="18" r="3" fill="#a3e635" />
      </svg>
    </div>
    <style>
      @keyframes pulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50%      { opacity: 1;   transform: scale(1.25); }
      }
    </style>
  `,
  iconSize: [36, 48],
  iconAnchor: [18, 48],
  popupAnchor: [0, -42],
});

type Props = {
  selection: LocationSelection | null;
  zoom?: number;
};

function FlyTo({ selection, zoom = 7 }: Props) {
  const map = useMap();
  useEffect(() => {
    if (selection) {
      map.flyTo([selection.lat, selection.lon], zoom, {
        duration: 1.1,
        easeLinearity: 0.25,
      });
    }
  }, [selection, zoom, map]);
  return null;
}

export default function MapView({ selection, zoom = 7 }: Props) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      scrollWheelZoom
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo selection={selection} zoom={zoom} />
      {selection && (
        <Marker position={[selection.lat, selection.lon]} icon={glowPin}>
          <Popup>
            <strong>{selection.name}</strong>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

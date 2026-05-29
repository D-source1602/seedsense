import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

import type { LocationSelection } from '../types';

/* Fix default Leaflet icons (Vite + bundlers) */
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

type Props = {
  selection: LocationSelection | null;
  zoom?: number;
};

/** Animates the map view to the new selection. */
function FlyTo({ selection, zoom = 7 }: Props) {
  const map = useMap();
  useEffect(() => {
    if (selection) {
      map.flyTo([selection.lat, selection.lon], zoom, {
        duration: 1.0,
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
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo selection={selection} zoom={zoom} />
      {selection && (
        <Marker position={[selection.lat, selection.lon]}>
          <Popup>
            <strong>{selection.name}</strong>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

import { useEffect, useRef } from "react";
import L from "leaflet";

type Props = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

export function AdminMap({ lat, lng, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const startLat = isNaN(lat) ? 0 : lat;
    const startLng = isNaN(lng) ? 0 : lng;

    const marker = L.marker([startLat, startLng], { draggable: true }).addTo(map);
    marker.bindPopup("Drag to update shipment position").openPopup();
    markerRef.current = marker;

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onChange(parseFloat(pos.lat.toFixed(6)), parseFloat(pos.lng.toFixed(6)));
    });

    map.setView([startLat, startLng], 4);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker when lat/lng change from outside
  useEffect(() => {
    if (markerRef.current && !isNaN(lat) && !isNaN(lng)) {
      markerRef.current.setLatLng([lat, lng]);
      mapRef.current?.setView([lat, lng]);
    }
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className="h-[280px] w-full rounded-xl border border-border overflow-hidden"
    />
  );
}

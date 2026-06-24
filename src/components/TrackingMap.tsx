import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";

type LatLng = { lat: number; lng: number };

type Props = {
  origin: LatLng & { name: string };
  destination: LatLng & { name: string };
  current: LatLng;
};

export function TrackingMap({ origin, destination, current }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const truckIcon = useMemo(
    () =>
      L.divIcon({
        className: "tracking-marker",
        html: `
          <div style="
            background: oklch(0.78 0.16 75);
            border: 3px solid oklch(0.18 0.05 260);
            width: 28px; height: 28px; border-radius: 50%;
            box-shadow: 0 0 0 6px oklch(0.78 0.16 75 / 0.25), 0 8px 20px -6px rgba(0,0,0,0.4);
            display: flex; align-items: center; justify-content: center;
            color: oklch(0.18 0.05 260); font-weight: 800; font-size: 14px;
          ">●</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    [],
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;

    // English-language tile layer via Cartodb Positron (always English labels)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
    }).addTo(map);

    const pinIcon = (color: string) =>
      L.divIcon({
        className: "endpoint-marker",
        html: `<div style="
          width:14px;height:14px;border-radius:50%;
          background:${color};border:3px solid white;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

    L.marker([origin.lat, origin.lng], { icon: pinIcon("oklch(0.24 0.08 265)") })
      .addTo(map)
      .bindPopup(`<b>Origin</b><br/>${origin.name}`);

    L.marker([destination.lat, destination.lng], { icon: pinIcon("oklch(0.55 0.2 145)") })
      .addTo(map)
      .bindPopup(`<b>Destination</b><br/>${destination.name}`);

    L.polyline(
      [[origin.lat, origin.lng], [destination.lat, destination.lng]],
      { color: "oklch(0.24 0.08 265)", weight: 3, opacity: 0.55, dashArray: "8, 8" },
    ).addTo(map);

    // Use the actual stored current position (already correct lat/lng from DB)
    const marker = L.marker([current.lat, current.lng], { icon: truckIcon }).addTo(map);
    marker.bindPopup("Shipment is here").openPopup();
    markerRef.current = marker;

    const bounds = L.latLngBounds([
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
      [current.lat, current.lng],
    ]);
    map.fitBounds(bounds, { padding: [40, 40] });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([current.lat, current.lng]);
    }
  }, [current.lat, current.lng]);

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full rounded-xl border border-border overflow-hidden"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    />
  );
}

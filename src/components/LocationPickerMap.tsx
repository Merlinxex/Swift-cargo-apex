import { useEffect, useRef } from "react";
import L from "leaflet";

type LatLng = { lat: number; lng: number };

type Props = {
  value: LatLng | null;
  onChange: (v: LatLng) => void;
  origin?: LatLng | null;
  destination?: LatLng | null;
};

/**
 * Click anywhere on the map to set the current location.
 * Marker is draggable for fine adjustments.
 */
export function LocationPickerMap({ value, onChange, origin, destination }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const start: [number, number] = value
      ? [value.lat, value.lng]
      : origin
        ? [origin.lat, origin.lng]
        : [20, 0];

    const map = L.map(containerRef.current, { zoomControl: true }).setView(start, 3);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const pinIcon = (color: string) =>
      L.divIcon({
        className: "endpoint-marker",
        html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

    if (origin) {
      L.marker([origin.lat, origin.lng], { icon: pinIcon("oklch(0.24 0.08 265)") })
        .addTo(map)
        .bindTooltip("Origin");
    }
    if (destination) {
      L.marker([destination.lat, destination.lng], {
        icon: pinIcon("oklch(0.55 0.2 145)"),
      })
        .addTo(map)
        .bindTooltip("Destination");
    }
    if (origin && destination) {
      L.polyline(
        [
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
        ],
        { color: "oklch(0.24 0.08 265)", weight: 2, opacity: 0.5, dashArray: "6, 6" },
      ).addTo(map);
      map.fitBounds(
        L.latLngBounds([
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
        ]),
        { padding: [30, 30] },
      );
    }

    const currentIcon = L.divIcon({
      className: "current-marker",
      html: `<div style="background:oklch(0.78 0.16 75);border:3px solid oklch(0.18 0.05 260);width:24px;height:24px;border-radius:50%;box-shadow:0 0 0 5px oklch(0.78 0.16 75 / 0.25);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    if (value) {
      const m = L.marker([value.lat, value.lng], {
        icon: currentIcon,
        draggable: true,
      }).addTo(map);
      m.on("dragend", () => {
        const p = m.getLatLng();
        onChange({ lat: +p.lat.toFixed(6), lng: +p.lng.toFixed(6) });
      });
      markerRef.current = m;
    }

    map.on("click", (e: L.LeafletMouseEvent) => {
      const lat = +e.latlng.lat.toFixed(6);
      const lng = +e.latlng.lng.toFixed(6);
      if (!markerRef.current) {
        const m = L.marker([lat, lng], { icon: currentIcon, draggable: true }).addTo(map);
        m.on("dragend", () => {
          const p = m.getLatLng();
          onChange({ lat: +p.lat.toFixed(6), lng: +p.lng.toFixed(6) });
        });
        markerRef.current = m;
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }
      onChange({ lat, lng });
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (e.g. typed into the input fields)
  useEffect(() => {
    if (!mapRef.current || !value) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([value.lat, value.lng]);
    }
  }, [value?.lat, value?.lng]);

  return (
    <div
      ref={containerRef}
      className="h-[320px] w-full overflow-hidden rounded-xl border border-border"
    />
  );
}

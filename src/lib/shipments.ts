// Shipment types and helpers. Data lives in Lovable Cloud (Supabase).
import { supabase } from "@/integrations/supabase/client";

export type HistoryEvent = { time?: string; at?: string; label: string };

export type Shipment = {
  id: string;
  trackingNumber: string;
  status: string;
  origin: { name: string; lat: number; lng: number };
  destination: { name: string; lat: number; lng: number };
  currentPosition: { lat: number; lng: number };
  /** Progress along the route 0..1 */
  progress: number;
  /** Estimated remaining wait time in minutes */
  etaMinutes: number;
  carrier: string;
  weight: string | null;
  service: string | null;
  /** ISO date string of when the package was shipped */
  shippedAt: string;
  history: HistoryEvent[];
  packageDescription: string | null;
  breederName: string | null;
  breederAddress: string | null;
  receiverName: string | null;
  receiverPhone: string | null;
  receiverEmail: string | null;
  receiverAddress: string | null;
  totalPrice: number | null;
  amountPaid: number | null;
};

type ShipmentRow = {
  id: string;
  tracking_number: string;
  status: string;
  origin_city: string;
  origin_lat: number;
  origin_lng: number;
  destination_city: string;
  destination_lat: number;
  destination_lng: number;
  current_lat: number | null;
  current_lng: number | null;
  progress: number;
  eta_minutes: number;
  carrier: string;
  weight: string | null;
  service: string | null;
  shipped_date: string;
  history: unknown;
  package_description: string | null;
  breeder_name: string | null;
  breeder_address: string | null;
  receiver_name: string | null;
  receiver_phone: string | null;
  receiver_email: string | null;
  receiver_address: string | null;
  total_price: number | string | null;
  amount_paid: number | string | null;
};

function rowToShipment(r: ShipmentRow): Shipment {
  const progressFraction = (r.progress ?? 0) / 100;
  const toNum = (v: number | string | null) =>
    v === null || v === undefined ? null : typeof v === "number" ? v : parseFloat(v);
  return {
    id: r.id,
    trackingNumber: r.tracking_number,
    status: r.status,
    origin: { name: r.origin_city, lat: r.origin_lat, lng: r.origin_lng },
    destination: {
      name: r.destination_city,
      lat: r.destination_lat,
      lng: r.destination_lng,
    },
    currentPosition: {
      lat: r.current_lat ?? r.origin_lat,
      lng: r.current_lng ?? r.origin_lng,
    },
    progress: progressFraction,
    etaMinutes: r.eta_minutes,
    carrier: r.carrier,
    weight: r.weight,
    service: r.service,
    shippedAt: r.shipped_date,
    history: Array.isArray(r.history) ? (r.history as HistoryEvent[]) : [],
    packageDescription: r.package_description ?? null,
    breederName: r.breeder_name ?? null,
    breederAddress: r.breeder_address ?? null,
    receiverName: r.receiver_name ?? null,
    receiverPhone: r.receiver_phone ?? null,
    receiverEmail: r.receiver_email ?? null,
    receiverAddress: r.receiver_address ?? null,
    totalPrice: toNum(r.total_price),
    amountPaid: toNum(r.amount_paid),
  };
}

export async function findShipment(tracking: string): Promise<Shipment | null> {
  const t = tracking.trim();
  if (!t) return null;
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .ilike("tracking_number", t)
    .maybeSingle();
  if (error || !data) return null;
  return rowToShipment(data as ShipmentRow);
}

export async function listShipments(): Promise<Shipment[]> {
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as ShipmentRow[]).map(rowToShipment);
}

export async function listSampleTrackingNumbers(limit = 4): Promise<string[]> {
  const { data, error } = await supabase
    .from("shipments")
    .select("tracking_number")
    .limit(limit);
  if (error || !data) return [];
  return data.map((d) => d.tracking_number as string);
}

/** Linearly interpolate a midpoint along the route. */
export function interpolate(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  t: number,
) {
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  };
}

export function formatShippedDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatEta(minutes: number): string {
  if (minutes <= 0) return "Arrived";
  const days = Math.max(1, Math.round(minutes / 1440));
  return days === 1 ? "1 day" : `${days} days`;
}

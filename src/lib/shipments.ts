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
  progress: number;
  etaMinutes: number;
  carrier: string;
  weight: string | null;
  service: string | null;
  shippedAt: string;
  history: HistoryEvent[];
  // Breeder
  breeder_name: string | null;
  breeder_address: string | null;
  // Package
  package_description: string | null;
  // Receiver / Client
  receiver_name: string | null;
  receiver_address: string | null;
  receiver_phone: string | null;
  receiver_email: string | null;
  // Payment
  total_price: number | null;
  amount_paid: number | null;
  amount_remaining: number | null;
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
  breeder_name: string | null;
  breeder_address: string | null;
  package_description: string | null;
  receiver_name: string | null;
  receiver_address: string | null;
  receiver_phone: string | null;
  receiver_email: string | null;
  total_price: number | null;
  amount_paid: number | null;
  amount_remaining: number | null;
};

function rowToShipment(r: ShipmentRow): Shipment {
  const progressFraction = (r.progress ?? 0) / 100;
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
    breeder_name: r.breeder_name ?? null,
    breeder_address: r.breeder_address ?? null,
    package_description: r.package_description ?? null,
    receiver_name: r.receiver_name ?? null,
    receiver_address: r.receiver_address ?? null,
    receiver_phone: r.receiver_phone ?? null,
    receiver_email: r.receiver_email ?? null,
    total_price: r.total_price ?? null,
    amount_paid: r.amount_paid ?? null,
    amount_remaining: r.amount_remaining ?? null,
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
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h < 24) return `${h}h ${m}m`;
  const d = Math.floor(h / 24);
  const rh = h % 24;
  return `${d}d ${rh}h`;
}

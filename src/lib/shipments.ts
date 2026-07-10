// Shipment types and helpers. Data lives in Supabase.
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
  /** ISO date string of when the package was shipped (legacy fallback) */
  shippedAt: string;
  /** Actual shipped date+time (admin-set) */
  shippedAtTimestamp: string | null;
  /** Expected delivery date+time */
  expectedDeliveryAt: string | null;
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
  currency: string;
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
  shipped_at: string | null;
  expected_delivery_at: string | null;
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
  currency: string | null;
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
    shippedAtTimestamp: r.shipped_at ?? null,
    expectedDeliveryAt: r.expected_delivery_at ?? null,
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
    currency: r.currency ?? "USD",
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

export function formatShippedDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatEta(minutes: number): string {
  if (minutes <= 0) return "Arrived";

  const totalMinutes = Math.round(minutes);

  if (totalMinutes < 60) {
    return totalMinutes === 1 ? "1 minute" : `${totalMinutes} minutes`;
  }

  if (totalMinutes < 1440) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const hoursPart = hours === 1 ? "1 hour" : `${hours} hours`;
    if (mins === 0) return hoursPart;
    const minsPart = mins === 1 ? "1 minute" : `${mins} minutes`;
    return `${hoursPart} ${minsPart}`;
  }

  const days = Math.floor(totalMinutes / 1440);
  const remMinutes = totalMinutes % 1440;
  const hours = Math.floor(remMinutes / 60);
  const daysPart = days === 1 ? "1 day" : `${days} days`;
  if (hours === 0) return daysPart;
  const hoursPart = hours === 1 ? "1 hour" : `${hours} hours`;
  return `${daysPart} ${hoursPart}`;
}

/** Format a currency amount with the correct symbol */
export function formatCurrency(amount: number | null, currency: string): string {
  if (amount === null) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/** Geocode a city/address string → {lat, lng} using Nominatim (OpenStreetMap) */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!address.trim()) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    const data = await res.json();
    if (!data || data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

export const CURRENCIES = [
  { code: "USD", label: "US Dollar (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "GBP", label: "British Pound (GBP)" },
  { code: "CAD", label: "Canadian Dollar (CAD)" },
  { code: "AUD", label: "Australian Dollar (AUD)" },
  { code: "JPY", label: "Japanese Yen (JPY)" },
  { code: "CHF", label: "Swiss Franc (CHF)" },
  { code: "CNY", label: "Chinese Yuan (CNY)" },
  { code: "INR", label: "Indian Rupee (INR)" },
  { code: "NGN", label: "Nigerian Naira (NGN)" },
  { code: "GHS", label: "Ghanaian Cedi (GHS)" },
  { code: "KES", label: "Kenyan Shilling (KES)" },
  { code: "ZAR", label: "South African Rand (ZAR)" },
  { code: "XAF", label: "Central African CFA Franc (XAF)" },
  { code: "XOF", label: "West African CFA Franc (XOF)" },
  { code: "BRL", label: "Brazilian Real (BRL)" },
  { code: "MXN", label: "Mexican Peso (MXN)" },
  { code: "AED", label: "UAE Dirham (AED)" },
  { code: "SAR", label: "Saudi Riyal (SAR)" },
  { code: "SGD", label: "Singapore Dollar (SGD)" },
];

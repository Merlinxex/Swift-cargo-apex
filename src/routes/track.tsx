import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft,
  CalendarClock,
  CalendarCheck,
  Clock,
  Mail,
  MapPin,
  Navigation,
  Package,
  Phone,
  Search,
  Truck,
  User,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackingMap } from "@/components/TrackingMap";
import {
  findShipment,
  formatCurrency,
  formatEta,
  formatShippedDate,
  type Shipment,
} from "@/lib/shipments";

const searchSchema = z.object({
  tn: z.string().catch(""),
});

export const Route = createFileRoute("/track")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Track Shipment — Swift Cargo Apex" },
      {
        name: "description",
        content:
          "Track a shipment by tracking number. View live location on an interactive map and estimated time of arrival.",
      },
      { property: "og:title", content: "Track Shipment — Swift Cargo Apex" },
      { property: "og:description", content: "Live map and ETA for your shipment." },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const { tn } = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState(tn);
  const [baseShipment, setBaseShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setQuery(tn); }, [tn]);

  useEffect(() => {
    let cancelled = false;
    if (!tn) { setBaseShipment(null); return; }
    setLoading(true);
    void findShipment(tn).then((s) => {
      if (cancelled) return;
      setBaseShipment(s);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [tn]);

  const [progress, setProgress] = useState(0);
  const [etaMinutes, setEtaMinutes] = useState(0);

  useEffect(() => {
    if (!baseShipment) return;
    setProgress(baseShipment.progress);
    setEtaMinutes(baseShipment.etaMinutes);
  }, [baseShipment]);

  // Use the stored current position from the DB directly — admin sets this via the map picker
  const currentPosition = useMemo(() => {
    if (!baseShipment) return null;
    return baseShipment.currentPosition;
  }, [baseShipment]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = query.trim();
    navigate({ to: "/track", search: { tn: v } });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <form
          onSubmit={submit}
          className="mb-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-secondary px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter tracking number"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              aria-label="Tracking number"
              maxLength={64}
            />
          </div>
          <Button
            type="submit"
            className="h-11 gap-2 font-semibold text-accent-foreground"
            style={{ background: "var(--gradient-accent)" }}
          >
            Track <Navigation className="h-4 w-4" />
          </Button>
        </form>

        {!tn && <EmptyState />}
        {tn && loading && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            Looking up shipment…
          </div>
        )}
        {tn && !loading && !baseShipment && <NotFound query={tn} />}

        {baseShipment && currentPosition && (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Left: map + progress bar */}
            <div>
              <TrackingMap
                origin={baseShipment.origin}
                destination={baseShipment.destination}
                current={currentPosition}
              />

              <div className="mt-6 rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {baseShipment.origin.name}
                  </span>
                  <span className="flex items-center gap-1">
                    {baseShipment.destination.name} <MapPin className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="relative h-2 w-full rounded-full bg-secondary">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                    style={{ width: `${Math.round(progress * 100)}%`, background: "var(--gradient-accent)" }}
                  />
                  <div
                    className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-background transition-all duration-700"
                    style={{ left: `${Math.round(progress * 100)}%`, background: "var(--accent)", boxShadow: "var(--shadow-glow)" }}
                  />
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {Math.round(progress * 100)}% of route completed
                </div>
              </div>

              {/* ── Full shipment details panel ── */}
              <div className="mt-6 space-y-4">

                {/* Route info */}
                <InfoCard title="Route details" icon={<MapPin className="h-3.5 w-3.5" />}>
                  <GridDetails items={[
                    { label: "Origin", value: baseShipment.origin.name },
                    { label: "Destination", value: baseShipment.destination.name },
                    { label: "Carrier", value: baseShipment.carrier },
                    { label: "Service", value: baseShipment.service ?? "—" },
                    { label: "Weight", value: baseShipment.weight ?? "—" },
                    { label: "Package", value: baseShipment.packageDescription ?? "—" },
                  ]} />
                </InfoCard>

                {/* Dates */}
                <InfoCard title="Shipment dates" icon={<CalendarClock className="h-3.5 w-3.5" />}>
                  <GridDetails items={[
                    {
                      label: "Date & time shipped",
                      value: formatShippedDate(baseShipment.shippedAtTimestamp ?? baseShipment.shippedAt),
                    },
                    {
                      label: "Expected delivery",
                      value: baseShipment.expectedDeliveryAt
                        ? formatShippedDate(baseShipment.expectedDeliveryAt)
                        : "—",
                    },
                  ]} />
                </InfoCard>

                {/* Sender */}
                {(baseShipment.breederName || baseShipment.breederAddress) && (
                  <InfoCard title="Sender information" icon={<User className="h-3.5 w-3.5" />}>
                    <GridDetails items={[
                      { label: "Sender name", value: baseShipment.breederName ?? "—" },
                      { label: "Sender address", value: baseShipment.breederAddress ?? "—" },
                    ]} />
                  </InfoCard>
                )}

                {/* Receiver */}
                {(baseShipment.receiverName || baseShipment.receiverPhone || baseShipment.receiverEmail || baseShipment.receiverAddress) && (
                  <InfoCard title="Receiver information" icon={<User className="h-3.5 w-3.5" />}>
                    <GridDetails items={[
                      { label: "Name", value: baseShipment.receiverName ?? "—" },
                      { label: "Phone", value: baseShipment.receiverPhone ?? "—", icon: <Phone className="h-3 w-3" /> },
                      { label: "Email", value: baseShipment.receiverEmail ?? "—", icon: <Mail className="h-3 w-3" /> },
                      { label: "Address", value: baseShipment.receiverAddress ?? "—", fullWidth: true },
                    ]} />
                  </InfoCard>
                )}

                {/* Payment */}
                {baseShipment.totalPrice !== null && (
                  <InfoCard title="Payment summary" icon={<CreditCard className="h-3.5 w-3.5" />}>
                    <GridDetails items={[
                      { label: "Total price", value: formatCurrency(baseShipment.totalPrice, baseShipment.currency) },
                      { label: "Amount paid", value: formatCurrency(baseShipment.amountPaid, baseShipment.currency) },
                      {
                        label: "Amount remaining",
                        value: formatCurrency(
                          baseShipment.totalPrice - (baseShipment.amountPaid ?? 0),
                          baseShipment.currency,
                        ),
                      },
                      { label: "Currency", value: baseShipment.currency },
                    ]} />
                  </InfoCard>
                )}
              </div>
            </div>

            {/* Right sidebar */}
            <aside className="space-y-4">
              <div
                className="rounded-2xl border border-border bg-card p-6"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Package className="h-3.5 w-3.5" /> Shipment
                </div>
                <div className="mt-1 font-mono text-lg font-bold">{baseShipment.trackingNumber}</div>
                <span
                  className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold"
                  style={{ background: "var(--gradient-accent)", color: "var(--accent-foreground)" }}
                >
                  {baseShipment.status}
                </span>

                <div className="mt-6 space-y-3 text-sm">
                  <InfoRow icon={<MapPin className="h-4 w-4" />} label="From" value={baseShipment.origin.name} />
                  <InfoRow icon={<MapPin className="h-4 w-4" />} label="To" value={baseShipment.destination.name} />
                  <InfoRow icon={<Truck className="h-4 w-4" />} label="Carrier" value={baseShipment.carrier} />
                  {baseShipment.receiverName && (
                    <InfoRow icon={<User className="h-4 w-4" />} label="Receiver" value={baseShipment.receiverName} />
                  )}
                  {baseShipment.receiverPhone && (
                    <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={baseShipment.receiverPhone} />
                  )}
                </div>

                <div className="mt-5 flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--accent)" }} />
                  <span>
                    Shipped{" "}
                    <span className="font-semibold text-foreground">
                      {formatShippedDate(baseShipment.shippedAtTimestamp ?? baseShipment.shippedAt)}
                    </span>
                  </span>
                </div>

                {baseShipment.expectedDeliveryAt && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
                    <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--accent)" }} />
                    <span>
                      Expected delivery{" "}
                      <span className="font-semibold text-foreground">
                        {formatShippedDate(baseShipment.expectedDeliveryAt)}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              <div
                className="rounded-2xl p-6 text-hero-foreground"
                style={{ background: "var(--gradient-hero)" }}
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
                  <Clock className="h-3.5 w-3.5" /> Estimated wait time
                </div>
                <div className="mt-2 text-4xl font-extrabold">
                  {etaMinutes <= 0 ? "Arrived" : formatEta(etaMinutes)}
                </div>
                <div className="mt-1 text-xs opacity-70">Recalculated live</div>
              </div>

              {baseShipment.history.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <Truck className="h-3.5 w-3.5" /> Activity
                  </div>
                  <ol className="mt-4 space-y-4">
                    {baseShipment.history.map((h, i: number) => (
                      <li key={i} className="flex gap-3">
                        <div className="relative mt-1 flex flex-col items-center">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              background: i === baseShipment.history.length - 1
                                ? "var(--accent)"
                                : "var(--primary)",
                            }}
                          />
                          {i < baseShipment.history.length - 1 && (
                            <span className="mt-1 h-8 w-px bg-border" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">{h.time ?? h.at ?? ""}</div>
                          <div className="text-sm font-medium">{h.label}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Small presentational helpers ── */

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-5"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function GridDetails({
  items,
}: {
  items: { label: string; value: string; icon?: React.ReactNode; fullWidth?: boolean }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
      {items.map((item) => (
        <div key={item.label} className={item.fullWidth ? "col-span-2" : ""}>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{item.label}</div>
          <div className="mt-0.5 flex items-center gap-1 font-medium break-words">
            {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-muted-foreground" style={{ color: "var(--accent)" }}>
        {icon}
      </span>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <Package className="mx-auto h-10 w-10 text-muted-foreground" />
      <h2 className="mt-4 text-xl font-bold">Enter a tracking number</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Type your tracking number above and press <span className="font-semibold">Track</span> to see your shipment details.
      </p>
    </div>
  );
}

function NotFound({ query }: { query: string }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
      <h2 className="text-xl font-bold">Tracking number not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn't find a shipment matching{" "}
        <span className="font-mono font-semibold">{query}</span>. Please double-check the tracking number on your confirmation email or contact support.
      </p>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { ArrowLeft, CalendarClock, Clock, MapPin, Navigation, Package, Search, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackingMap } from "@/components/TrackingMap";
import {
  findShipment,
  formatEta,
  formatShippedDate,
  interpolate,
  listSampleTrackingNumbers,
  type Shipment,
} from "@/lib/shipments";

const searchSchema = z.object({
  tn: z.string().catch(""),
});

export const Route = createFileRoute("/track")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Track Shipment — Swift Cargo" },
      {
        name: "description",
        content:
          "Track a shipment by tracking number. View live location on an interactive map and estimated time of arrival.",
      },
      { property: "og:title", content: "Track Shipment — Swift Cargo" },
      {
        property: "og:description",
        content: "Live map and ETA for your shipment.",
      },
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

  useEffect(() => {
    setQuery(tn);
  }, [tn]);

  useEffect(() => {
    let cancelled = false;
    if (!tn) {
      setBaseShipment(null);
      return;
    }
    setLoading(true);
    void findShipment(tn).then((s) => {
      if (cancelled) return;
      setBaseShipment(s);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [tn]);

  // Live-updating progress / position / ETA
  const [progress, setProgress] = useState(0);
  const [etaMinutes, setEtaMinutes] = useState(0);

  useEffect(() => {
    if (!baseShipment) return;
    setProgress(baseShipment.progress);
    setEtaMinutes(baseShipment.etaMinutes);

    const interval = setInterval(() => {
      setProgress((p: number) => {
        if (p >= 1) return 1;
        return Math.min(1, p + 0.004);
      });
      setEtaMinutes((m: number) =>
        Math.max(0, m - 0.4 * baseShipment.etaMinutes * 0.01),
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [baseShipment]);

  const currentPosition = useMemo(() => {
    if (!baseShipment) return null;
    return interpolate(baseShipment.origin, baseShipment.destination, progress);
  }, [baseShipment, progress]);

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
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
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
                    style={{
                      width: `${Math.round(progress * 100)}%`,
                      background: "var(--gradient-accent)",
                    }}
                  />
                  <div
                    className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-background transition-all duration-700"
                    style={{
                      left: `${Math.round(progress * 100)}%`,
                      background: "var(--accent)",
                      boxShadow: "var(--shadow-glow)",
                    }}
                  />
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {Math.round(progress * 100)}% of route completed · live updating
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div
                className="rounded-2xl border border-border bg-card p-6"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Package className="h-3.5 w-3.5" /> Shipment
                </div>
                <div className="mt-1 font-mono text-lg font-bold">
                  {baseShipment.trackingNumber}
                </div>
                <span
                  className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    background: "var(--gradient-accent)",
                    color: "var(--accent-foreground)",
                  }}
                >
                  {baseShipment.status}
                </span>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <Detail label="Carrier" value={baseShipment.carrier} />
                  <Detail label="Service" value={baseShipment.service ?? "—"} />
                  <Detail label="Weight" value={baseShipment.weight ?? "—"} />
                  <Detail label="Shipped on" value={formatShippedDate(baseShipment.shippedAt)} />
                  <Detail label="From" value={baseShipment.origin.name} />
                  <Detail label="To" value={baseShipment.destination.name} />
                </div>

                <div className="mt-5 flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
                  <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--accent)" }} />
                  <span>
                    Package shipped{" "}
                    <span className="font-semibold text-foreground">
                      {formatShippedDate(baseShipment.shippedAt)}
                    </span>
                  </span>
                </div>
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
                              background:
                                i === baseShipment.history.length - 1
                                  ? "var(--accent)"
                                  : "var(--primary)",
                            }}
                          />
                          {i < baseShipment.history.length - 1 && (
                            <span className="mt-1 h-8 w-px bg-border" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            {h.time ?? h.at ?? ""}
                          </div>
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function EmptyState() {
  const [samples, setSamples] = useState<string[]>([]);
  useEffect(() => {
    void listSampleTrackingNumbers(6).then(setSamples);
  }, []);
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <Package className="mx-auto h-10 w-10 text-muted-foreground" />
      <h2 className="mt-4 text-xl font-bold">Enter a tracking number</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Try one of our demo shipments below.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {samples.map((s) => (
          <Link
            key={s}
            to="/track"
            search={{ tn: s }}
            className="rounded-full border border-border bg-secondary px-3 py-1 font-mono text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {s}
          </Link>
        ))}
      </div>
    </div>
  );
}

function NotFound({ query }: { query: string }) {
  const [samples, setSamples] = useState<string[]>([]);
  useEffect(() => {
    void listSampleTrackingNumbers(6).then(setSamples);
  }, []);
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
      <h2 className="text-xl font-bold">Tracking number not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn't find a shipment matching{" "}
        <span className="font-mono font-semibold">{query}</span>. Double-check the number or try a
        demo one.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {samples.map((s) => (
          <Link
            key={s}
            to="/track"
            search={{ tn: s }}
            className="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs hover:bg-accent hover:text-accent-foreground"
          >
            {s}
          </Link>
        ))}
      </div>
    </div>
  );
}

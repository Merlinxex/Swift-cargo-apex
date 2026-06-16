import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Clock, ShieldCheck, Truck, Globe2, PackageSearch, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/SiteHeader";
import { listSampleTrackingNumbers } from "@/lib/shipments";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Swift Cargo — Global Freight & Live Shipment Tracking" },
      {
        name: "description",
        content:
          "Professional logistics services with live shipment tracking on a real-time map. Track your freight by tracking number and see current location plus ETA.",
      },
      { property: "og:title", content: "Swift Cargo — Live Shipment Tracking" },
      {
        property: "og:description",
        content: "Track any shipment by number and watch its location update live on a map.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [tn, setTn] = useState("");
  const [samples, setSamples] = useState<string[]>([]);

  useEffect(() => {
    void listSampleTrackingNumbers(4).then(setSamples);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = tn.trim();
    if (!value) return;
    navigate({ to: "/track", search: { tn: value } });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section
        className="relative overflow-hidden text-hero-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Hero background image — car transporter on highway */}
        <img
          src="/images/1000168247.jpg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <div className="container relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            Live tracking, no setup
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Move freight with{" "}
            <span style={{ color: "var(--accent)" }}>confidence.</span>
            <br />
            Track every shipment in real time.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-hero-foreground/80 md:text-lg">
            Enter your tracking number to see the current location on a live map and the estimated
            time of arrival — anywhere in the world.
          </p>

          {/* Tracking form */}
          <form
            onSubmit={submit}
            className="mt-10 flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur md:flex-row"
          >
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-background px-4">
              <PackageSearch className="h-5 w-5 text-muted-foreground" />
              <Input
                value={tn}
                onChange={(e) => setTn(e.target.value)}
                placeholder="Enter tracking number, e.g. SC-100001"
                className="border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0 md:text-base"
                aria-label="Tracking number"
                maxLength={64}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 gap-2 font-semibold text-accent-foreground hover:opacity-90"
              style={{ background: "var(--gradient-accent)" }}
            >
              Track shipment <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {samples.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-hero-foreground/70">
              <span>Try:</span>
              {samples.map((s) => (
                <button
                  key={s}
                  onClick={() => setTn(s)}
                  className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[11px] transition-colors hover:bg-white/15"
                  type="button"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Live map view",
              text: "See your shipment's location update on an interactive OpenStreetMap.",
            },
            {
              icon: Clock,
              title: "Accurate ETAs",
              text: "Estimated wait time refreshes automatically as the shipment moves.",
            },
            {
              icon: ShieldCheck,
              title: "Insured cargo",
              text: "Every shipment fully insured and monitored 24/7 by our operations team.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <div
                className="mb-4 grid h-11 w-11 place-items-center rounded-lg"
                style={{ background: "var(--gradient-accent)" }}
              >
                <Icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services band */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
          {[
            { icon: Truck, title: "Road Freight", text: "FTL & LTL across the continent." },
            { icon: Globe2, title: "Global Forwarding", text: "Air & ocean to 120+ countries." },
            { icon: PackageSearch, title: "Warehousing", text: "Smart fulfilment & last-mile." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <Icon className="h-7 w-7" style={{ color: "var(--accent)" }} />
              <div>
                <div className="font-bold">{title}</div>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div className="relative rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-elegant)" }}>
            {/* Warehouse team checking manifest */}
            <img
              src="/images/1000168255.jpg"
              alt="Warehouse logistics team checking shipment manifest"
              className="w-full h-80 object-cover"
            />
            <div
              className="absolute bottom-0 left-0 right-0 p-5 text-white"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}
            >
              <div className="text-2xl font-extrabold">18,000+</div>
              <div className="text-sm opacity-80">Shipments coordinated every month</div>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
              Why choose us
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              Your trusted global logistics partner.
            </h2>
            <p className="mt-4 text-muted-foreground">
              From single pallets to full loads, Swift Cargo delivers seamless freight solutions
              with the technology and team to back it up.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Fast, secure & reliable delivery",
                "Global coverage, local expertise",
                "Real-time tracking & live updates",
                "Customs clearance & documentation",
                "24/7 operations support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "var(--accent)" }} />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-7 font-semibold text-accent-foreground" style={{ background: "var(--gradient-accent)" }}>
              <Link to="/contact">Contact our team <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── GALLERY 1: Packages & Parcels ── */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container mx-auto max-w-6xl px-4 pt-14 pb-8">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Packages & parcels</span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1 mb-6">Shipments packed & ready</h2>

          {/* Row 1 — 1 wide banner + 2 squares */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {/* Delivery courier unloading van — wide */}
            <div className="col-span-2 overflow-hidden rounded-xl" style={{ height: 260 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168226.jpg"
                alt="Courier in blue uniform unloading cardboard boxes from a white delivery van" />
            </div>
            {/* Warehouse manager with tablet */}
            <div className="overflow-hidden rounded-xl" style={{ height: 260 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168222.jpg"
                alt="Warehouse manager checking shipment inventory on a tablet" />
            </div>
          </div>

          {/* Row 2 — 4 squares */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Delivery van courier (alternate angle) */}
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168212.jpg"
                alt="Delivery driver unloading parcels from a white cargo van at a residential address" />
            </div>
            {/* Forklift loading truck */}
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168221.jpg"
                alt="Yellow forklift loading palletised boxes into a freight truck" />
            </div>
            {/* Warehouse workers with clipboard */}
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168255.jpg"
                alt="Two warehouse staff in hard hats reviewing a shipment manifest" />
            </div>
            {/* Produce crate with trucks in background */}
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168254.jpg"
                alt="Fresh produce in a wooden crate with refrigerated freight trucks in the background" />
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY 2: Couriers & Delivery ── */}
      <section className="border-t border-border bg-background">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Couriers & delivery</span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1 mb-6">Last-mile delivery</h2>

          {/* Row 1 — 3 equal tall */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {/* Courier unloading van (main hero image) */}
            <div className="overflow-hidden rounded-xl" style={{ height: 300 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168226.jpg"
                alt="Courier in blue uniform lifting boxes from the back of a white delivery van" />
            </div>
            {/* Second courier van shot */}
            <div className="overflow-hidden rounded-xl" style={{ height: 300 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168212.jpg"
                alt="Delivery driver unloading packages from cargo van at a suburban home" />
            </div>
            {/* Electric delivery truck */}
            <div className="overflow-hidden rounded-xl" style={{ height: 300 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168237.jpg"
                alt="Modern electric delivery truck parked at a charging station" />
            </div>
          </div>

          {/* Row 2 — 2 wide + 1 */}
          <div className="grid grid-cols-3 gap-3">
            {/* Warehouse tablet manager — wide */}
            <div className="col-span-2 overflow-hidden rounded-xl" style={{ height: 240 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168222.jpg"
                alt="Logistics manager scanning parcels with a tablet inside a fulfilment centre" />
            </div>
            {/* Forklift */}
            <div className="overflow-hidden rounded-xl" style={{ height: 240 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168221.jpg"
                alt="Forklift operator loading freight into a truck at a distribution depot" />
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY 3: Warehouse & Sorting ── */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Warehouse & sorting</span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1 mb-6">Sorting & dispatch centres</h2>

          {/* Row — 4 squares */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168255.jpg"
                alt="Warehouse workers in safety vests and hard hats processing an inbound shipment" />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168222.jpg"
                alt="Warehouse operative scanning a parcel with a digital tablet" />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168221.jpg"
                alt="Forklift loading pallets of boxed goods onto a freight truck" />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168237.jpg"
                alt="Electric delivery truck at a green energy charging hub" />
            </div>
          </div>

          {/* Row 2 — 1 tall left + 2 stacked right */}
          <div className="grid grid-cols-3 gap-3">
            {/* Air freight loading — tall left */}
            <div className="row-span-2 overflow-hidden rounded-xl" style={{ height: 380 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168215.jpg"
                alt="Air freight cargo containers being loaded onto a wide-body aircraft" />
            </div>
            {/* Pet crates being prepped for air freight */}
            <div className="overflow-hidden rounded-xl" style={{ height: 184 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168234.jpg"
                alt="Ground crew in orange vests preparing animal crates for air cargo loading" />
            </div>
            {/* Produce with trucks */}
            <div className="overflow-hidden rounded-xl" style={{ height: 184 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168254.jpg"
                alt="Fresh produce crate staged in front of refrigerated cargo trucks" />
            </div>
            {/* Courier van */}
            <div className="overflow-hidden rounded-xl" style={{ height: 184 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168226.jpg"
                alt="Courier unloading last-mile delivery parcels from a white van" />
            </div>
            {/* Warehouse staff */}
            <div className="overflow-hidden rounded-xl" style={{ height: 184 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168255.jpg"
                alt="Logistics team reviewing dispatch orders inside a sorting warehouse" />
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY 4: Specialist — Vehicles, Pets & Livestock ── */}
      <section className="border-t border-border bg-background">
        <div className="container mx-auto max-w-6xl px-4 py-8 pb-16">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Specialist shipping</span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1 mb-6">Vehicles, pets, livestock & oversized cargo</h2>

          {/* Row 1 — 1 wide + 2 squares */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {/* Multi-level car transporter on highway — wide hero */}
            <div className="col-span-2 overflow-hidden rounded-xl" style={{ height: 280 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168247.jpg"
                alt="Multi-level car transporter truck carrying SUVs on a motorway" />
            </div>
            {/* Car carrier loading yard */}
            <div className="overflow-hidden rounded-xl" style={{ height: 280 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168213.jpg"
                alt="Red convertible and hatchback being loaded onto a car transport trailer" />
            </div>
          </div>

          {/* Row 2 — 4 squares */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {/* Cars in shipping container + wrapped motorcycle */}
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168227.jpg"
                alt="Saloon cars loaded two-high inside a shipping container, with a wrapped motorcycle alongside" />
            </div>
            {/* Horse being loaded onto aircraft */}
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168235.jpg"
                alt="Handlers guiding a racehorse up a ramp into a small cargo aircraft" />
            </div>
            {/* Pet crate at airport check-in */}
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168260.jpg"
                alt="Pet travel crate on a trolley at an international airport check-in counter" />
            </div>
            {/* Orange animal crates staged for air freight */}
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168234.jpg"
                alt="Rows of orange animal shipping crates being prepared for air cargo loading" />
            </div>
          </div>

          {/* Row 3 — livestock + car transporter yard */}
          <div className="grid grid-cols-3 gap-3">
            {/* Livestock truck — wide */}
            <div className="col-span-2 overflow-hidden rounded-xl" style={{ height: 240 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168261.jpg"
                alt="Multi-deck livestock truck transporting pigs on an open highway" />
            </div>
            {/* Air freight cargo loading */}
            <div className="overflow-hidden rounded-xl" style={{ height: 240 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="/images/1000168215.jpg"
                alt="ULD cargo pallets being loaded into the belly of a passenger aircraft" />
            </div>
          </div>
        </div>
      </section>

      <footer className="container mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Swift Cargo. Powered by OpenStreetMap.
      </footer>
    </div>
  );
}

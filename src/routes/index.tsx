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
        {/* Hero background image */}
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=80&auto=format&fit=crop"
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
            <img
              src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=900&q=80&auto=format&fit=crop"
              alt="Logistics warehouse operations"
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
            <div className="col-span-2 overflow-hidden rounded-xl" style={{ height: 260 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=900&q=80&auto=format&fit=crop"
                alt="Brown cardboard boxes stacked on a black plastic shipping crate" />
            </div>
            <div className="overflow-hidden rounded-xl" style={{ height: 260 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1620455800201-7f00aeef12ed?w=600&q=80&auto=format&fit=crop"
                alt="Stack of brown cardboard shipping boxes" />
            </div>
          </div>

          {/* Row 2 — 4 squares */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&q=80&auto=format&fit=crop"
                alt="Person handing over a brown shipping box" />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1614018453562-77f6180ce036?w=600&q=80&auto=format&fit=crop"
                alt="Brown cardboard parcel left beside a white door" />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1638501478003-4e9761dcfe22?w=600&q=80&auto=format&fit=crop"
                alt="Delivered cardboard box sitting in front of a door" />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1609143739217-01b60dad1c67?w=600&q=80&auto=format&fit=crop"
                alt="Brown cardboard boxes placed on white floor tiles" />
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
            <div className="overflow-hidden rounded-xl" style={{ height: 300 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1582902281043-69c645f40cd5?w=600&q=80&auto=format&fit=crop"
                alt="Male courier in green jacket standing outside with parcel" />
            </div>
            <div className="overflow-hidden rounded-xl" style={{ height: 300 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1543499459-d1460946bdc6?w=600&q=80&auto=format&fit=crop"
                alt="Man carrying multiple cardboard boxes during delivery" />
            </div>
            <div className="overflow-hidden rounded-xl" style={{ height: 300 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1607227063002-677dc5fdf96f?w=600&q=80&auto=format&fit=crop"
                alt="Delivery man in green shirt holding a brown cardboard box" />
            </div>
          </div>

          {/* Row 2 — 2 wide + 1 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 overflow-hidden rounded-xl" style={{ height: 240 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1638045420324-e431122074c2?w=900&q=80&auto=format&fit=crop"
                alt="Courier carrying a box while walking on a city street" />
            </div>
            <div className="overflow-hidden rounded-xl" style={{ height: 240 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1449247666642-264389f5f5b1?w=600&q=80&auto=format&fit=crop"
                alt="Person holding an open cardboard shipping box on a table" />
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
                src="https://images.unsplash.com/photo-1600186755589-84242bd8368f?w=600&q=80&auto=format&fit=crop"
                alt="Brown cardboard boxes arranged on grey metal warehouse racks" />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1633174524827-db00a6b7bc74?w=600&q=80&auto=format&fit=crop"
                alt="Two Amazon shipping boxes stacked on top of each other" />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1605732562742-3023a888e56e?w=600&q=80&auto=format&fit=crop"
                alt="Pet shipping crates and cargo boxes staged on airport tarmac" />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1716718810773-d2a52b43602f?w=600&q=80&auto=format&fit=crop"
                alt="Lufthansa Cargo Boeing 777F parked on airport tarmac" />
            </div>
          </div>

          {/* Row 2 — 1 tall left + 2 stacked right */}
          <div className="grid grid-cols-3 gap-3">
            <div className="row-span-2 overflow-hidden rounded-xl" style={{ height: 380 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80&auto=format&fit=crop"
                alt="Large warehouse interior fully stocked with pallet goods" />
            </div>
            <div className="overflow-hidden rounded-xl" style={{ height: 184 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80&auto=format&fit=crop"
                alt="Forklift moving palletised boxes in a distribution centre" />
            </div>
            <div className="overflow-hidden rounded-xl" style={{ height: 184 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80&auto=format&fit=crop"
                alt="Semi truck loaded with cargo driving on open highway" />
            </div>
            <div className="overflow-hidden rounded-xl" style={{ height: 184 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80&auto=format&fit=crop"
                alt="Air freight pallets being loaded onto cargo aircraft" />
            </div>
            <div className="overflow-hidden rounded-xl" style={{ height: 184 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1742940796395-b2a614941353?w=600&q=80&auto=format&fit=crop"
                alt="Modern car transporter truck driving along highway" />
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY 4: Specialist — Pet crates & Vehicles ── */}
      <section className="border-t border-border bg-background">
        <div className="container mx-auto max-w-6xl px-4 py-8 pb-16">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Specialist shipping</span>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1 mb-6">Pets, vehicles & oversized cargo</h2>

          {/* Row 1 — 1 wide + 2 squares */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="col-span-2 overflow-hidden rounded-xl" style={{ height: 280 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1632236519667-29b4b78da232?w=900&q=80&auto=format&fit=crop"
                alt="Brown and white dog inside a travel shipping crate" />
            </div>
            <div className="overflow-hidden rounded-xl" style={{ height: 280 }}>
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1618307987981-6ac298102409?w=600&q=80&auto=format&fit=crop"
                alt="Short-coated dog secured inside a shipping cage" />
            </div>
          </div>

          {/* Row 2 — 4 squares */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1618307987789-79e5930f902e?w=600&q=80&auto=format&fit=crop"
                alt="Dog lying inside a metal travel crate" />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1772551571018-234b42d1da78?w=600&q=80&auto=format&fit=crop"
                alt="French bulldog inside a transport crate ready for shipping" />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1772551766421-07f8644aaa69?w=600&q=80&auto=format&fit=crop"
                alt="White French bulldog sitting in a shipping cage" />
            </div>
            <div className="overflow-hidden rounded-xl aspect-square">
              <img loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                src="https://images.unsplash.com/photo-1764813824215-4afa03d1a011?w=600&q=80&auto=format&fit=crop"
                alt="Dog standing in a travel cage ready for transport" />
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

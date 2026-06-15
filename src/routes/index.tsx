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

      {/* Photo gallery strip */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-extrabold tracking-tight mb-6">Our operations in action</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { src: "https://images.unsplash.com/photo-1568952433726-3896e3881c65?w=600&q=80&auto=format&fit=crop", alt: "Freight trucks lined up at depot" },
              { src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80&auto=format&fit=crop", alt: "Air cargo loading on tarmac" },
              { src: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80&auto=format&fit=crop", alt: "Warehouse interior with pallets" },
              { src: "https://images.unsplash.com/photo-1520583457224-aee11bad5112?w=600&q=80&auto=format&fit=crop", alt: "Container ship at port" },
            ].map(({ src, alt }) => (
              <div key={alt} className="overflow-hidden rounded-xl aspect-square">
                <img
                  src={src}
                  alt={alt}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="container mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Swift Cargo. Powered by OpenStreetMap.
      </footer>
    </div>
  );
}

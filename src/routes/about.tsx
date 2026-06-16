import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Globe2, HeartHandshake, Leaf, Truck, Users } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import teamImg from "@/assets/gallery/team.jpg.asset.json";
import supplyChain from "@/assets/gallery/supply-chain.jpg.asset.json";
import airLoading from "@/assets/gallery/air-loading.jpg.asset.json";

const HERO_IMG = "https://ytsvvygxulgnttebhoqr.supabase.co/storage/v1/object/public/images/shell_truck_charge_web-1024x683-1.jpeg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Swift Cargo Apex" },
      {
        name: "description",
        content:
          "Swift Cargo Apex is a European freight network delivering road, air and ocean shipments with live tracking and 24/7 operations support.",
      },
      { property: "og:title", content: "About Swift Cargo Apex" },
      {
        property: "og:description",
        content: "Who we are: a modern freight network built on transparency, technology and trust.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const stats = [
    { value: "120+", label: "Countries served" },
    { value: "48", label: "European hubs" },
    { value: "24/7", label: "Operations support" },
    { value: "99.4%", label: "On-time delivery" },
  ];

  const values = [
    {
      icon: HeartHandshake,
      title: "Customer first",
      text: "Every shipment is handled like it's our own. Personal service, no call-centre runaround.",
    },
    {
      icon: Leaf,
      title: "Sustainable freight",
      text: "Optimised routing, modern fleet and carbon-balanced shipping options on every lane.",
    },
    {
      icon: Award,
      title: "Operational excellence",
      text: "ISO-certified processes, insured cargo and real-time visibility on every consignment.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section
        className="relative overflow-hidden text-hero-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <img
          src={HERO_IMG}
          alt="Swift Cargo Apex truck on the road"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
          loading="eager"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(120deg, rgba(0,0,0,0.6), rgba(0,0,0,0.2) 60%, transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <div className="container relative mx-auto max-w-6xl px-4 py-20 md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            About us
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Moving the world's freight,{" "}
            <span style={{ color: "var(--accent)" }}>one shipment at a time.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-hero-foreground/80 md:text-lg">
            Swift Cargo Apex is a European-born freight network combining a 4,000-strong driver
            community with software that gives shippers real-time visibility from pickup to proof
            of delivery.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-secondary/40">
        <div className="container mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold md:text-4xl" style={{ color: "var(--primary)" }}>
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
              Our story
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              Built by shippers, for shippers.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Founded in 2014 in Hamburg, we set out to fix what frustrated us most about freight:
              opaque tracking, slow quotes and inflexible service. Today our team of 320 logistics
              professionals coordinates more than 18,000 shipments every month across road, air and
              ocean — all monitored in real time from a single platform.
            </p>
            <p className="mt-4 text-muted-foreground">
              We believe that great logistics should feel invisible to your customers and effortless
              to you. That's the standard we hold ourselves to on every lane.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="font-semibold text-accent-foreground" style={{ background: "var(--gradient-accent)" }}>
                <Link to="/contact">Talk to our team</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/track" search={{ tn: "" }}>Track a shipment</Link>
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <img src={teamImg.url} alt="Warehouse team coordinating a shipment" loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover" />
              <img src={supplyChain.url} alt="Supply chain manager on the warehouse floor" loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover" />
              <img src={airLoading.url} alt="Ground crew loading air freight" loading="lazy" className="col-span-2 aspect-[16/7] w-full rounded-xl object-cover" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Truck, title: "Modern fleet", text: "Late-model EURO-6 trucks and refrigerated units." },
              { icon: Globe2, title: "Global reach", text: "Air & ocean partners in 120+ countries." },
              { icon: Users, title: "Dedicated team", text: "Named account manager on every contract." },
              { icon: Award, title: "Certified", text: "ISO 9001 & 14001, AEO accredited." },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-5"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <div
                  className="mb-3 grid h-10 w-10 place-items-center rounded-lg"
                  style={{ background: "var(--gradient-accent)" }}
                >
                  <Icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="font-bold">{title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">What we stand for</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6">
                <Icon className="h-7 w-7" style={{ color: "var(--accent)" }} />
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="container mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Swift Cargo Apex. Powered by OpenStreetMap.
      </footer>
    </div>
  );
}

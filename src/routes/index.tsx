import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Clock, ShieldCheck, Truck, Globe2, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/SiteHeader";
import { listSampleTrackingNumbers } from "@/lib/shipments";
import heroTruck from "@/assets/gallery/hero-truck.jpg.asset.json";
import roadCars from "@/assets/gallery/road-cars.jpg.asset.json";
import airCargo from "@/assets/gallery/air-cargo.jpg.asset.json";
import vehicleTransport from "@/assets/gallery/vehicle-transport.jpg.asset.json";
import livestock from "@/assets/gallery/livestock.jpg.asset.json";
import pets from "@/assets/gallery/pets.jpg.asset.json";
import horseAir from "@/assets/gallery/horse-air.jpg.asset.json";
import warehouse from "@/assets/gallery/warehouse.jpg.asset.json";
import delivery from "@/assets/gallery/delivery.jpg.asset.json";
import supplyChain from "@/assets/gallery/supply-chain.jpg.asset.json";
import airLoading from "@/assets/gallery/air-loading.jpg.asset.json";
import containerShip from "@/assets/gallery/container-ship.jpg.asset.json";
import cargoPlane from "@/assets/gallery/cargo-plane.jpg.asset.json";
import freightTrain from "@/assets/gallery/freight-train.jpg.asset.json";
import controlRoom from "@/assets/gallery/control-room.jpg.asset.json";
import forklift from "@/assets/gallery/forklift.jpg.asset.json";
import coldChain from "@/assets/gallery/cold-chain.jpg.asset.json";
import heavyHaul from "@/assets/gallery/heavy-haul.jpg.asset.json";
import scanning from "@/assets/gallery/scanning.jpg.asset.json";
import portCrane from "@/assets/gallery/port-crane.jpg.asset.json";
import courier from "@/assets/gallery/courier.jpg.asset.json";
import convoy from "@/assets/gallery/convoy.jpg.asset.json";
import equineCare from "@/assets/gallery/equine-care.jpg.asset.json";

type Item = { src: string; title: string; text: string };

const whatWeShip: Item[] = [
  { src: roadCars.url, title: "Vehicle transport", text: "Multi-car carriers across Europe & beyond." },
  { src: airCargo.url, title: "Air freight", text: "Express palletised cargo on scheduled flights." },
  { src: warehouse.url, title: "Warehousing", text: "Bonded & ambient storage with live inventory." },
  { src: livestock.url, title: "Livestock haulage", text: "Welfare-certified transport for farm animals." },
  { src: pets.url, title: "Pet relocation", text: "IATA-compliant kennels door-to-door." },
  { src: horseAir.url, title: "Equine air transport", text: "Specialist horse stalls on cargo aircraft." },
  { src: vehicleTransport.url, title: "Containerised autos", text: "Sealed container shipping for cars & bikes." },
  { src: delivery.url, title: "Last-mile delivery", text: "Uniformed drivers, signed proof of delivery." },
];

const networkGrid: Item[] = [
  { src: containerShip.url, title: "Ocean lanes", text: "Weekly FCL & LCL sailings on every major trade lane." },
  { src: cargoPlane.url, title: "Scheduled airlift", text: "Allocated belly & freighter capacity, 7 days a week." },
  { src: freightTrain.url, title: "Intermodal rail", text: "Lower-carbon long-haul corridors across continents." },
  { src: portCrane.url, title: "Port operations", text: "Owned bays at 40+ terminals to keep dwell time low." },
];

const operationsGrid: Item[] = [
  { src: controlRoom.url, title: "24/7 control tower", text: "Eyes on every shipment, every minute, worldwide." },
  { src: scanning.url, title: "Scan-level visibility", text: "Each parcel scanned at pickup, hub, and delivery." },
  { src: forklift.url, title: "Smart warehousing", text: "Slot-optimised picking with live inventory feeds." },
  { src: coldChain.url, title: "Cold chain", text: "Temperature-monitored from origin to doorstep." },
];

const careGrid: Item[] = [
  { src: equineCare.url, title: "Animal welfare first", text: "Trained handlers and vet-checked stalls for every journey." },
  { src: courier.url, title: "Friendly couriers", text: "Uniformed, vetted drivers who treat your customers right." },
  { src: convoy.url, title: "Cross-border fleets", text: "Our own trucks — no broker chains, no surprises." },
  { src: heavyHaul.url, title: "Heavy & abnormal loads", text: "Permits, escorts and engineering planned in-house." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Swift Cargo Apex — Global Freight & Live Shipment Tracking" },
      {
        name: "description",
        content:
          "Professional logistics services with live shipment tracking on a real-time map. Track your freight by tracking number and see current location plus ETA.",
      },
      { property: "og:title", content: "Swift Cargo Apex — Live Shipment Tracking" },
      {
        property: "og:description",
        content: "Track any shipment by number and watch its location update live on a map.",
      },
    ],
  }),
  component: Index,
});

function GallerySection({
  eyebrow,
  title,
  intro,
  items,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  items: Item[];
}) {
  return (
    <section className="container mx-auto max-w-6xl px-4 py-20">
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
            {eyebrow}
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">{intro}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((g) => (
          <figure
            key={g.title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            <img
              src={g.src}
              alt={g.title}
              loading="lazy"
              width={1024}
              height={1024}
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
              <div className="text-sm font-bold">{g.title}</div>
              <div className="mt-0.5 text-xs text-white/80">{g.text}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function SplitBand({
  image,
  alt,
  eyebrow,
  title,
  body,
  reverse,
}: {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  body: string;
  reverse?: boolean;
}) {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div
        className={`container mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 ${
          reverse ? "md:[&>figure]:order-2" : ""
        }`}
      >
        <figure
          className="overflow-hidden rounded-2xl border border-border"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <img
            src={image}
            alt={alt}
            loading="lazy"
            width={1024}
            height={1024}
            className="aspect-[4/3] w-full object-cover"
          />
        </figure>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
            {eyebrow}
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
          <p className="mt-4 text-base text-muted-foreground">{body}</p>
        </div>
      </div>
    </section>
  );
}

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
        <img
          src={heroTruck.url}
          alt="Modern Swift Cargo Apex electric truck at a logistics hub"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
          loading="eager"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(120deg, rgba(0,0,0,0.55), rgba(0,0,0,0.15) 60%, transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <div className="container relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            Live tracking, no setup
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Move freight with <span style={{ color: "var(--accent)" }}>confidence.</span>
            <br />
            Track every shipment in real time.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-hero-foreground/80 md:text-lg">
            Enter your tracking number to see the current location on a live map and the estimated
            time of arrival — anywhere in the world.
          </p>

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

      {/* What we ship */}
      <GallerySection
        eyebrow="What we ship"
        title="From pallets to pedigrees — handled with care."
        intro="Specialist teams, the right equipment and live tracking for every cargo type we move across road, air and ocean."
        items={whatWeShip}
      />

      {/* Split band — supply chain story */}
      <SplitBand
        image={supplyChain.url}
        alt="Aerial view of an active logistics yard"
        eyebrow="One partner, end-to-end"
        title="Your supply chain, fully orchestrated."
        body="From the factory door to the customer's doorstep, Swift Cargo Apex stitches together road, rail, ocean and air into a single, visible journey. No handoffs lost in translation, no blind spots between carriers — just one team accountable for every leg."
      />

      {/* Network grid */}
      <GallerySection
        eyebrow="Global network"
        title="Capacity on the lanes that matter to you."
        intro="Owned and partnered assets across 120+ countries — so we can keep shipments moving even when the market won't."
        items={networkGrid}
      />

      {/* Split band — control tower */}
      <SplitBand
        image={controlRoom.url}
        alt="Operators at a 24/7 logistics control tower"
        eyebrow="Always-on operations"
        title="A control tower that never sleeps."
        body="Our global operations team watches every shipment in real time, predicts disruption before it lands, and rebooks on the fly. You get a single phone number, a single dashboard, and a single source of truth — 24 hours a day, every day of the year."
        reverse
      />

      {/* Operations grid */}
      <GallerySection
        eyebrow="How we operate"
        title="Visibility, accuracy and care at every touchpoint."
        intro="The work between pickup and delivery is where reputations are built. We treat the boring details as the most important thing we do."
        items={operationsGrid}
      />

      {/* Split band — animals & special cargo */}
      <SplitBand
        image={horseAir.url}
        alt="Horse being prepared for air transport"
        eyebrow="Specialist cargo"
        title="When the cargo has a heartbeat, the details matter more."
        body="Livestock, pets, racehorses, breeding stock — our welfare-certified teams plan every journey around the animal first. Climate-controlled stalls, vet sign-off at every checkpoint, and a handler with the cargo from collection to final delivery."
      />

      {/* Care grid */}
      <GallerySection
        eyebrow="People & promises"
        title="The same care, whether it's a pallet or a pony."
        intro="Equipment matters, but people deliver. Every Swift Cargo Apex driver, handler and planner is trained, vetted and accountable for the cargo they touch."
        items={careGrid}
      />

      {/* Features */}
      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: MapPin, title: "Live map view", text: "See your shipment's location update on an interactive OpenStreetMap." },
            { icon: Clock, title: "Accurate ETAs", text: "Estimated wait time refreshes automatically as the shipment moves." },
            { icon: ShieldCheck, title: "Insured cargo", text: "Every shipment fully insured and monitored 24/7 by our operations team." },
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

      {/* Final image strip */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
              On the road today
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
              A working fleet, not a brochure.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Snapshots from this week's lanes — air, road, ocean and last mile, all under one roof.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[airLoading.url, convoy.url, freightTrain.url, portCrane.url].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Swift Cargo Apex operations ${i + 1}`}
                loading="lazy"
                width={1024}
                height={1024}
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services band */}
      <section className="border-y border-border bg-background">
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

      <footer className="container mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Swift Cargo Apex. Powered by OpenStreetMap.
      </footer>
    </div>
  );
}

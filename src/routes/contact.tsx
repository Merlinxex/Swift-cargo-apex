import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Clock, Mail, MapPin, Send } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const BASE = "https://ytsvvygxulgnttebhoqr.supabase.co/storage/v1/object/public/images";

const IMG = {
  heroBanner:  `${BASE}/beaconshippinglogistics-seotool-76213-reasonstoconsider-blogbanner1-768x461.jpeg`,
  formSide:    `${BASE}/Depositphotos_69011833_original_guy_with_tablet_1200x800_2_300x200.jpeg`,
  hamburg:     `${BASE}/shutterstock_1465221002.jpg.jpeg`,
  rotterdam:   `${BASE}/v2-pmrj1-1mp6q-r10h3bfdipnhdbfpvaueyafabdhxwpfby3yrv1i7hs-1024x512.jpeg`,
  madrid:      `${BASE}/maersk-airfreight_1024x576.webp`,
  strip1:      `${BASE}/shell_truck_charge_web-1024x683-1.jpeg`,
  strip2:      `${BASE}/s-road-transport-1.jpg.jpeg`,
  strip3:      `${BASE}/82465d143598b9466fc3c7dfbdf32868-1-300x175-1.jpg.jpeg`,
  strip4:      `${BASE}/beaconshippinglogistics_seotool_76213_reasonstoconsider_blogbanner1.jpeg`,
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Swift Cargo" },
      {
        name: "description",
        content:
          "Get in touch with Swift Cargo. Email and office addresses for sales, support and 24/7 operations.",
      },
      { property: "og:title", content: "Contact Swift Cargo" },
      {
        property: "og:description",
        content: "Reach our sales, support and operations teams across Europe.",
      },
    ],
  }),
  component: ContactPage,
});

const OFFICES = [
  {
    city: "Hamburg (HQ)",
    address: "Hafencity Allee 12, 20457 Hamburg, Germany",
    email: "swiftcargoapex@gmail.com",
    image: IMG.hamburg,
  },
  {
    city: "Rotterdam",
    address: "Wilhelminakade 88, 3072 AR Rotterdam, Netherlands",
    email: "swiftcargoapex@gmail.com",
    image: IMG.rotterdam,
  },
  {
    city: "Madrid",
    address: "Calle Serrano 41, 28001 Madrid, Spain",
    email: "swiftcargoapex@gmail.com",
    image: IMG.madrid,
  },
];

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    (e.target as HTMLFormElement).reset();
    toast.success("Message sent — we'll be in touch within one business day.");
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero with background image */}
      <section
        className="relative overflow-hidden text-hero-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <img
          src={IMG.heroBanner}
          alt="Swift Cargo logistics operations"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
          loading="eager"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(120deg, rgba(0,0,0,0.6), rgba(0,0,0,0.2) 60%, transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <div className="container relative mx-auto max-w-6xl px-4 py-20 md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            Contact
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Let's move your freight{" "}
            <span style={{ color: "var(--accent)" }}>together.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-hero-foreground/80 md:text-lg">
            Sales, support, claims or a quick quote — pick the channel that suits you. Our team
            replies within one business day, around the clock for active shipments.
          </p>
        </div>
      </section>

      {/* Quick contact tiles */}
      <section className="container mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Mail,
              title: "Email",
              line1: "swiftcargoapex@gmail.com",
              line2: "support@swiftcargo.com",
            },
            {
              icon: Clock,
              title: "24/7 Operations",
              line1: "swiftcargoapex@gmail.com",
              line2: "For active shipments only",
            },
          ].map(({ icon: Icon, title, line1, line2 }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <div
                className="mb-4 grid h-11 w-11 place-items-center rounded-lg"
                style={{ background: "var(--gradient-accent)" }}
              >
                <Icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <div className="mt-2 text-sm font-medium">{line1}</div>
              <div className="text-xs text-muted-foreground">{line2}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + offices */}
      <section className="container mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">

          {/* Left: image above form */}
          <div className="flex flex-col gap-6">
            <figure className="overflow-hidden rounded-2xl border border-border" style={{ boxShadow: "var(--shadow-elegant)" }}>
              <img
                src={IMG.formSide}
                alt="Swift Cargo customer support team"
                className="aspect-[16/7] w-full object-cover"
                loading="lazy"
              />
            </figure>

            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-border bg-card p-6 md:p-8"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <h2 className="text-2xl font-extrabold tracking-tight">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tell us about your shipment or request and we'll route you to the right team.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" required className="mt-1.5" placeholder="Jane Doe" />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" className="mt-1.5" placeholder="Acme GmbH" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1.5"
                    placeholder="jane@acme.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" className="mt-1.5" placeholder="+49 ..." />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="message">How can we help?</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="mt-1.5"
                  placeholder="Describe your shipment, lane or question..."
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="mt-6 h-11 gap-2 font-semibold text-accent-foreground"
                style={{ background: "var(--gradient-accent)" }}
              >
                {submitting ? "Sending..." : "Send message"} <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Right: HQ card + office cards with images */}
          <div className="space-y-4">
            <div
              className="rounded-2xl p-6 text-hero-foreground"
              style={{ background: "var(--gradient-hero)" }}
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
                <Building2 className="h-3.5 w-3.5" /> Headquarters
              </div>
              <div className="mt-2 text-2xl font-extrabold">Hamburg, Germany</div>
              <p className="mt-2 text-sm opacity-80">
                Our global operations centre — where every shipment is monitored 24/7.
              </p>
            </div>

            {OFFICES.map((o) => (
              <div key={o.city} className="overflow-hidden rounded-2xl border border-border bg-card" style={{ boxShadow: "var(--shadow-elegant)" }}>
                <img
                  src={o.image}
                  alt={o.city}
                  loading="lazy"
                  className="aspect-[16/6] w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                      style={{ background: "var(--secondary)" }}
                    >
                      <MapPin className="h-4 w-4" style={{ color: "var(--accent)" }} />
                    </div>
                    <div>
                      <div className="font-bold">{o.city}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{o.address}</div>
                      <a
                        href={`mailto:${o.email}`}
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                        style={{ color: "var(--primary)" }}
                      >
                        <Mail className="h-3.5 w-3.5" /> {o.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image strip */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[IMG.strip1, IMG.strip2, IMG.strip3, IMG.strip4].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Swift Cargo operations ${i + 1}`}
                loading="lazy"
                className="aspect-square w-full rounded-xl object-cover"
              />
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

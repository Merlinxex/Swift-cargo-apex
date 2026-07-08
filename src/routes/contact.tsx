import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Swift Cargo Apex" },
      {
        name: "description",
        content:
          "Get in touch with Swift Cargo Apex via email for all your shipping and logistics enquiries.",
      },
      { property: "og:title", content: "Contact Swift Cargo Apex" },
      {
        property: "og:description",
        content: "Reach our team by email for sales, support and logistics enquiries.",
      },
    ],
  }),
  component: ContactPage,
});

const CONTACT_EMAIL = "swiftcargodeliveryservice4@gmail.com";

const GALLERY_IMAGES = [
  {
    url: "https://ytsvvygxulgnttebhoqr.supabase.co/storage/v1/object/public/images/photo_2026-07-08_00-34-02.jpg",
    alt: "Container ship at port",
  },
  {
    url: "https://ytsvvygxulgnttebhoqr.supabase.co/storage/v1/object/public/images/photo_2026-07-08_00-33-41.jpg",
    alt: "Port crane operations",
  },
  {
    url: "https://ytsvvygxulgnttebhoqr.supabase.co/storage/v1/object/public/images/photo_2026-07-08_00-33-47.jpg",
    alt: "Courier delivery service",
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

      {/* Hero */}
      <section
        className="relative overflow-hidden text-hero-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
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
            Have a question about a shipment, need a quote, or want to get started? Drop us an
            email and our team will get back to you within one business day.
          </p>

          {/* Email CTA in hero */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            style={{ background: "var(--gradient-accent)" }}
          >
            <Mail className="h-4 w-4" />
            {CONTACT_EMAIL}
          </a>
        </div>
      </section>

      {/* Image strip */}
      <section className="container mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {GALLERY_IMAGES.map((img) => (
            <div
              key={img.url}
              className="aspect-video overflow-hidden rounded-2xl border border-border"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Email card + Form */}
      <section className="container mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">

          {/* Email info card */}
          <div className="flex flex-col gap-6">
            <div
              className="rounded-2xl p-8 text-hero-foreground"
              style={{ background: "var(--gradient-hero)" }}
            >
              <div
                className="mb-5 grid h-12 w-12 place-items-center rounded-xl"
                style={{ background: "var(--gradient-accent)" }}
              >
                <Mail className="h-6 w-6 text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-extrabold">Get in touch</h2>
              <p className="mt-3 text-sm opacity-80 leading-relaxed">
                Whether it's a new shipment enquiry, tracking support, customs clearance, or a
                general question — we're here to help. Email us and we'll route your message to
                the right team.
              </p>
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-widest opacity-60 mb-1">Email us at</div>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm font-semibold break-all hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <p className="mt-4 text-xs opacity-50">
                We aim to respond within one business day.
              </p>
            </div>

            {/* What to include tip */}
            <div
              className="rounded-2xl border border-border bg-card p-6"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                What to include in your email
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Origin and destination of shipment",
                  "Type and weight of cargo",
                  "Preferred shipping timeline",
                  "Any special handling requirements",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-border bg-card p-6 md:p-8"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            <h2 className="text-2xl font-extrabold tracking-tight">Send us a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the form below and we'll reply to your email address.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required className="mt-1.5" placeholder="Jane Doe" />
              </div>
              <div>
                <Label htmlFor="company">Company <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input id="company" name="company" className="mt-1.5" placeholder="Acme Ltd" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">Your email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1.5"
                  placeholder="jane@acme.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="message">How can we help?</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={6}
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

            <p className="mt-4 text-xs text-muted-foreground">
              We'll reply to your email at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium hover:underline"
                style={{ color: "var(--accent)" }}
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </form>
        </div>
      </section>

      <footer className="container mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Swift Cargo Apex. All rights reserved.
      </footer>
    </div>
  );
}

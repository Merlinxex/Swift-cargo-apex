import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Edit3, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { listShipments, type Shipment } from "@/lib/shipments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Swift Cargo" },
      { name: "description", content: "Manage shipments in the Swift Cargo admin dashboard." },
    ],
  }),
  component: AdminPage,
});

type FormState = {
  id?: string;
  tracking_number: string;
  status: string;
  origin_city: string;
  origin_lat: string;
  origin_lng: string;
  destination_city: string;
  destination_lat: string;
  destination_lng: string;
  progress: string;
  eta_minutes: string;
  carrier: string;
  weight: string;
  service: string;
  // Breeder (Sender)
  breeder_name: string;
  breeder_address: string;
  package_description: string;
  // Receiver (Client)
  receiver_name: string;
  receiver_address: string;
  receiver_phone: string;
  receiver_email: string;
  // Payment
  total_price: string;
  amount_paid: string;
  amount_remaining: string;
};

const blankForm: FormState = {
  tracking_number: "",
  status: "In Transit",
  origin_city: "",
  origin_lat: "",
  origin_lng: "",
  destination_city: "",
  destination_lat: "",
  destination_lng: "",
  progress: "0",
  eta_minutes: "0",
  carrier: "Swift Cargo Apex",
  weight: "",
  service: "",
  breeder_name: "",
  breeder_address: "",
  package_description: "",
  receiver_name: "",
  receiver_address: "",
  receiver_phone: "",
  receiver_email: "",
  total_price: "",
  amount_paid: "",
  amount_remaining: "",
};

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(blankForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
    }
  }, [user, loading, navigate]);

  async function refresh() {
    setRefreshing(true);
    const list = await listShipments();
    setShipments(list);
    setRefreshing(false);
  }

  useEffect(() => {
    if (isAdmin) void refresh();
  }, [isAdmin]);

  function openNew() {
    setForm({ ...blankForm, tracking_number: `SC-${Math.floor(100000 + Math.random() * 900000)}` });
    setOpen(true);
  }

  function openEdit(s: Shipment) {
    setForm({
      id: s.id,
      tracking_number: s.trackingNumber,
      status: s.status,
      origin_city: s.origin.name,
      origin_lat: String(s.origin.lat),
      origin_lng: String(s.origin.lng),
      destination_city: s.destination.name,
      destination_lat: String(s.destination.lat),
      destination_lng: String(s.destination.lng),
      progress: String(Math.round(s.progress * 100)),
      eta_minutes: String(s.etaMinutes),
      carrier: s.carrier,
      weight: s.weight ?? "",
      service: s.service ?? "",
      breeder_name: s.breeder_name ?? "",
      breeder_address: s.breeder_address ?? "",
      package_description: s.package_description ?? "",
      receiver_name: s.receiver_name ?? "",
      receiver_address: s.receiver_address ?? "",
      receiver_phone: s.receiver_phone ?? "",
      receiver_email: s.receiver_email ?? "",
      total_price: s.total_price != null ? String(s.total_price) : "",
      amount_paid: s.amount_paid != null ? String(s.amount_paid) : "",
      amount_remaining: s.amount_remaining != null ? String(s.amount_remaining) : "",
    });
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    const payload = {
      tracking_number: form.tracking_number.trim(),
      status: form.status.trim(),
      origin_city: form.origin_city.trim(),
      origin_lat: parseFloat(form.origin_lat),
      origin_lng: parseFloat(form.origin_lng),
      destination_city: form.destination_city.trim(),
      destination_lat: parseFloat(form.destination_lat),
      destination_lng: parseFloat(form.destination_lng),
      progress: Math.max(0, Math.min(100, parseInt(form.progress || "0", 10))),
      eta_minutes: Math.max(0, parseInt(form.eta_minutes || "0", 10)),
      carrier: form.carrier.trim() || "Swift Cargo Apex",
      weight: form.weight.trim() || null,
      service: form.service.trim() || null,
      breeder_name: form.breeder_name.trim() || null,
      breeder_address: form.breeder_address.trim() || null,
      package_description: form.package_description.trim() || null,
      receiver_name: form.receiver_name.trim() || null,
      receiver_address: form.receiver_address.trim() || null,
      receiver_phone: form.receiver_phone.trim() || null,
      receiver_email: form.receiver_email.trim() || null,
      total_price: form.total_price ? parseFloat(form.total_price) : null,
      amount_paid: form.amount_paid ? parseFloat(form.amount_paid) : null,
      amount_remaining: form.amount_remaining ? parseFloat(form.amount_remaining) : null,
    };

    try {
      if (form.id) {
        const { error } = await supabase.from("shipments").update(payload).eq("id", form.id);
        if (error) throw error;
        toast.success("Shipment updated");
      } else {
        const { error } = await supabase.from("shipments").insert(payload);
        if (error) throw error;
        toast.success("Shipment created");
      }
      setOpen(false);
      void refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this shipment? This cannot be undone.")) return;
    const { error } = await supabase.from("shipments").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Shipment deleted");
    void refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto max-w-6xl px-4 py-12 text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container mx-auto max-w-md px-4 py-16 text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-2xl font-extrabold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account doesn't have admin privileges. Contact an administrator.
          </p>
          <Link to="/" className="mt-6 inline-block text-sm text-foreground underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold">Shipments dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {shipments.length} shipment{shipments.length === 1 ? "" : "s"} on file
            </p>
          </div>
          <Button
            onClick={openNew}
            className="gap-2 font-semibold text-accent-foreground"
            style={{ background: "var(--gradient-accent)" }}
          >
            <Plus className="h-4 w-4" /> New shipment
          </Button>
        </div>

        <div
          className="mt-6 overflow-hidden rounded-2xl border border-border bg-card"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Tracking #</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Receiver</th>
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3">Paid / Remaining</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {refreshing && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                      Loading…
                    </td>
                  </tr>
                )}
                {!refreshing && shipments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                      No shipments yet. Click "New shipment" to add one.
                    </td>
                  </tr>
                )}
                {shipments.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono">{s.trackingNumber}</td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: "var(--gradient-accent)",
                          color: "var(--accent-foreground)",
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.origin.name} → {s.destination.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <div>{s.receiver_name ?? "—"}</div>
                      {s.receiver_phone && (
                        <div className="text-xs text-muted-foreground">{s.receiver_phone}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.package_description ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.amount_paid != null ? `$${s.amount_paid}` : "—"} / {s.amount_remaining != null ? `$${s.amount_remaining}` : "—"}
                    </td>
                    <td className="px-4 py-3">{Math.round(s.progress * 100)}%</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(s)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => void remove(s.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit shipment" : "New shipment"}</DialogTitle>
          </DialogHeader>

          {/* Shipment Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Tracking number" value={form.tracking_number}
              onChange={(v) => setForm({ ...form, tracking_number: v })} />
            <Field label="Status" value={form.status}
              onChange={(v) => setForm({ ...form, status: v })} />

            <Field label="Origin city" value={form.origin_city}
              onChange={(v) => setForm({ ...form, origin_city: v })} />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Origin lat" value={form.origin_lat}
                onChange={(v) => setForm({ ...form, origin_lat: v })} />
              <Field label="Origin lng" value={form.origin_lng}
                onChange={(v) => setForm({ ...form, origin_lng: v })} />
            </div>

            <Field label="Destination city" value={form.destination_city}
              onChange={(v) => setForm({ ...form, destination_city: v })} />
            <div className="grid grid-cols-2 gap-2">
              <Field label="Dest lat" value={form.destination_lat}
                onChange={(v) => setForm({ ...form, destination_lat: v })} />
              <Field label="Dest lng" value={form.destination_lng}
                onChange={(v) => setForm({ ...form, destination_lng: v })} />
            </div>

            <Field label="Progress (%)" value={form.progress}
              onChange={(v) => setForm({ ...form, progress: v })} />
            <Field label="ETA minutes" value={form.eta_minutes}
              onChange={(v) => setForm({ ...form, eta_minutes: v })} />

            <Field label="Carrier" value={form.carrier}
              onChange={(v) => setForm({ ...form, carrier: v })} />
            <Field label="Service" value={form.service}
              onChange={(v) => setForm({ ...form, service: v })} />
            <Field label="Weight" value={form.weight}
              onChange={(v) => setForm({ ...form, weight: v })} />
            <Field label="Package description" value={form.package_description}
              onChange={(v) => setForm({ ...form, package_description: v })} />
          </div>

          {/* Breeder Details */}
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Breeder Info
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Breeder name" value={form.breeder_name}
                onChange={(v) => setForm({ ...form, breeder_name: v })} />
              <Field label="Breeder location / address" value={form.breeder_address}
                onChange={(v) => setForm({ ...form, breeder_address: v })} />
            </div>
          </div>

          {/* Client / Receiver Details */}
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Client Info
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Receiver name" value={form.receiver_name}
                onChange={(v) => setForm({ ...form, receiver_name: v })} />
              <Field label="Receiver phone" value={form.receiver_phone}
                onChange={(v) => setForm({ ...form, receiver_phone: v })} />
              <Field label="Receiver email" value={form.receiver_email}
                onChange={(v) => setForm({ ...form, receiver_email: v })} />
              <Field label="Receiver address" value={form.receiver_address}
                onChange={(v) => setForm({ ...form, receiver_address: v })} />
            </div>
          </div>

          {/* Payment Details */}
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Payment
            </p>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Total price ($)" value={form.total_price}
                onChange={(v) => setForm({ ...form, total_price: v })} />
              <Field label="Amount paid ($)" value={form.amount_paid}
                onChange={(v) => setForm({ ...form, amount_paid: v })} />
              <Field label="Amount remaining ($)" value={form.amount_remaining}
                onChange={(v) => setForm({ ...form, amount_remaining: v })} />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => void save()}
              disabled={saving}
              className="font-semibold text-accent-foreground"
              style={{ background: "var(--gradient-accent)" }}
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

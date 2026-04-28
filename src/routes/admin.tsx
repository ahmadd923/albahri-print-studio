import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProductForm, EMPTY_PRODUCT, type EditProduct } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Al Bahri" }] }),
  component: AdminPage,
});

type Product = EditProduct & { id: string; updated_at?: string };
type OrderRow = {
  id: string; created_at: string; status: string; total_estimated: number;
  customer_name: string; customer_phone: string; notes: string | null; user_id: string;
};
type OrderItem = {
  id: string; order_id: string; product_name: string; quantity: number;
  unit_price: number; size: string | null; color: string | null;
  printing_details: string | null; design_url: string | null;
};

const STATUSES = [
  { v: "new", label: "New" },
  { v: "in_progress", label: "In Progress" },
  { v: "ready", label: "Ready" },
  { v: "delivered", label: "Delivered" },
  { v: "cancelled", label: "Cancelled" },
] as const;

function AdminPage() {
  const { isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [editing, setEditing] = useState<EditProduct | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    if (!isAdmin) { navigate({ to: "/" }); }
  }, [loading, user, isAdmin, navigate]);

  const loadProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data ?? []) as Product[]);
  };
  const loadOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("id, created_at, status, total_estimated, customer_name, customer_phone, notes, user_id")
      .order("created_at", { ascending: false });
    setOrders((data ?? []) as OrderRow[]);
    const ids = (data ?? []).map((o) => o.id);
    if (ids.length) {
      const { data: it } = await supabase.from("order_items").select("*").in("order_id", ids);
      setOrderItems((it ?? []) as OrderItem[]);
    }
  };

  useEffect(() => {
    if (isAdmin) { loadProducts(); loadOrders(); }
  }, [isAdmin]);

  const removeProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    loadProducts();
  };

  type Status = "new" | "in_progress" | "ready" | "delivered" | "cancelled";
  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as Status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    loadOrders();
  };

  if (loading || !user) return <div className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">Loading…</div>;
  if (!isAdmin) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-display text-3xl font-bold text-primary">Admin Dashboard</h1>
        <span className="text-xs text-muted-foreground rounded-full border border-muted-foreground/30 bg-muted/10 px-3 py-1">
          Version: product-fix-001
        </span>
      </div>
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          {orders.length === 0 ? (
            <p className="text-muted-foreground">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((o) => {
                const its = orderItems.filter((i) => i.order_id === o.id);
                return (
                  <li key={o.id} className="rounded-xl border bg-card p-5 shadow-soft">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
                          <Badge>{o.status}</Badge>
                          <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-sm mt-1"><span className="font-medium">{o.customer_name}</span> · {o.customer_phone}</p>
                        {o.notes && <p className="text-xs text-muted-foreground mt-1">Notes: {o.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                          className="h-9 rounded-md border bg-transparent px-2 text-sm"
                        >
                          {STATUSES.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
                        </select>
                        <span className="font-display text-lg font-bold text-gold">{Number(o.total_estimated).toFixed(2)} ILS</span>
                      </div>
                    </div>
                    <ul className="mt-3 text-sm space-y-1">
                      {its.map((it) => (
                        <li key={it.id} className="text-muted-foreground">
                          {it.quantity}× <span className="text-foreground">{it.product_name}</span>
                          {it.size ? ` · ${it.size}` : ""}{it.color ? ` · ${it.color}` : ""}
                          {it.printing_details ? ` · ${it.printing_details}` : ""}
                          {it.design_url && <> · <a className="text-gold hover:underline" href={it.design_url} target="_blank" rel="noreferrer">design</a></>}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="products" className="mt-6 space-y-6">
          {editing ? (
            <ProductForm
              product={editing}
              onSaved={() => { setEditing(null); loadProducts(); }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <Button variant="hero" onClick={() => setEditing(EMPTY_PRODUCT)}><Plus className="h-4 w-4" /> Add product</Button>
          )}
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <li key={p.id} className="rounded-xl border bg-card overflow-hidden shadow-soft">
                <div className="aspect-video bg-secondary/40 overflow-hidden">
                  {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-primary">{p.name}</h3>
                    <span className="font-display font-bold text-gold whitespace-nowrap">{Number(p.price).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Stock: {p.stock} · {p.is_active ? "Active" : "Hidden"}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditing(p)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => removeProduct(p.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </section>
  );
}
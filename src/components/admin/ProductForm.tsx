import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

type Cat = { id: string; name: string };
export type EditProduct = {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string | null;
  image_url: string | null;
  sizes: string[];
  colors: string[];
  printing_options: string[];
  is_active: boolean;
};

export const EMPTY_PRODUCT: EditProduct = {
  name: "", description: "", price: 0, stock: 0, category_id: null, image_url: null,
  sizes: [], colors: [], printing_options: [], is_active: true,
};

export function ProductForm({ product, onSaved, onCancel }: { product: EditProduct; onSaved: () => void; onCancel: () => void }) {
  const [p, setP] = useState<EditProduct>(product);
  const [cats, setCats] = useState<Cat[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setP(product); }, [product]);
  useEffect(() => {
    supabase.from("product_categories").select("id, name").order("sort_order").then(({ data }) => setCats(data ?? []));
  }, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error("Max 10MB");
    setBusy(true);
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { setBusy(false); return toast.error(error.message); }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setP((prev) => ({ ...prev, image_url: data.publicUrl }));
    setBusy(false);
  };

  const save = async () => {
    if (!p.name.trim()) return toast.error("Name required");
    setBusy(true);
    const payload = { ...p, price: Number(p.price), stock: Number(p.stock) };
    const { error } = p.id
      ? await supabase.from("products").update(payload).eq("id", p.id)
      : await supabase.from("products").insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onSaved();
  };

  const csv = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-primary">{p.id ? "Edit product" : "Add product"}</h3>
        <Button variant="ghost" size="icon" onClick={onCancel}><X className="h-4 w-4" /></Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label>Name</Label><Input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /></div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <select className="flex h-9 w-full rounded-md border bg-transparent px-3 text-sm" value={p.category_id ?? ""} onChange={(e) => setP({ ...p, category_id: e.target.value || null })}>
            <option value="">— none —</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5"><Label>Price (ILS)</Label><Input type="number" step="0.01" value={p.price} onChange={(e) => setP({ ...p, price: Number(e.target.value) })} /></div>
        <div className="space-y-1.5"><Label>Stock</Label><Input type="number" value={p.stock} onChange={(e) => setP({ ...p, stock: Number(e.target.value) })} /></div>
      </div>
      <div className="space-y-1.5"><Label>Description</Label><Textarea rows={3} value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} /></div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-1.5"><Label>Sizes (comma separated)</Label><Input value={p.sizes.join(", ")} onChange={(e) => setP({ ...p, sizes: csv(e.target.value) })} placeholder="S, M, L" /></div>
        <div className="space-y-1.5"><Label>Colors</Label><Input value={p.colors.join(", ")} onChange={(e) => setP({ ...p, colors: csv(e.target.value) })} placeholder="White, Black" /></div>
        <div className="space-y-1.5"><Label>Printing options</Label><Input value={p.printing_options.join(", ")} onChange={(e) => setP({ ...p, printing_options: csv(e.target.value) })} placeholder="Front, Back" /></div>
      </div>
      <div className="space-y-1.5">
        <Label>Image</Label>
        <div className="flex items-center gap-3">
          {p.image_url && <img src={p.image_url} alt="" className="h-16 w-16 rounded-md object-cover border" />}
          <label className="flex items-center gap-2 rounded-md border border-dashed bg-secondary/40 px-3 py-2 cursor-pointer hover:border-gold">
            <Upload className="h-4 w-4 text-gold" />
            <span className="text-sm">{busy ? "Uploading…" : "Upload image"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={upload} />
          </label>
          {p.image_url && <Button variant="ghost" size="sm" onClick={() => setP({ ...p, image_url: null })}>Remove</Button>}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={p.is_active} onChange={(e) => setP({ ...p, is_active: e.target.checked })} />
        Active (visible in shop)
      </label>
      <div className="flex gap-2 pt-2">
        <Button variant="hero" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
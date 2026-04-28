import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { Upload, ShoppingCart, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/product/$id")({
  head: () => ({ meta: [{ title: "Product — Al Bahri" }] }),
  component: ProductPage,
});

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  sizes: string[];
  colors: string[];
  printing_options: string[];
};

function ProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [printOpt, setPrintOpt] = useState("");
  const [details, setDetails] = useState("");
  const [designUrl, setDesignUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, price, stock, image_url, sizes, colors, printing_options")
        .eq("id", id)
        .maybeSingle();
      if (error) toast.error(error.message);
      setP(data ?? null);
      if (data) {
        setSize(data.sizes?.[0] ?? "");
        setColor(data.colors?.[0] ?? "");
        setPrintOpt(data.printing_options?.[0] ?? "");
      }
      setLoading(false);
    })();
  }, [id]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error("Max file size is 10 MB");
    setUploading(true);
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from("designs").upload(path, file, { upsert: false });
    if (error) {
      setUploading(false);
      return toast.error(error.message);
    }
    const { data } = supabase.storage.from("designs").getPublicUrl(path);
    setDesignUrl(data.publicUrl);
    setUploading(false);
    toast.success("Design uploaded");
  };

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-16 text-muted-foreground">Loading…</div>;
  if (!p) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">Product not found.</p>
        <Button asChild variant="outline"><Link to="/shop">Back to shop</Link></Button>
      </div>
    );
  }

  const addToCart = () => {
    if (qty < 1) return toast.error("Quantity must be at least 1");
    add({
      product_id: p.id,
      product_name: p.name,
      unit_price: Number(p.price),
      quantity: qty,
      size: size || undefined,
      color: color || undefined,
      printing_details: [printOpt, details].filter(Boolean).join(" — ") || undefined,
      design_url: designUrl || undefined,
      image_url: p.image_url ?? undefined,
    });
    toast.success("Added to cart");
    navigate({ to: "/cart" });
  };

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link to="/shop"><ArrowLeft className="h-4 w-4" /> Back to shop</Link>
      </Button>
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="aspect-square bg-secondary/40 rounded-2xl overflow-hidden border">
          {p.image_url ? (
            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
          )}
        </div>
        <div className="space-y-5">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">{p.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-display text-2xl font-bold text-gold">{Number(p.price).toFixed(2)} ILS</span>
              {p.stock > 0 ? (
                <Badge variant="secondary">In stock: {p.stock}</Badge>
              ) : (
                <Badge variant="destructive">Out of stock</Badge>
              )}
            </div>
          </div>
          {p.description && <p className="text-muted-foreground leading-relaxed">{p.description}</p>}

          {p.sizes.length > 0 && (
            <div>
              <Label className="mb-2 block">Size</Label>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <Button key={s} type="button" variant={size === s ? "hero" : "outline"} size="sm" onClick={() => setSize(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {p.colors.length > 0 && (
            <div>
              <Label className="mb-2 block">Color</Label>
              <div className="flex flex-wrap gap-2">
                {p.colors.map((c) => (
                  <Button key={c} type="button" variant={color === c ? "hero" : "outline"} size="sm" onClick={() => setColor(c)}>
                    {c}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {p.printing_options.length > 0 && (
            <div>
              <Label className="mb-2 block">Printing option</Label>
              <div className="flex flex-wrap gap-2">
                {p.printing_options.map((o) => (
                  <Button key={o} type="button" variant={printOpt === o ? "hero" : "outline"} size="sm" onClick={() => setPrintOpt(o)}>
                    {o}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="qty">Quantity</Label>
              <Input id="qty" type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
            </div>
            <div className="space-y-1.5">
              <Label>Upload design (optional)</Label>
              <label className="flex items-center gap-2 rounded-md border border-dashed bg-secondary/40 px-3 py-2 cursor-pointer hover:border-gold transition">
                <Upload className="h-4 w-4 text-gold" />
                <span className="text-sm text-muted-foreground truncate">
                  {uploading ? "Uploading…" : designUrl ? "Design uploaded ✓" : "Choose file"}
                </span>
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={onUpload} />
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="details">Printing details / notes</Label>
            <Textarea id="details" rows={3} maxLength={500} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g. Logo on chest, white text, design attached" />
          </div>

          <Button variant="hero" size="lg" className="w-full" onClick={addToCart} disabled={p.stock <= 0}>
            <ShoppingCart className="h-5 w-5" /> Add to cart
          </Button>
        </div>
      </div>
    </section>
  );
}
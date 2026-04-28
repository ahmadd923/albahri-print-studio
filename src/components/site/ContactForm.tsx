import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageCircle, Upload } from "lucide-react";
import { BUSINESS, openWhatsApp, waLink } from "./constants";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  phone: z.string().trim().min(6, "Phone is required").max(30),
  product: z.string().trim().min(2, "Product type is required").max(80),
  quantity: z.string().trim().min(1, "Quantity is required").max(20),
  message: z.string().trim().max(1000).optional().default(""),
});

export function ContactForm() {
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      product: String(fd.get("product") || ""),
      quantity: String(fd.get("quantity") || ""),
      message: String(fd.get("message") || ""),
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const msg =
`New order request — Al Bahri
Name: ${parsed.data.name}
Phone: ${parsed.data.phone}
Product: ${parsed.data.product}
Quantity: ${parsed.data.quantity}
${fileName ? `Design file: ${fileName}\n` : ""}${parsed.data.message ? `Message: ${parsed.data.message}` : ""}`;
    openWhatsApp(msg);
    toast.success("Opening WhatsApp to send your order…");
    setSubmitting(false);
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required maxLength={80} placeholder="Your full name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" required maxLength={30} placeholder={BUSINESS.phoneDisplay} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="product">Product Type</Label>
          <Input id="product" name="product" required maxLength={80} placeholder="T-shirts, mugs, bags…" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" required maxLength={20} placeholder="e.g. 25" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="design">Upload Design / Logo (optional)</Label>
        <label className="flex items-center gap-3 rounded-md border border-dashed border-border bg-secondary/40 px-4 py-3 cursor-pointer hover:border-gold transition">
          <Upload className="h-4 w-4 text-gold" />
          <span className="text-sm text-muted-foreground truncate">
            {fileName || "Choose an image or PDF…"}
          </span>
          <input
            id="design"
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
        </label>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" maxLength={1000} rows={4} placeholder="Tell us about your design, colors, deadline…" />
      </div>
      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" variant="whatsapp" size="lg" disabled={submitting}>
          <MessageCircle className="h-5 w-5" /> Send via WhatsApp
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={waLink()} onClick={(e) => { e.preventDefault(); openWhatsApp(); }} target="_blank" rel="noreferrer">Chat Directly</a>
        </Button>
      </div>
    </form>
  );
}

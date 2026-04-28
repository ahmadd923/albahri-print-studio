import type { CartItem } from "./cart";
import { waLink } from "@/components/site/constants";

export function buildOrderMessage(opts: {
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  notes?: string;
  total: number;
}) {
  const lines: string[] = [];
  lines.push("Hello Al Bahri, I want to place a new order.");
  lines.push("");
  lines.push(`Customer Name: ${opts.customerName}`);
  lines.push(`Customer Phone: ${opts.customerPhone}`);
  lines.push("");
  lines.push("Order Details:");
  opts.items.forEach((it, idx) => {
    lines.push(`${idx + 1}. Product: ${it.product_name}`);
    lines.push(`   Quantity: ${it.quantity}`);
    if (it.size) lines.push(`   Size: ${it.size}`);
    if (it.color) lines.push(`   Color: ${it.color}`);
    if (it.printing_details) lines.push(`   Printing Details: ${it.printing_details}`);
    if (it.design_url) lines.push(`   Design: ${it.design_url}`);
    lines.push(`   Unit Price: ${it.unit_price.toFixed(2)} ILS`);
    lines.push("");
  });
  if (opts.notes) {
    lines.push(`Notes: ${opts.notes}`);
    lines.push("");
  }
  lines.push(`Total Estimated Price: ${opts.total.toFixed(2)} ILS`);
  return lines.join("\n");
}

export function buildOrderWaLink(message: string) {
  return waLink(message);
}
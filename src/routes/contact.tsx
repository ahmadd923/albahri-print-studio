import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/site/ContactForm";
import { BUSINESS, openWhatsApp, waLink } from "@/components/site/constants";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Order — Al Bahri" },
      { name: "description", content: "Get in touch with Al Bahri to place a custom printing order. WhatsApp, email or contact form." },
      { property: "og:title", content: "Contact & Order — Al Bahri" },
      { property: "og:description", content: "Send us your design and place your custom printing order." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Contact & Order</h1>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            Tell us what you'd like to print — we'll get back to you on WhatsApp.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">Get in touch</span>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold text-primary">Place Your Order</h2>
              <p className="mt-3 text-muted-foreground">
                Reach out anytime — we love hearing your ideas and helping you bring them to life.
              </p>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-gold text-primary"><Phone className="h-5 w-5" /></span><div><div className="text-sm text-muted-foreground">Phone</div><div className="font-medium text-foreground">{BUSINESS.phoneDisplay}</div></div></li>
              <li className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-gold text-primary"><Mail className="h-5 w-5" /></span><div><div className="text-sm text-muted-foreground">Email</div><div className="font-medium text-foreground">{BUSINESS.email}</div></div></li>
              <li className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-gold text-primary"><MapPin className="h-5 w-5" /></span><div><div className="text-sm text-muted-foreground">Location</div><div className="font-medium text-foreground">{BUSINESS.location}</div></div></li>
            </ul>
            <Button asChild variant="whatsapp" size="lg" className="w-full">
              <a href={waLink()} onClick={(e) => { e.preventDefault(); openWhatsApp(); }} target="_blank" rel="noreferrer">
                <MessageCircle className="h-5 w-5" /> Order on WhatsApp
              </a>
            </Button>
          </div>
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

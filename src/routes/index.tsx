import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { AboutSection } from "@/components/site/AboutSection";
import { Services } from "@/components/site/Services";
import { Gallery } from "@/components/site/Gallery";
import { HowItWorks } from "@/components/site/HowItWorks";
import { WhyUs } from "@/components/site/WhyUs";
import { Button } from "@/components/ui/button";
import { waLink } from "@/components/site/constants";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Al Bahri — Custom Printing Made Easy" },
      { name: "description", content: "Order custom printed shirts, mugs, bags, hoodies, uniforms and gifts. Fast local printing service in Palestine." },
      { property: "og:title", content: "Al Bahri — Custom Printing Made Easy" },
      { property: "og:description", content: "Print your logo, name, or design on shirts, cups, bags, gifts and more." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <AboutSection />
      <Services />
      <Gallery />
      <HowItWorks />
      <WhyUs />
      <section className="py-20 bg-gradient-subtle">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Ready to Print Your Idea?</h2>
          <p className="mt-3 text-muted-foreground">Send us your design on WhatsApp — we'll handle the rest.</p>
          <div className="mt-7 flex justify-center gap-3 flex-wrap">
            <Button asChild variant="whatsapp" size="xl">
              <a href={waLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Order on WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

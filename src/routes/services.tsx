import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/site/Services";
import { HowItWorks } from "@/components/site/HowItWorks";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Printing Services — Al Bahri" },
      { name: "description", content: "T-shirt, mug, bag, hoodie, uniform, gift, logo and team printing — all from Al Bahri." },
      { property: "og:title", content: "Printing Services — Al Bahri" },
      { property: "og:description", content: "Explore our full range of custom printing services." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Our Services</h1>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            From a single t-shirt to a full team uniform — we print it all.
          </p>
        </div>
      </section>
      <Services heading={false} />
      <HowItWorks />
    </>
  );
}

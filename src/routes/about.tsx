import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/site/AboutSection";
import { WhyUs } from "@/components/site/WhyUs";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Al Bahri — Local Custom Printing" },
      { name: "description", content: "Learn about Al Bahri, a trusted local printing shop serving individuals, businesses, schools, teams and events in Palestine." },
      { property: "og:title", content: "About Al Bahri — Local Custom Printing" },
      { property: "og:description", content: "A friendly local printing partner delivering quality custom prints." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">About Al Bahri</h1>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            A local custom printing shop crafting quality prints for the people and businesses of our community.
          </p>
        </div>
      </section>
      <AboutSection />
      <WhyUs />
    </>
  );
}

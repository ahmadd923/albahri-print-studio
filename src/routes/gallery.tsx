import { createFileRoute } from "@tanstack/react-router";
import { Gallery } from "@/components/site/Gallery";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Al Bahri Custom Prints" },
      { name: "description", content: "Browse a gallery of custom printed shirts, mugs, bags, hoodies, gifts and promotional items by Al Bahri." },
      { property: "og:title", content: "Gallery — Al Bahri Custom Prints" },
      { property: "og:description", content: "See examples of our recent custom printing work." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <>
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Our Gallery</h1>
          <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
            A selection of recent custom printing projects.
          </p>
        </div>
      </section>
      <Gallery heading={false} />
    </>
  );
}

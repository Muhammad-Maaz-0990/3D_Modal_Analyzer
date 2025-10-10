import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
  { q: "Can you deliver custom systems for my specific process?", a: "Yes. We design around your process constraints and integrate with existing equipment and software." },
  { q: "What industries do you work in?", a: "We’ve built systems for metalworking, 3D printing, mining and more—focused on high-impact use cases." },
  { q: "Do you support after installation?", a: "We provide ongoing support and iteration to ensure uptime and performance." },
  { q: "How quickly can you execute?", a: "We typically deliver tailored solutions in a fraction of the time of larger integrators." },
  { q: "Where do you operate?", a: "We deploy worldwide and can coordinate on-site installation and commissioning." },
];

export const FAQ = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h3 className="text-3xl font-bold">Common questions</h3>
        <Accordion type="single" collapsible className="mt-6">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{it.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

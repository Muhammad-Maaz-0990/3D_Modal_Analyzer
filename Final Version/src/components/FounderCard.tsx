export const FounderCard = () => {
  return (
    <section className="py-12 section-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-3xl gradient-text font-bold">Driving Automation Forward.</h3>
            <p className="mt-4 text-muted-foreground">
              Our leadership blends deep roots in mechanical design, control theory, and production engineering with hands-on execution.
              We deliver systems that ship—not just slides.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 border border-border/30">
            <div className="flex items-center gap-4">
              <img src="/placeholder.svg" className="w-16 h-16 rounded-xl object-cover" alt="Founder" />
              <div>
                <div className="font-semibold">Ali Ahmad</div>
                <div className="text-xs text-muted-foreground">Founder & CEO</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const AboutIntro = () => {
  return (
    <section id="about-us" className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl">
          <div className="eyebrow mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary" /> About Us
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            We are a <span className="text-primary">robotics-driven</span> engineering team solving real-world manufacturing problems.
          </h2>
          <div className="mt-6 text-muted-foreground">
            <p>
              As designers, control engineers, and integrators, we design and build software-defined automation that reduces cycle time,
              improves quality, and scales output without unnecessary complexity. Our work spans prototyping to full production. We collaborate closely with customers to deliver reliable systems with an
              emphasis on practical execution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

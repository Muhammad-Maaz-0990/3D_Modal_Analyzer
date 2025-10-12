export const Stats = () => {
  const items = [
    { value: "10+", label: "Years of Combined Experience" },
    { value: "×4", label: "Faster Turnaround Time" },
    { value: "25%", label: "Typical Throughput Improvement" },
    { value: "99.9%", label: "Uptime Across Deployed Systems" },
  ];

  return (
    <section className="py-8 section-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <div key={i} className="glass rounded-xl p-6 border border-border/40">
              <div className="text-3xl font-bold text-primary">{it.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

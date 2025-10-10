import { Cpu, Settings, Bot, Boxes, Rocket } from "lucide-react";

const services = [
  { id: "(001)", title: "CNC & Tool Handling Automation", desc: "Flexible automation solutions for CNC machine shops.", icon: Settings, tags: ["CNC Automation", "Machine Tending", "Tool Presetting", "CMM Automation"] },
  { id: "(002)", title: "PLC & Control Systems", desc: "Custom electrical cabinets and control software for industrial automation.", icon: Cpu, tags: ["Electrical Panels", "PLC Programming", "HMI Development", "Integration"] },
  { id: "(003)", title: "Custom Robotic Workcells & Integration", desc: "Complete robotic systems tailored to your process.", icon: Bot, tags: ["Robotic Workcells", "Pick-and-Place", "Motion Control", "Vision"] },
  { id: "(004)", title: "3D Printing & Lights-Out Operations", desc: "Scalable, autonomous print farms built for the future.", icon: Boxes, tags: ["FDM", "SLS", "SLA", "Automated Storage"] },
  { id: "(005)", title: "Engineering for Startups", desc: "Speed-focused support for growing companies.", icon: Rocket, tags: ["Rapid Prototyping", "Technical R&D", "MVP Manufacturing"] },
];

export const Services = () => (
  <section className="py-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold gradient-text">What we do</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="glass rounded-2xl p-6 border border-border/40 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground">{s.id}</span>
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.tags.map((t, i) => (
                  <span key={i} className="text-xs rounded-full border border-border/40 px-2 py-1 text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

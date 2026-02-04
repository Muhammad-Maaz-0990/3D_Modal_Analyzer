import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Layers, Box, Cog } from "lucide-react";

interface Machine {
  name: string;
  category: "FDM" | "SLS" | "SLM" | "CNC";
  icon: typeof Cpu;
}

const machines: Machine[] = [
  // FDM
  { name: "Ultimaker S7", category: "FDM", icon: Layers },
  { name: "Prusa MK4", category: "FDM", icon: Layers },
  { name: "Raise3D Pro3", category: "FDM", icon: Layers },
  { name: "Stratasys F370", category: "FDM", icon: Layers },
  { name: "Markforged Mark Two", category: "FDM", icon: Layers },
  { name: "BigRep ONE", category: "FDM", icon: Layers },
  
  // SLS
  { name: "EOS P 110 Velocis", category: "SLS", icon: Box },
  { name: "EOS P 396", category: "SLS", icon: Box },
  { name: "3D Systems sPro 230", category: "SLS", icon: Box },
  { name: "Formlabs Fuse 1+ 30W", category: "SLS", icon: Box },
  { name: "Sintratec S2", category: "SLS", icon: Box },
  { name: "Farsoon 403P", category: "SLS", icon: Box },
  
  // SLM
  { name: "EOS M 290", category: "SLM", icon: Cpu },
  { name: "EOS M 400-4", category: "SLM", icon: Cpu },
  { name: "SLM Solutions 280 2.0", category: "SLM", icon: Cpu },
  { name: "SLM Solutions 500", category: "SLM", icon: Cpu },
  { name: "Renishaw RenAM 500Q", category: "SLM", icon: Cpu },
  { name: "TRUMPF TruPrint 3000", category: "SLM", icon: Cpu },
  
  // CNC
  { name: "Haas VF-2", category: "CNC", icon: Cog },
  { name: "DMG MORI DMU 50", category: "CNC", icon: Cog },
  { name: "Mazak INTEGREX i-200", category: "CNC", icon: Cog },
  { name: "Hermle C 32 U", category: "CNC", icon: Cog },
  { name: "Brother SPEEDIO S700X1", category: "CNC", icon: Cog },
  { name: "Citizen Cincom L12", category: "CNC", icon: Cog },
];

const categoryColors = {
  FDM: "bg-primary/10 text-primary border-primary/20",
  SLS: "bg-secondary/10 text-secondary border-secondary/20",
  SLM: "bg-accent/10 text-accent border-accent/20",
  CNC: "bg-muted text-muted-foreground border-border",
};

export const MachineGrid = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Our Machine Fleet</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Europe's most comprehensive additive and subtractive manufacturing capabilities
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {machines.map((machine, index) => {
            const Icon = machine.icon;
            return (
              <Card 
                key={index} 
                className="glass glass-hover animate-fade-in border-border/50"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Icon className="w-8 h-8 text-primary" />
                    <Badge variant="outline" className={categoryColors[machine.category]}>
                      {machine.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base leading-tight">{machine.name}</CardTitle>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

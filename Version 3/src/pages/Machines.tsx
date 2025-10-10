import { Navigation } from "@/components/Navigation";
import { MachineGrid } from "@/components/MachineGrid";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Cpu, Layers, Box, Cog } from "lucide-react";

const Machines = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-20 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="gradient-text">Manufacturing Technologies</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From rapid prototyping to production runs, our comprehensive machine fleet covers all your manufacturing needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass border-border/50">
              <CardContent className="pt-6 text-center">
                <Layers className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">FDM/FFF</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Thermoplastic extrusion for rapid prototyping and functional parts
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Build volume up to 1000mm</li>
                  <li>• Engineering thermoplastics</li>
                  <li>• Carbon fiber composites</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass border-border/50">
              <CardContent className="pt-6 text-center">
                <Box className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">SLS</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Selective laser sintering for complex polymer geometries
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• No support structures needed</li>
                  <li>• PA12, PA11, TPU materials</li>
                  <li>• High throughput production</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass border-border/50">
              <CardContent className="pt-6 text-center">
                <Cpu className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">SLM/LPBF</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Metal powder bed fusion for aerospace-grade components
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Stainless steel, titanium, aluminum</li>
                  <li>• Inconel and tool steels</li>
                  <li>• Up to 500mm build volume</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass border-border/50">
              <CardContent className="pt-6 text-center">
                <Cog className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">CNC</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Precision subtractive manufacturing for metals and plastics
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 3-axis and 5-axis milling</li>
                  <li>• Turning and mill-turn centers</li>
                  <li>• Tight tolerance machining</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <MachineGrid />
      <Footer />
    </div>
  );
};

export default Machines;

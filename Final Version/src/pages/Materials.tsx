import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Box, Cpu, Cog } from "lucide-react";

const Materials = () => {
  const materials = [
    {
      name: "PLA",
      category: "FDM",
      properties: ["Biodegradable", "Easy to print", "Low warping"],
      color: "bg-green-100 text-green-800",
      icon: Layers
    },
    {
      name: "ABS",
      category: "FDM", 
      properties: ["Impact resistant", "Heat resistant", "Chemical resistant"],
      color: "bg-blue-100 text-blue-800",
      icon: Layers
    },
    {
      name: "PETG",
      category: "FDM",
      properties: ["Chemical resistant", "Transparent", "Food safe"],
      color: "bg-purple-100 text-purple-800", 
      icon: Layers
    },
    {
      name: "PA12 Nylon",
      category: "SLS",
      properties: ["High strength", "Flexible", "Chemical resistant"],
      color: "bg-orange-100 text-orange-800",
      icon: Box
    },
    {
      name: "Aluminum AlSi10Mg",
      category: "SLM",
      properties: ["Lightweight", "Corrosion resistant", "Good thermal conductivity"],
      color: "bg-gray-100 text-gray-800",
      icon: Cpu
    },
    {
      name: "Titanium Ti-6Al-4V",
      category: "SLM", 
      properties: ["Biocompatible", "High strength-to-weight", "Corrosion resistant"],
      color: "bg-indigo-100 text-indigo-800",
      icon: Cpu
    },
    {
      name: "Stainless Steel 316L",
      category: "SLM",
      properties: ["Corrosion resistant", "High strength", "Food grade"],
      color: "bg-red-100 text-red-800",
      icon: Cpu
    },
    {
      name: "Aluminum 6061",
      category: "CNC",
      properties: ["Machinable", "Lightweight", "Weldable"],
      color: "bg-cyan-100 text-cyan-800",
      icon: Cog
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              <span className="gradient-text">Materials</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Premium materials for every manufacturing process. From prototyping plastics to aerospace-grade metals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {materials.map((material, index) => {
              const IconComponent = material.icon;
              return (
                <Card key={index} className="glass border-border/50 hover:border-primary/50 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className="w-8 h-8 text-primary" />
                      <Badge className={material.color}>
                        {material.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{material.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {material.properties.map((property, propIndex) => (
                        <div key={propIndex} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                          {property}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Materials;
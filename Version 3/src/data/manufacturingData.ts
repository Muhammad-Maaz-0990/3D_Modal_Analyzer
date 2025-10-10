export interface Machine {
  name: string;
  category: "FDM" | "SLS" | "SLM" | "CNC";
  icon: any;
  basePrice: number; // Base price per cm³
  materials: string[];
}

export interface Material {
  name: string;
  category: "FDM" | "SLS" | "SLM" | "CNC";
  priceMultiplier: number; // Multiplier for base price
  color?: string;
}

export const machines: Machine[] = [
  // FDM Machines
  { name: "Ultimaker S7", category: "FDM", icon: "Layers", basePrice: 0.5, materials: ["PLA", "ABS", "PETG", "TPU"] },
  { name: "Prusa MK4", category: "FDM", icon: "Layers", basePrice: 0.4, materials: ["PLA", "ABS", "PETG"] },
  { name: "Raise3D Pro3", category: "FDM", icon: "Layers", basePrice: 0.6, materials: ["PLA", "ABS", "PETG", "Nylon"] },
  { name: "Stratasys F370", category: "FDM", icon: "Layers", basePrice: 1.2, materials: ["ABS", "PC", "ASA"] },
  { name: "Markforged Mark Two", category: "FDM", icon: "Layers", basePrice: 2.5, materials: ["Carbon Fiber", "Fiberglass", "Kevlar"] },
  { name: "BigRep ONE", category: "FDM", icon: "Layers", basePrice: 0.8, materials: ["PLA", "ABS", "PETG"] },
  
  // SLS Machines
  { name: "EOS P 110 Velocis", category: "SLS", icon: "Box", basePrice: 2.0, materials: ["PA12 Nylon", "PA11 Nylon", "TPU"] },
  { name: "EOS P 396", category: "SLS", icon: "Box", basePrice: 2.2, materials: ["PA12 Nylon", "PA11 Nylon", "Glass Filled PA"] },
  { name: "3D Systems sPro 230", category: "SLS", icon: "Box", basePrice: 1.8, materials: ["PA12 Nylon", "PA11 Nylon"] },
  { name: "Formlabs Fuse 1+ 30W", category: "SLS", icon: "Box", basePrice: 1.5, materials: ["PA12 Nylon", "TPU"] },
  { name: "Sintratec S2", category: "SLS", icon: "Box", basePrice: 1.7, materials: ["PA12 Nylon", "PA11 Nylon"] },
  { name: "Farsoon 403P", category: "SLS", icon: "Box", basePrice: 1.9, materials: ["PA12 Nylon", "Glass Filled PA"] },
  
  // SLM Machines
  { name: "EOS M 290", category: "SLM", icon: "Cpu", basePrice: 5.0, materials: ["Stainless Steel 316L", "Aluminum AlSi10Mg", "Titanium Ti-6Al-4V"] },
  { name: "EOS M 400-4", category: "SLM", icon: "Cpu", basePrice: 5.5, materials: ["Stainless Steel 316L", "Inconel 718", "Titanium Ti-6Al-4V"] },
  { name: "SLM Solutions 280 2.0", category: "SLM", icon: "Cpu", basePrice: 4.8, materials: ["Stainless Steel 316L", "Aluminum AlSi10Mg"] },
  { name: "SLM Solutions 500", category: "SLM", icon: "Cpu", basePrice: 6.0, materials: ["Stainless Steel 316L", "Titanium Ti-6Al-4V", "Tool Steel"] },
  { name: "Renishaw RenAM 500Q", category: "SLM", icon: "Cpu", basePrice: 5.8, materials: ["Titanium Ti-6Al-4V", "Inconel 718"] },
  { name: "TRUMPF TruPrint 3000", category: "SLM", icon: "Cpu", basePrice: 6.2, materials: ["Stainless Steel 316L", "Aluminum AlSi10Mg", "Titanium Ti-6Al-4V"] },
  
  // CNC Machines
  { name: "Haas VF-2", category: "CNC", icon: "Cog", basePrice: 3.0, materials: ["Aluminum 6061", "Steel 1018", "Brass"] },
  { name: "DMG MORI DMU 50", category: "CNC", icon: "Cog", basePrice: 4.5, materials: ["Titanium", "Stainless Steel", "Aluminum"] },
  { name: "Mazak INTEGREX i-200", category: "CNC", icon: "Cog", basePrice: 5.0, materials: ["Titanium", "Inconel", "Tool Steel"] },
  { name: "Hermle C 32 U", category: "CNC", icon: "Cog", basePrice: 4.0, materials: ["Aluminum", "Steel", "Titanium"] },
  { name: "Brother SPEEDIO S700X1", category: "CNC", icon: "Cog", basePrice: 3.5, materials: ["Aluminum", "Steel", "Brass"] },
  { name: "Citizen Cincom L12", category: "CNC", icon: "Cog", basePrice: 3.8, materials: ["Stainless Steel", "Brass", "Aluminum"] },
];

export const materials: Material[] = [
  // FDM Materials
  { name: "PLA", category: "FDM", priceMultiplier: 1.0, color: "bg-green-100 text-green-800" },
  { name: "ABS", category: "FDM", priceMultiplier: 1.2, color: "bg-blue-100 text-blue-800" },
  { name: "PETG", category: "FDM", priceMultiplier: 1.4, color: "bg-purple-100 text-purple-800" },
  { name: "TPU", category: "FDM", priceMultiplier: 1.8, color: "bg-orange-100 text-orange-800" },
  { name: "Nylon", category: "FDM", priceMultiplier: 2.0, color: "bg-yellow-100 text-yellow-800" },
  { name: "PC", category: "FDM", priceMultiplier: 2.2, color: "bg-indigo-100 text-indigo-800" },
  { name: "ASA", category: "FDM", priceMultiplier: 1.6, color: "bg-gray-100 text-gray-800" },
  { name: "Carbon Fiber", category: "FDM", priceMultiplier: 3.5, color: "bg-black text-white" },
  { name: "Fiberglass", category: "FDM", priceMultiplier: 3.0, color: "bg-red-100 text-red-800" },
  { name: "Kevlar", category: "FDM", priceMultiplier: 4.0, color: "bg-yellow-100 text-yellow-900" },
  
  // SLS Materials
  { name: "PA12 Nylon", category: "SLS", priceMultiplier: 1.0, color: "bg-gray-100 text-gray-800" },
  { name: "PA11 Nylon", category: "SLS", priceMultiplier: 1.3, color: "bg-gray-200 text-gray-900" },
  { name: "Glass Filled PA", category: "SLS", priceMultiplier: 1.8, color: "bg-blue-100 text-blue-800" },
  
  // SLM Materials
  { name: "Stainless Steel 316L", category: "SLM", priceMultiplier: 1.0, color: "bg-slate-100 text-slate-800" },
  { name: "Aluminum AlSi10Mg", category: "SLM", priceMultiplier: 0.8, color: "bg-zinc-100 text-zinc-800" },
  { name: "Titanium Ti-6Al-4V", category: "SLM", priceMultiplier: 3.0, color: "bg-purple-100 text-purple-800" },
  { name: "Inconel 718", category: "SLM", priceMultiplier: 4.0, color: "bg-red-100 text-red-800" },
  { name: "Tool Steel", category: "SLM", priceMultiplier: 2.0, color: "bg-orange-100 text-orange-800" },
  
  // CNC Materials
  { name: "Aluminum 6061", category: "CNC", priceMultiplier: 1.0, color: "bg-zinc-100 text-zinc-800" },
  { name: "Steel 1018", category: "CNC", priceMultiplier: 1.2, color: "bg-gray-100 text-gray-800" },
  { name: "Stainless Steel", category: "CNC", priceMultiplier: 1.8, color: "bg-slate-100 text-slate-800" },
  { name: "Brass", category: "CNC", priceMultiplier: 1.5, color: "bg-yellow-100 text-yellow-800" },
  { name: "Titanium", category: "CNC", priceMultiplier: 5.0, color: "bg-purple-100 text-purple-800" },
  { name: "Inconel", category: "CNC", priceMultiplier: 6.0, color: "bg-red-100 text-red-800" },
  { name: "Aluminum", category: "CNC", priceMultiplier: 1.0, color: "bg-zinc-100 text-zinc-800" },
  { name: "Steel", category: "CNC", priceMultiplier: 1.2, color: "bg-gray-100 text-gray-800" },
];

export const calculatePrice = (
  volume: number,
  machine: Machine,
  material: Material,
  complexity: "Low" | "Medium" | "High"
): number => {
  const complexityMultiplier = complexity === "High" ? 1.5 : complexity === "Medium" ? 1.2 : 1.0;
  const baseCalculation = volume * machine.basePrice * material.priceMultiplier * complexityMultiplier;
  
  // Add minimum charge
  const minimumCharge = machine.category === "SLM" ? 50 : machine.category === "CNC" ? 40 : machine.category === "SLS" ? 30 : 20;
  
  return Math.max(Math.round(baseCalculation), minimumCharge);
};

export const getDeliveryTime = (category: string, complexity: "Low" | "Medium" | "High"): string => {
  const baseTime = {
    "FDM": complexity === "High" ? "2-3 days" : complexity === "Medium" ? "1-2 days" : "12-24 hours",
    "SLS": complexity === "High" ? "3-5 days" : complexity === "Medium" ? "2-3 days" : "1-2 days",
    "SLM": complexity === "High" ? "7-10 days" : complexity === "Medium" ? "5-7 days" : "3-5 days",
    "CNC": complexity === "High" ? "5-7 days" : complexity === "Medium" ? "3-5 days" : "2-3 days",
  };
  
  return baseTime[category as keyof typeof baseTime] || "3-5 days";
};
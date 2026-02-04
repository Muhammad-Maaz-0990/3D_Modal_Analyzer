import { Button } from "@/components/ui/button";
import { Upload, Clock, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-1"></div>
      
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-primary/10 to-secondary/10 z-1"></div>
      
      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float z-1"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float z-1" style={{ animationDelay: "2s" }}></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">Precision Manufacturing</span>
            <br />
            <span className="text-white">On Demand</span>
          </h1>
          
          <p className="text-xl text-white mb-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            From FDM to Metal 3D Printing and CNC Machining. Instant quotes in under 60 seconds. 
            Upload your files and get production-ready parts with industry-leading precision.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link to="/upload">
              <Button size="lg" className="glass-hover bg-primary text-primary-foreground text-lg px-8 py-6 animate-glow">
                <Upload className="w-5 h-5 mr-2" />
                Get Instant Quote
              </Button>
            </Link>
            <Link to="/machines">
              <Button size="lg" variant="outline" className="glass glass-hover text-lg px-8 py-6">
                View Our Machines
              </Button>
            </Link>
          </div>
          
          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-4xl mx-auto mb-16 mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="glass glass-hover p-6 rounded-2xl">
              <Clock className="w-10 h-10 text-primary mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">60 Second Quotes</h3>
              <p className="text-sm text-muted-foreground">Automated DFM analysis and instant pricing for all file types</p>
            </div>
            
            <div className="glass glass-hover p-6 rounded-2xl">
              <Shield className="w-10 h-10 text-secondary mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">ISO Certified</h3>
              <p className="text-sm text-muted-foreground">Quality guaranteed with full traceability and certification</p>
            </div>
            
            <div className="glass glass-hover p-6 rounded-2xl">
              <Zap className="w-10 h-10 text-accent mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Multi-Technology</h3>
              <p className="text-sm text-muted-foreground">FDM, SLS, SLM, CNC - all processes under one roof</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

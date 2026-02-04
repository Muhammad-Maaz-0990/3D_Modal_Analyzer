import { Button } from "@/components/ui/button";
import { Upload, Cpu, Layers, BookOpen, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const scrollToAbout = () => {
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
    
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const aboutSection = document.getElementById('about-us');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If we're already on home page, just scroll
      const aboutSection = document.getElementById('about-us');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center space-x-2"
          >
            <Layers className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold gradient-text">3DOPENPRINT</span>
          </button>
          
          <Link to="/" className="hidden md:flex items-center space-x-2">
            <Layers className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold gradient-text">3DOPENPRINT</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>
            <button 
              onClick={scrollToAbout}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer"
            >
              About Us
            </button>
            <Link to="/machines" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Machines
            </Link>
            <Link to="/materials" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              Materials
            </Link>
            <a 
              href="https://3dopendesign.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              3D Open Design
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:text-secondary transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/upload">
              <Button className="glass-hover bg-primary text-primary-foreground">
                <Upload className="w-4 h-4 mr-2" />
                Get Quote
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                to="/"
                className="block text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <button
                onClick={() => {
                  scrollToAbout();
                  setIsMobileMenuOpen(false);
                }}
                className="block text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2 w-full text-left"
              >
                About Us
              </button>
              <Link
                to="/machines"
                className="block text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Machines
              </Link>
              <Link
                to="/materials"
                className="block text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Materials
              </Link>
              <a
                href="https://3dopendesign.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                3D Open Design
              </a>
              <Link
                to="/upload"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block"
              >
                <Button className="glass-hover bg-primary text-primary-foreground w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Get Quote
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

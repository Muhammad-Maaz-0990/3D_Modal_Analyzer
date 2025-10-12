import { Layers, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="glass border-t border-border/50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Layers className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold gradient-text">3DOPENPRINT</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Europe's most versatile and precise 3D print-on-demand service
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/machines" className="hover:text-primary transition-colors">3D Printing</Link></li>
              <li><Link to="/machines" className="hover:text-primary transition-colors">CNC Machining</Link></li>
              <li><Link to="/upload" className="hover:text-primary transition-colors">Instant Quote</Link></li>
              <li><Link to="/materials" className="hover:text-primary transition-colors">Materials</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Quality</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Affiliate Sites</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://3dopendesign.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-secondary transition-colors flex items-center"
                >
                  3D Open Design <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://3dod.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-secondary transition-colors flex items-center"
                >
                  3DOD Community <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://3dopenbuild.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-secondary transition-colors flex items-center"
                >
                  3D Open Build <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© 2025 3D OPEN DESIGN LTD. All rights reserved. | Proprietary & Confidential</p>
        </div>
      </div>
    </footer>
  );
};


import React from 'react';
import { Anchor, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FooterSection = () => {
  return (
    <footer className="bg-deep-navy text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Newsletter */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-ocean-blue rounded-lg flex items-center justify-center">
                <Anchor className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Cruise & Vacations</span>
            </div>
            <p className="text-white/80 leading-relaxed">
              Discover your perfect cruise with AI-powered search and personalized recommendations.
            </p>
            <div className="space-y-3">
              <h4 className="font-semibold">Stay Updated</h4>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button className="bg-sunset-orange hover:bg-orange-600">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Destinations */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg">Popular Destinations</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="#" className="hover:text-seafoam-green transition-colors">Caribbean Cruises</a></li>
              <li><a href="#" className="hover:text-seafoam-green transition-colors">Mediterranean</a></li>
              <li><a href="#" className="hover:text-seafoam-green transition-colors">Alaska</a></li>
              <li><a href="#" className="hover:text-seafoam-green transition-colors">Northern Europe</a></li>
              <li><a href="#" className="hover:text-seafoam-green transition-colors">Asia</a></li>
              <li><a href="#" className="hover:text-seafoam-green transition-colors">South America</a></li>
            </ul>
          </div>

          {/* Cruise Lines */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg">Cruise Lines</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="#" className="hover:text-seafoam-green transition-colors">Royal Caribbean</a></li>
              <li><a href="#" className="hover:text-seafoam-green transition-colors">Norwegian</a></li>
              <li><a href="#" className="hover:text-seafoam-green transition-colors">Carnival</a></li>
              <li><a href="#" className="hover:text-seafoam-green transition-colors">Celebrity</a></li>
              <li><a href="#" className="hover:text-seafoam-green transition-colors">Princess</a></li>
              <li><a href="#" className="hover:text-seafoam-green transition-colors">MSC Cruises</a></li>
            </ul>
          </div>

          {/* Contact & Support + About */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg">Contact & Support</h4>
            <div className="space-y-4 text-white/80">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-seafoam-green" />
                <span>1-800-CRUISE-AI</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-seafoam-green" />
                <span>support@cruisevacations.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-seafoam-green" />
                <span>Miami, Florida</span>
              </div>
              <div className="pt-4">
                <a href="/about" className="hover:text-seafoam-green transition-colors">About Us</a>
              </div>
            </div>
            <div className="space-y-3">
              <h5 className="font-medium">Follow Us</h5>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-white/20 text-white hover:bg-white/10">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-white/20 text-white hover:bg-white/10">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-white/20 text-white hover:bg-white/10">
                  <Instagram className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
            <div className="flex flex-wrap gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
            <div>
              © 2024 Cruise & Vacations. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

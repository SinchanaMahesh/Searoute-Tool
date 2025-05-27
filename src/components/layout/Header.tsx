
import React, { useState } from 'react';
import { Anchor, MessageCircle, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border-gray">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-ocean-blue rounded-lg flex items-center justify-center">
              <Anchor className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-charcoal">Cruise & Vacations</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/destinations" className="text-slate-gray hover:text-ocean-blue transition-colors">
              Destinations
            </a>
            <a href="/cruise-lines" className="text-slate-gray hover:text-ocean-blue transition-colors">
              Cruise Lines
            </a>
            <a href="/deals" className="text-slate-gray hover:text-ocean-blue transition-colors">
              Deals
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-gray hover:text-ocean-blue"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with AI
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-gray hover:text-ocean-blue"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border-gray bg-white py-4 slide-in-bottom">
            <nav className="space-y-4">
              <a href="/destinations" className="block text-slate-gray hover:text-ocean-blue transition-colors">
                Destinations
              </a>
              <a href="/cruise-lines" className="block text-slate-gray hover:text-ocean-blue transition-colors">
                Cruise Lines
              </a>
              <a href="/deals" className="block text-slate-gray hover:text-ocean-blue transition-colors">
                Deals
              </a>
              <a href="/about" className="block text-slate-gray hover:text-ocean-blue transition-colors">
                About
              </a>
              <div className="pt-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start text-slate-gray">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with AI
                </Button>
                <Button variant="outline" className="w-full justify-start border-ocean-blue text-ocean-blue">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

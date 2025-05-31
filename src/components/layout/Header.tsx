
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Anchor, MessageCircle, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LocationSearch from '@/components/search/LocationSearch';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLocationSelect = (location: string) => {
    console.log('Location selected:', location);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border-gray">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-ocean-blue rounded-lg flex items-center justify-center">
              <Anchor className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-charcoal">Cruise & Vacations</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/destinations" className="text-slate-gray hover:text-ocean-blue transition-colors text-sm">
              Destinations
            </Link>
            <Link to="/cruise-lines" className="text-slate-gray hover:text-ocean-blue transition-colors text-sm">
              Cruise Lines
            </Link>
            <Link to="/vacations" className="text-slate-gray hover:text-ocean-blue transition-colors text-sm">
              Vacations
            </Link>
            <Link to="/luxury" className="text-slate-gray hover:text-ocean-blue transition-colors text-sm">
              Luxury
            </Link>
            <Link to="/deals" className="text-slate-gray hover:text-ocean-blue transition-colors text-sm">
              Deals
            </Link>
          </nav>

          {/* Location Search & Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <LocationSearch onLocationSelect={handleLocationSelect} />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-gray hover:text-ocean-blue h-8"
              aria-label="Chat with AI assistant"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with AI
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white h-8"
              aria-label="Sign in to your account"
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-gray hover:text-ocean-blue"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border-gray bg-white py-3 slide-in-bottom">
            <nav className="space-y-3" role="navigation" aria-label="Mobile navigation">
              <div className="mb-3">
                <LocationSearch onLocationSelect={handleLocationSelect} />
              </div>
              <Link to="/destinations" className="block text-slate-gray hover:text-ocean-blue transition-colors text-sm">
                Destinations
              </Link>
              <Link to="/cruise-lines" className="block text-slate-gray hover:text-ocean-blue transition-colors text-sm">
                Cruise Lines
              </Link>
              <Link to="/vacations" className="block text-slate-gray hover:text-ocean-blue transition-colors text-sm">
                Vacations
              </Link>
              <Link to="/luxury" className="block text-slate-gray hover:text-ocean-blue transition-colors text-sm">
                Luxury
              </Link>
              <Link to="/deals" className="block text-slate-gray hover:text-ocean-blue transition-colors text-sm">
                Deals
              </Link>
              <div className="pt-3 space-y-2">
                <Button variant="ghost" className="w-full justify-start text-slate-gray h-8" aria-label="Chat with AI assistant">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with AI
                </Button>
                <Button variant="outline" className="w-full justify-start border-ocean-blue text-ocean-blue h-8" aria-label="Sign in to your account">
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

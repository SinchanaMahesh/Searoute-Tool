
import React from 'react';
import { MessageCircle, Map, Package, Shield, Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: MessageCircle,
    title: 'AI-Powered Discovery',
    description: 'Simply tell us what you want. Our AI understands natural language and finds cruises that match your dreams.',
    gradient: 'from-ocean-blue to-seafoam-green'
  },
  {
    icon: Map,
    title: 'Interactive Route Maps',
    description: 'Visualize your journey with detailed route maps, port information, and shore excursion recommendations.',
    gradient: 'from-seafoam-green to-coral-pink'
  },
  {
    icon: Package,
    title: 'Dynamic Packaging',
    description: 'Combine cruises, flights, hotels, and activities into one seamless package with guaranteed savings.',
    gradient: 'from-coral-pink to-sunset-orange'
  },
  {
    icon: Shield,
    title: 'Best Price Guarantee',
    description: 'We monitor prices 24/7 and guarantee the best deal. Find it cheaper elsewhere? We\'ll match it plus 10%.',
    gradient: 'from-sunset-orange to-deep-navy'
  },
  {
    icon: Clock,
    title: 'Real-Time Availability',
    description: 'Live inventory from all major cruise lines ensures accurate pricing and instant booking confirmation.',
    gradient: 'from-deep-navy to-ocean-blue'
  },
  {
    icon: Star,
    title: 'Personalized Recommendations',
    description: 'Machine learning algorithms analyze your preferences to suggest cruises you\'ll love.',
    gradient: 'from-ocean-blue to-coral-pink'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-light-gray to-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-6">
            Why Choose <span className="text-ocean-blue">CruiseAI</span>?
          </h2>
          <p className="text-lg text-slate-gray leading-relaxed">
            We're revolutionizing cruise discovery with cutting-edge AI technology, 
            making it easier than ever to find and book your perfect vacation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:shadow-level-3 transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-8">
                <div className="space-y-4">
                  {/* Icon with Gradient Background */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-charcoal group-hover:text-ocean-blue transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-gray leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '50,000+', label: 'Happy Travelers' },
            { number: '200+', label: 'Destinations' },
            { number: '15+', label: 'Cruise Lines' },
            { number: '4.9/5', label: 'Customer Rating' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-ocean-blue mb-2">
                {stat.number}
              </div>
              <div className="text-slate-gray font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

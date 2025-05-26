
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Miami, FL',
    cruise: 'Caribbean Adventure',
    rating: 5,
    text: 'The AI chat feature was incredible! It understood exactly what we wanted and found us a perfect cruise deal. The booking process was seamless.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Michael Chen',
    location: 'San Francisco, CA',
    cruise: 'Mediterranean Explorer',
    rating: 5,
    text: 'I was amazed by how the platform combined our cruise with flights and hotels into one package. Saved us hundreds of dollars!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Emily Rodriguez',
    location: 'Austin, TX',
    cruise: 'Alaska Wilderness',
    rating: 5,
    text: 'The interactive maps helped us choose the perfect itinerary. Seeing the route and ports made all the difference in our decision.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'David Thompson',
    location: 'Chicago, IL',
    cruise: 'Norwegian Fjords',
    rating: 5,
    text: 'Best cruise booking experience ever! The AI found options I never would have discovered on my own. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-ocean-blue via-deep-navy to-ocean-blue relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-seafoam-green rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-coral-pink rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-sunset-orange rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            What Our Travelers Say
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Join thousands of satisfied customers who've discovered their dream cruises with CruiseAI
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-white/10 backdrop-blur-md border-0 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-seafoam-green" />
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-sunset-orange text-sunset-orange" />
                    ))}
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-white/90 leading-relaxed text-lg">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-white/70 text-sm">
                        {testimonial.location} • {testimonial.cruise}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-80">
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-seafoam-green rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">✓</span>
            </div>
            <span>CLIA Certified</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-seafoam-green rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">✓</span>
            </div>
            <span>BBB Accredited</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-seafoam-green rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">✓</span>
            </div>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-seafoam-green rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">✓</span>
            </div>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

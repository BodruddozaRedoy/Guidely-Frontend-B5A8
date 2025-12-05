"use client";

import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Emma Thompson",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    rating: 5,
    text: "Maria showed us a side of Lisbon we never knew existed. The hidden viewpoints, the local wine bars—it was magical. Worth every penny!",
    tour: "Hidden Gems of Alfama",
  },
  {
    name: "David Chen",
    location: "San Francisco, USA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    rating: 5,
    text: "Kenji took us to izakayas that aren't in any guidebook. We ate the best yakitori of our lives. This is how travel should be.",
    tour: "Tokyo After Dark",
  },
  {
    name: "Sophie Martin",
    location: "Paris, France",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    rating: 5,
    text: "Seeing the Northern Lights with Sofia was a bucket-list moment. Her knowledge of the best spots made all the difference.",
    tour: "Northern Lights Chase",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            What Travelers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real stories from real travelers who discovered something special.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-500 relative animate-fade-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />

              {/* Rating Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-foreground leading-relaxed mb-6">
                {testimonial.text}
              </p>

              {/* Tour Name */}
              <p className="text-sm text-muted-foreground mb-6">
                Experience:{" "}
                <span className="text-primary font-medium">
                  {testimonial.tour}
                </span>
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-6 border-t border-border">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="font-display font-semibold">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

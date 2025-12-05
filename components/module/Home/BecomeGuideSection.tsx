"use client";

import { Button } from "@/components/ui/button";
import { DollarSign, Clock, Users, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const benefits = [
  {
    icon: DollarSign,
    title: "Earn Extra Income",
    description: "Set your own rates and keep most of what you earn.",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description: "Work when you want, as much or as little as you like.",
  },
  {
    icon: Users,
    title: "Meet People",
    description: "Connect with travelers from around the world.",
  },
  {
    icon: Award,
    title: "Share Your Passion",
    description: "Turn your local knowledge into memorable experiences.",
  },
];

const BecomeGuideSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920"
          alt="Become a guide"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 to-primary/90" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-primary-foreground">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
              Share Your City,
              <br />
              Inspire Travelers
            </h2>

            <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
              Join thousands of passionate locals who are sharing their
              knowledge and creating unforgettable experiences for travelers
              worldwide.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-primary-foreground/70">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/register?role=guide">
              <Button variant="accent" size="xl">
                Start Your Journey
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="font-display font-bold text-5xl text-primary-foreground mb-2">
                2.5K+
              </div>
              <p className="text-primary-foreground/80">Active Guides</p>
            </div>

            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="font-display font-bold text-5xl text-primary-foreground mb-2">
                $850
              </div>
              <p className="text-primary-foreground/80">
                Avg. Monthly Earning
              </p>
            </div>

            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="font-display font-bold text-5xl text-primary-foreground mb-2">
                120+
              </div>
              <p className="text-primary-foreground/80">Cities Worldwide</p>
            </div>

            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="font-display font-bold text-5xl text-primary-foreground mb-2">
                4.9
              </div>
              <p className="text-primary-foreground/80">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeGuideSection;

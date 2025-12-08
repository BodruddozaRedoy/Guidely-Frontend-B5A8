"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HeroSection = () => {
  const router = useRouter();
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    const q = destination.trim();
    router.push(`/explore${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920"
          alt="Adventure awaits"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-foreground/60 via-transparent to-foreground/20" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-primary-foreground mb-6 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium">
              Discover authentic local experiences
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-primary-foreground mb-6 leading-tight animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Travel Like a <span className="text-primary">Local</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Connect with passionate local guides who reveal hidden gems,
            authentic culture, and unforgettable stories in every destination.
          </p>

          {/* Search Bar */}
          <div
            className="bg-card rounded-2xl p-3 shadow-elevated animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Where are you going?"
                  className="pl-12 h-12 text-lg border-0 bg-muted/50 focus-visible:ring-1"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              {/* Desktop date + guests */}
              <div className="hidden lg:flex items-center gap-3">
                <div className="h-10 w-px bg-border" />
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Any date</span>
                </button>

                <div className="h-10 w-px bg-border" />
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Guests</span>
                </button>
              </div>

              <Button size="lg" className="gap-2" onClick={handleSearch}>
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div
            className="flex flex-wrap items-center gap-8 mt-10 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            {/* Guide Avatars */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
                ].map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt="Guide"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full border-2 border-card object-cover"
                  />
                ))}
              </div>
              <span className="text-primary-foreground/80 text-sm">
                <strong className="text-primary-foreground">2,500+</strong>{" "}
                verified guides
              </span>
            </div>

            <div className="text-primary-foreground/80 text-sm">
              <strong className="text-primary-foreground">50,000+</strong>{" "}
              experiences completed
            </div>
            <div className="text-primary-foreground/80 text-sm">
              <strong className="text-primary-foreground">120+</strong>{" "}
              destinations worldwide
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
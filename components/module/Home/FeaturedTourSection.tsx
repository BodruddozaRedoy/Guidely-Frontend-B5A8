/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import TourCard from "@/components/common/Cards/TourCard";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const FeaturedToursSection = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tours from backend
  const fetchTours = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/listings`);
      const result = await res.json();

      if (res.ok && Array.isArray(result.data)) {
        setTours(result.data);
      }
    } catch (err) {
      console.error("Failed to load tours:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);
  console.log(tours)

  // --- Filter featured tours (or latest if no featured) ---
  const featuredTours =
    tours?.filter((t) => t.featured) || tours?.slice(0, 4);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Featured Experiences
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Hand-picked tours loved by travelers from around the world.
            </p>
          </div>

          <Link href="/explore">
            <Button variant="ghost" className="gap-2 mt-4 md:mt-0">
              View all tours
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-center text-muted-foreground py-10">
            Loading tours...
          </p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tours?.map((tour, index) => (
                <div
                  key={tour.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <TourCard tour={tour} />
                </div>
              ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedToursSection;

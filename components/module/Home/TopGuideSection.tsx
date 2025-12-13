/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import GuideCard from "@/components/common/Cards/GuideCard";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function GuidesSection() {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/guides`);
        const json = await res.json();

        if (json.success) {
          setGuides(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch guides:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, []);

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Meet Our Guides
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Friendly locals ready to guide your journey.
            </p>
          </div>

          <Link href="/guides">
            <Button variant="ghost" className="gap-2 mt-4 md:mt-0">
              View all guides
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && guides.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No guides available at the moment.
          </div>
        )}

        {/* GUIDES LIST */}
        {!loading && guides.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide: any, index: number) => (
              <div
                key={guide.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <GuideCard guide={guide} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

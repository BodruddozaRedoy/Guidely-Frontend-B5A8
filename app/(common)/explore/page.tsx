/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  Grid,
  List
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import TourCard from "@/components/common/Cards/TourCard";
import { Tour } from "@/types/index.type";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Explore() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [tours, setTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("recommended");

  // --------------------------------------------------------------------------
  // Fetch all tours from backend — NO MAPPING
  // --------------------------------------------------------------------------
  useEffect(() => {
    const loadTours = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/listings`);
        const json = await res.json();

        const data: Listing[] = json.data || [];

        setTours(data);

        const uniqueCategories = [...new Set(data.map((t) => t.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, []);

  // --------------------------------------------------------------------------
  // Update URL params
  // --------------------------------------------------------------------------
  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);

    router.push(`/explore?${params.toString()}`);
  };

  // --------------------------------------------------------------------------
  // Filtering based on REAL Prisma listing structure
  // --------------------------------------------------------------------------
  const filteredTours = useMemo(() => {
    let result = [...tours];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // Price range filter (tourFee)
    result = result.filter(
      (t) => t.tourFee >= priceRange[0] && t.tourFee <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.tourFee - b.tourFee);
        break;
      case "price-high":
        result.sort((a, b) => b.tourFee - a.tourFee);
        break;
      case "rating":
        result.sort((a, b) => {
          const ratingA =
            a.reviews.length > 0
              ? a.reviews.reduce((s: any, r: any) => s + r.rating, 0) / a.reviews.length
              : 4.9;
          const ratingB =
            b.reviews.length > 0
              ? b.reviews.reduce((s: any, r: any) => s + r.rating, 0) / b.reviews.length
              : 4.9;
          return ratingB - ratingA;
        });
        break;
    }

    return result;
  }, [tours, searchQuery, selectedCategory, priceRange, sortBy]);

  // --------------------------------------------------------------------------
  // Clear all filters
  // --------------------------------------------------------------------------
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange([0, 50000]);
    setSortBy("recommended");
    router.push("/explore");
  };

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading tours...
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* -------------------------------- Header -------------------------------- */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Search bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateURL("q", e.target.value);
                }}
                placeholder="Search tours, destinations..."
                className="pl-12 h-12"
              />
            </div>

            {/* Filter button */}
            {/* <Button
              variant="outline"
              className="gap-2 h-12"
              onClick={() => setShowFilters((p) => !p)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button> */}

            {/* Sort dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low → High</SelectItem>
                <SelectItem value="price-high">Price: High → Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>

            {/* Grid / List view */}
            <div className="hidden md:flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* -------------------------------- Filters panel -------------------------------- */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t animate-fade-up">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setSelectedCategory(value);
                      updateURL("category", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All categories</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price slider */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">
                    Price: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={50000}
                    step={100}
                  />
                </div>

                {/* Clear filter */}
                <div className="flex items-end">
                  <Button variant="ghost" onClick={clearFilters}>
                    <X className="w-4 h-4" />
                    Clear filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------- Results -------------------------------- */}
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground mb-6">
          <span className="font-semibold text-foreground">{filteredTours.length}</span>{" "}
          tours found
        </p>

        {filteredTours.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display font-semibold text-xl mb-2">
              No tours found
              </h3>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}

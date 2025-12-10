/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Grid,
  List,
} from "lucide-react";

import TourCard from "@/components/common/Cards/TourCard";
import { Tour } from "@/types/index.type";
import { categories } from "@/data/mockData";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Explore() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("recommended");

  // ------------------------------------------------
  // FETCH LISTINGS FROM API
  // ------------------------------------------------
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/listings`);
        const json = await res.json();

        console.log("API LISTINGS:", json.data);

        const mapped: Tour[] = json.data.map((l: any) => ({
          id: l.id,
          guideId: l.guideId,

          title: l.title,
          description: l.description,

          itinerary: l.itinerary
            ? l.itinerary.split("|").map((s: string) => s.trim())
            : [],

          price: l.tourFee,
          duration:
            l.durationDays === 1 ? "1 day" : `${l.durationDays} days`,

          maxGroupSize: l.maxGroupSize,
          meetingPoint: l.meetingPoint,

          category: l.category,

          images:
            Array.isArray(l.images) && l.images.length > 0
              ? l.images
              : ["https://placehold.co/600x400?text=No+Image"],

          location: l.country
            ? `${l.city}, ${l.country}`
            : l.city,

          rating:
            l.reviews?.length > 0
              ? l.reviews.reduce((a: number, r: any) => a + r.rating, 0) /
              l.reviews.length
              : 4.9,

          totalReviews: l.reviews?.length ?? 0,
          featured: false,
          active: l.isActive,
        }));

        setTours(mapped);
      } catch (e) {
        console.error("Failed to fetch listings:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // ------------------------------------------------
  // UPDATE URL PARAMS
  // ------------------------------------------------
  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/explore?${params.toString()}`);
  };

  // ------------------------------------------------
  // FILTERING (only applied after user interacts)
  // ------------------------------------------------
  const filteredTours = useMemo(() => {
    if (!tours.length) return [];

    let results = [...tours];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      results = results.filter((t) => t.category === selectedCategory);
    }

    // Only apply price filtering when user changes slider
    if (!(priceRange[0] === 0 && priceRange[1] === 500)) {
      results = results.filter(
        (t) => t.price >= priceRange[0] && t.price <= priceRange[1]
      );
    }

    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // recommended → featured first
        results.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return results;
  }, [tours, searchQuery, selectedCategory, priceRange, sortBy]);

  // ------------------------------------------------
  // CLEAR ALL FILTERS
  // ------------------------------------------------
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange([0, 500]);
    setSortBy("recommended");
    router.push("/explore");
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory,
    priceRange[0] > 0 || priceRange[1] < 500,
  ].filter(Boolean).length;

  // ------------------------------------------------
  // RENDER UI
  // ------------------------------------------------
  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading tours...
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tours, destinations..."
                className="pl-12 h-12"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateURL("q", e.target.value);
                }}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="gap-2 h-12"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1">{activeFiltersCount}</Badge>
                )}
              </Button>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
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
          </div>

          {/* FILTER PANEL */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t animate-fade-up">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
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
                      {categories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={500}
                    step={10}
                    className="mt-4"
                  />
                </div>

                {/* Clear filters */}
                <div className="flex items-end">
                  <Button variant="ghost" onClick={clearFilters} className="gap-2">
                    <X className="w-4 h-4" />
                    Clear filters
                  </Button>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* RESULTS */}
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground mb-6">
          <span className="font-semibold text-foreground">
            {filteredTours.length}
          </span>{" "}
          experiences found
        </p>

        {filteredTours.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredTours.map((tour, index) => (
              <div
                key={tour.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TourCard tour={tour} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display font-semibold text-xl mb-2">
              No tours found
            </h3>
            <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search.
            </p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
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

import { mockTours, categories } from "@/data/mockData";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Grid,
  List,
} from "lucide-react";
import TourCard from "@/components/common/Cards/TourCard";

const Explore = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState("recommended");

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/explore?${params.toString()}`);
  };

  // ---- FILTER LOGIC ----
  const filteredTours = useMemo(() => {
    let tours = [...mockTours];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tours = tours.filter(
        (tour) =>
          tour.title.toLowerCase().includes(q) ||
          tour.location.toLowerCase().includes(q) ||
          tour.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      tours = tours.filter((t) => t.category === selectedCategory);
    }

    tours = tours.filter(
      (t) => t.price >= priceRange[0] && t.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-low":
        tours.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        tours.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        tours.sort((a, b) => b.rating - a.rating);
        break;
      default:
        tours.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return tours;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange([0, 200]);
    setSortBy("recommended");

    router.push("/explore");
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory,
    priceRange[0] > 0 || priceRange[1] < 200,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search tours, destinations, guides..."
                className="pl-12 h-12"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateURL("q", e.target.value);
                }}
              />
            </div>

            {/* Actions */}
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
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value)}
              >
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
              <div className="hidden md:flex border border-input rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none h-12"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>

                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none h-12"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* FILTER PANEL */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border animate-fade-up">
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
                      {categories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* PRICE RANGE */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>

                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={200}
                    step={10}
                    className="mt-4"
                  />
                </div>

                {/* CLEAR FILTERS */}
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
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {filteredTours.length}
            </span>{" "}
            experiences found
          </p>
        </div>

        {/* GRID */}
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
              Try adjusting your filters or search for something else.
            </p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;

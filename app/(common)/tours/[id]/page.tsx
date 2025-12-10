/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Star,
  Clock,
  Users,
  MapPin,
  Globe,
  CheckCircle,
  Calendar as CalendarIcon,
  Share2,
  Heart,
  ChevronLeft,
} from "lucide-react";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// ------------------------------------------------------
// API BASE
// ------------------------------------------------------
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function TourDetails() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const listingId = params?.id as string;

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [groupSize, setGroupSize] = useState("1");
  const [isLiked, setIsLiked] = useState(false);

  // ------------------------------------------------------
  // LOAD LISTING
  // ------------------------------------------------------
  const fetchListing = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/listings/${listingId}`);
      const result = await res.json();

      if (res.ok) {
        setListing(result.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-display font-bold mb-4">
          Tour not found
        </h1>
        <Link href="/explore">
          <Button>Browse all tours</Button>
        </Link>
      </div>
    );
  }

  const totalPrice = listing.tourFee * parseInt(groupSize);

  // ------------------------------------------------------
  // BOOKING REQUEST
  // ------------------------------------------------------
  const requestBooking = async () => {
    if (!user) {
      toast.error("Please log in as a tourist to book");
      router.push("/login");
      return;
    }

    if (user.role === "GUIDE") {
      toast.error("Guides cannot book tours");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date before booking");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: listing.id,
          requestedDate: selectedDate,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Booking failed");
        return;
      }

      toast.success("Booking request sent!");
      router.push("/dashboard"); // tourist dashboard
    } catch (err) {
      toast.error("Booking failed");
    }
  };

  // ------------------------------------------------------
  // UI START
  // ------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to explore
        </Link>
      </div>

      {/* Hero Images */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
          <div className="aspect-[4/3] relative min-h-[260px]">
            <Image
              src={listing.images[0] || "/placeholder.png"}
              alt={listing.title}
              fill
              className="object-cover"
            />
          </div>

          {listing.images[1] && (
            <div className="hidden md:block aspect-[4/3] relative min-h-[260px]">
              <Image
                src={listing.images[1]}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Content Column */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge>{listing.category}</Badge>

                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-semibold">{listing.rating || 4.5}</span>
                </div>
              </div>

              <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
                {listing.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {listing.city}, {listing.country}
                </span>

                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {listing.durationDays} day(s)
                </span>

                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Max {listing.maxGroupSize} people
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-display font-semibold text-xl mb-4">
                About this experience
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Itinerary */}
            {listing.itinerary && (
              <div className="mb-8">
                <h3 className="font-display font-semibold text-xl mb-4">
                  What you&apos;ll do
                </h3>

                <div className="space-y-4">
                  {listing.itinerary.split("|").map((step: string, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-muted-foreground pt-1">{step.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meeting Point */}
            <div className="mb-8">
              <h3 className="font-display font-semibold text-xl mb-4">
                Meeting point
              </h3>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <p className="text-muted-foreground">{listing.meetingPoint}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-elevated sticky top-24">
              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display font-bold text-3xl">
                  ${listing.tourFee}
                </span>
                <span className="text-muted-foreground">per person</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mb-6">
                <Button variant="outline" size="icon" onClick={() => setIsLiked(!isLiked)}>
                  <Heart
                    className={`w-4 h-4 ${isLiked ? "fill-primary text-primary" : ""
                      }`}
                  />
                </Button>

                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Date Picker */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">
                  Select Date
                </label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Group Size */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  Group Size
                </label>

                <Select value={groupSize} onValueChange={setGroupSize}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {[...Array(listing.maxGroupSize)].map((_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {i + 1} {i === 0 ? "person" : "people"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 border-t border-border mb-6">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display font-bold text-2xl">
                  ${totalPrice}
                </span>
              </div>

              {/* Book Button */}
              <Button
                className="w-full"
                size="lg"
                disabled={!selectedDate}
                onClick={requestBooking}
              >
                {selectedDate ? "Request to Book" : "Select a date"}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                You won&apos;t be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

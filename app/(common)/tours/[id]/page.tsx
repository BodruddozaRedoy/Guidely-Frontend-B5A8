"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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

import { mockTours, mockReviews } from "@/data/mockData";

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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function TourDetails() {
  const params = useParams();
  const id = params?.id as string;

  const tour = mockTours.find((t) => t.id === id);

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [groupSize, setGroupSize] = useState("2");
  const [isLiked, setIsLiked] = useState(false);

  if (!tour) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">
            Tour not found
          </h1>
          <Link href="/explore">
            <Button>Browse all tours</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const tourReviews = mockReviews.filter((r) => r.tourId === tour.id);
  const totalPrice = tour.price * parseInt(groupSize);

  return (
      <div className="min-h-screen bg-background">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to explore
          </Link>
        </div>

        {/* Hero Images */}
        <div className="container mx-auto px-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden">
            <div className="aspect-[4/3] md:aspect-auto relative w-full h-full min-h-[260px]">
              <Image
                src={tour.images[0]}
                alt={tour.title}
                fill
                className="object-cover"
              />
            </div>

            {tour.images[1] && (
              <div className="hidden md:block aspect-auto relative w-full h-full min-h-[260px]">
                <Image
                  src={tour.images[1]}
                  alt={tour.title}
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
                  <Badge>{tour.category}</Badge>

                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-semibold">{tour.rating}</span>
                    <span className="text-muted-foreground">
                      ({tour.totalReviews} reviews)
                    </span>
                  </div>
                </div>

                <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
                  {tour.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {tour.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {tour.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Max {tour.maxGroupSize} people
                  </span>
                </div>
              </div>

              {/* Guide Info */}
              {tour.guide && (
                <div className="bg-card rounded-2xl p-6 mb-8 shadow-soft">
                  <h3 className="font-display font-semibold mb-4">
                    Your Guide
                  </h3>

                  <Link
                    href={`/profile/${tour.guide.id}`}
                    className="flex items-center gap-4 group"
                  >
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={tour.guide.avatar} />
                      <AvatarFallback>
                        {tour.guide.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-semibold group-hover:text-primary transition-colors">
                          {tour.guide.name}
                        </h4>
                        {tour.guide.verified && (
                          <CheckCircle className="w-4 h-4 text-secondary" />
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          {tour.guide.rating}
                        </span>
                        <span>{tour.guide.totalTours} tours</span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Globe className="w-4 h-4" />
                        {tour.guide.languages.join(", ")}
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-display font-semibold text-xl mb-4">
                  About this experience
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {tour.description}
                </p>
              </div>

              {/* Itinerary */}
              <div className="mb-8">
                <h3 className="font-display font-semibold text-xl mb-4">
                  What you'll do
                </h3>

                <div className="space-y-4">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center">
                        {index + 1}
                      </div>
                      <p className="text-muted-foreground pt-1">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meeting Point */}
              <div className="mb-8">
                <h3 className="font-display font-semibold text-xl mb-4">
                  Meeting point
                </h3>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-muted-foreground">
                    {tour.meetingPoint}
                  </p>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h3 className="font-display font-semibold text-xl mb-6">
                  Reviews ({tourReviews.length})
                </h3>

                {tourReviews.length > 0 ? (
                  <div className="space-y-6">
                    {tourReviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-card rounded-xl p-6 shadow-soft"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarImage src={review.tourist?.avatar} />
                            <AvatarFallback>
                              {review.tourist?.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <h4 className="font-medium">
                              {review.tourist?.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {format(review.createdAt, "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-1 mb-3">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-accent text-accent"
                            />
                          ))}
                        </div>

                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first!
                  </p>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-elevated sticky top-24">
                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-display font-bold text-3xl">
                    ${tour.price}
                  </span>
                  <span className="text-muted-foreground">/ person</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked ? "fill-primary text-primary" : ""
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

                        {selectedDate
                          ? format(selectedDate, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      align="start"
                      className="w-auto p-0"
                    >
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
                      {[...Array(tour.maxGroupSize)].map((_, i) => (
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

                {/* Book */}
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!selectedDate}
                >
                  {selectedDate ? "Request to Book" : "Select a date"}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

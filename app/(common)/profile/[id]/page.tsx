"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


import { mockGuides, mockTours, mockReviews } from "@/data/mockData";

import {
  Star,
  MapPin,
  Globe,
  CheckCircle,
  Calendar,
  MessageCircle,
  Share2,
  Award,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { format } from "date-fns";
import TourCard from "@/components/common/Cards/TourCard";

export default function Profile() {
  const params = useParams();
  const id = params.id as string;

  const guide = mockGuides.find((g) => g.id === id);
  const guideTours = mockTours.filter((t) => t.guideId === id);
  const guideReviews = mockReviews.filter((r) =>
    guideTours.some((t) => t.id === r.tourId)
  );

  if (!guide) {
    return (
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">
            Profile not found
          </h1>

          <Link href="/explore">
            <Button>Browse tours</Button>
          </Link>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-background">

        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-start gap-8">

              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 ring-4 ring-card shadow-elevated">
                  <AvatarImage src={guide.avatar} />
                  <AvatarFallback className="text-3xl">
                    {guide.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {guide.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-secondary rounded-full p-2">
                    <CheckCircle className="w-6 h-6 text-secondary-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-display font-bold text-3xl">
                    {guide.name}
                  </h1>

                  {guide.verified && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified Guide
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {guide.location}
                  </span>

                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {guide.languages.join(", ")}
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Member since {format(guide.createdAt, "MMM yyyy")}
                  </span>
                </div>

                <p className="text-muted-foreground max-w-2xl mb-6">
                  {guide.bio}
                </p>

                {/* Expertise */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {guide.expertise.map((exp) => (
                    <Badge key={exp} variant="outline">
                      {exp}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contact
                  </Button>

                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-card rounded-2xl p-6 shadow-soft w-full md:w-auto">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-5 h-5 fill-accent text-accent" />
                      <span className="font-display font-bold text-2xl">
                        {guide.rating}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>

                  <div>
                    <div className="font-display font-bold text-2xl mb-1">
                      {guide.totalReviews}
                    </div>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>

                  <div>
                    <div className="font-display font-bold text-2xl mb-1">
                      {guide.totalTours}
                    </div>
                    <p className="text-sm text-muted-foreground">Tours</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    Daily Rate
                  </p>
                  <p className="font-display font-bold text-2xl text-primary">
                    ${guide.dailyRate}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="container mx-auto px-4 py-12">

          {/* Achievements */}
          <div className="bg-card rounded-2xl p-6 shadow-soft mb-12">
            <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Achievements
            </h2>

            <div className="flex flex-wrap gap-4">
              {/* A1 */}
              <div className="flex items-center gap-3 bg-accent/10 rounded-xl px-4 py-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-medium">Super Guide</p>
                  <p className="text-xs text-muted-foreground">
                    Top-rated for 6+ months
                  </p>
                </div>
              </div>

              {/* A2 */}
              <div className="flex items-center gap-3 bg-primary/10 rounded-xl px-4 py-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-medium">100+ Tours</p>
                  <p className="text-xs text-muted-foreground">
                    Experienced guide
                  </p>
                </div>
              </div>

              {/* A3 */}
              <div className="flex items-center gap-3 bg-secondary/10 rounded-xl px-4 py-3">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-medium">Quick Responder</p>
                  <p className="text-xs text-muted-foreground">
                    Replies within 1 hour
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tours */}
          <div className="mb-12">
            <h2 className="font-display font-semibold text-2xl mb-6">
              Tours by {guide.name.split(" ")[0]} ({guideTours.length})
            </h2>

            {guideTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guideTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No tours available yet.
              </p>
            )}
          </div>

          {/* Reviews */}
          <div>
            <h2 className="font-display font-semibold text-2xl mb-6">
              Reviews ({guideReviews.length})
            </h2>

            {guideReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guideReviews.map((review) => (
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
              <p className="text-muted-foreground">No reviews yet.</p>
            )}
          </div>

        </div>
      </div>
  );
}

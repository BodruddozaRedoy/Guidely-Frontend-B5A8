/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Star,
  MapPin,
  Globe,
  Calendar,
  MessageCircle,
  Share2,
  Award,
  Pencil,
} from "lucide-react";

import { format } from "date-fns";
import TourCard from "@/components/common/Cards/TourCard";
import ProfileEditForm from "@/components/module/profile/ProfileEditForm";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const params = useParams();
  const { user: authUser } = useAuth();

  const id = params.id as string;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [guide, setGuide] = useState<any>(null);
  const [guideTours, setGuideTours] = useState<any[]>([]);
  const [guideReviews, setGuideReviews] = useState<any[]>([]);

  // ----------------------------------------------------
  // FETCH PROFILE DATA
  // ----------------------------------------------------
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/users/${id}`);
        const json = await res.json();

        const data = json.data;

        setGuide(data);
        setGuideTours(data.listings);
        setGuideReviews(data.reviews);
      } catch (err) {
        console.log("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [id]);

  // ----------------------------------------------------
  // LOADING STATE
  // ----------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  // ----------------------------------------------------
  // NOT FOUND
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // EDIT MODE
  // ----------------------------------------------------
  if (editing) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="font-display text-3xl mb-6">Edit Profile</h1>

        <ProfileEditForm
          user={guide}
          onSaved={(updatedUser: any) => {
            setGuide(updatedUser);
            setEditing(false);
          }}
        />
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN PROFILE PAGE
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start gap-8">

            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 ring-4 ring-card shadow-elevated">
                <AvatarImage src={guide.profilePic} />
                <AvatarFallback className="text-3xl">
                  {guide.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-display font-bold text-3xl">{guide.name}</h1>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                {guide.travelPreferences && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {guide.travelPreferences}
                  </span>
                )}

                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {(guide.languages || []).join(", ")}
                </span>

                {guide.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Member since {format(new Date(guide.createdAt), "MMM yyyy")}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground max-w-2xl mb-6">
                {guide.bio}
              </p>

              {/* Expertise */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(guide.expertise || []).map((exp: string) => (
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

                {authUser?.id === guide.id && (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setEditing(true)}
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Profile
                  </Button>
                )}

                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="font-display font-bold text-2xl">{guide.rating}</span>
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
                <p className="text-sm text-muted-foreground mb-1">Daily Rate</p>
                <p className="font-display font-bold text-2xl text-primary">
                  ${guide.dailyRate || 0}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-12">

        {/* Achievements */}
        <div className="bg-card rounded-2xl p-6 shadow-soft mb-12">
          <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Achievements
          </h2>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-accent/10 rounded-xl px-4 py-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-medium">Super Guide</p>
                <p className="text-xs text-muted-foreground">
                  Top-rated for 6+ months
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-primary/10 rounded-xl px-4 py-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-medium">100+ Tours</p>
                <p className="text-xs text-muted-foreground">
                  Experienced guide
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
            <p className="text-muted-foreground">No tours available yet.</p>
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
                <div key={review.id} className="bg-card rounded-xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src={review.tourist?.profilePic} />
                      <AvatarFallback>
                        {review.tourist?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h4 className="font-medium">{review.tourist?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>

                  <p className="text-muted-foreground">{review.comment}</p>
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

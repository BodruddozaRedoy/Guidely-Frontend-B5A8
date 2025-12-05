"use client";

import { Star, Clock, Users, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Link from "next/link";
import { Tour } from "@/types/index.type";
import Image from "next/image";

interface TourCardProps {
  tour: Tour;
  featured?: boolean;
}

const TourCard = ({ tour, featured = false }: TourCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Link href={`/tours/${tour.id}`}>
      <div
        className={`group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 ${
          featured ? "md:col-span-2 md:row-span-2" : ""
        }`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={tour.images[0]}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

          {/* Wishlist Button */}
          <Button
            type="button"
            variant="glass"
            size="icon"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => {
              e.preventDefault();
              setIsLiked((prev) => !prev);
            }}
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? "fill-primary text-primary" : ""
              }`}
            />
          </Button>

          {/* Category Badge */}
          <Badge className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm text-foreground border-0">
            {tour.category}
          </Badge>

          {/* Price Tag */}
          <div className="absolute bottom-4 left-4">
            <span className="text-primary-foreground font-display font-bold text-2xl">
              ${tour.price}
            </span>
            <span className="text-primary-foreground/80 text-sm"> / person</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Guide Info */}
          {tour.guide && (
            <div className="flex items-center gap-2 mb-3">
              <Image
                src={tour.guide.avatar}
                alt={tour.guide.name}
                width={32}
                height={32}
                className="rounded-full object-cover ring-2 ring-primary/20"
              />
              <span className="text-sm text-muted-foreground">
                with{" "}
                <span className="font-medium text-foreground">
                  {tour.guide.name}
                </span>
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {tour.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>{tour.location}</span>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {tour.duration}
              </span>

              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Up to {tour.maxGroupSize}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-semibold">{tour.rating}</span>
              <span className="text-muted-foreground text-sm">
                ({tour.totalReviews})
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;

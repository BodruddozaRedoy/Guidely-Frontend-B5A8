import { Star, MapPin, CheckCircle, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Guide } from "@/types/index.type";
import Image from "next/image";

interface GuideCardProps {
  guide: Guide;
}

const GuideCard = ({ guide }: GuideCardProps) => {
  const rating =
    guide.reviews && guide.reviews.length > 0
      ? guide.reviews.reduce((sum, r) => sum + r.rating, 0) /
      guide.reviews.length
      : 4.8;

  const totalReviews = guide.reviews?.length ?? 0;
  const totalTours = guide.listings?.length ?? 0;

  return (
    <Link href={`/profile/${guide.id}`}>
      <div className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 text-center">

        {/* Avatar */}
        <div className="relative mx-auto w-24 h-24 mb-4">
          <Image
            fill
            src={
              guide.profilePic ||
              "https://placehold.co/200x200?text=No+Image"
            }
            alt={guide.name}
            className="w-full h-full rounded-full object-cover ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all"
          />
        </div>

        {/* Name */}
        <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
          {guide.name}
        </h3>

        {/* Location (pull from first listing) */}
        <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span>
            {guide.listings?.[0]?.city || "Unknown City"},{" "}
            {guide.listings?.[0]?.country || ""}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground text-sm">
            ({totalReviews} reviews)
          </span>
        </div>

        {/* Languages */}
        {guide.languages?.length > 0 && (
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
            <Globe className="w-4 h-4" />
            <span>{guide.languages.slice(0, 2).join(", ")}</span>
          </div>
        )}

        {/* Expertise Tags */}
        <div className="flex flex-wrap justify-center gap-2">
          {guide.expertise?.slice(0, 3).map((exp) => (
            <Badge key={exp} variant="secondary" className="text-xs">
              {exp}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-border flex justify-center gap-6 text-sm">
          <div>
            <span className="font-semibold text-foreground">{totalTours}</span>
            <span className="text-muted-foreground ml-1">tours</span>
          </div>
          <div>
            <span className="font-semibold text-primary">
              ${guide.dailyRate ?? 50}
            </span>
            <span className="text-muted-foreground ml-1">/day</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GuideCard;

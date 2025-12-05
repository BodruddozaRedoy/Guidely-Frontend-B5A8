import { Star, MapPin, CheckCircle, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Guide } from '@/types/index.type';

interface GuideCardProps {
  guide: Guide;
}

const GuideCard = ({ guide }: GuideCardProps) => {
  return (
    <Link href={`/profile/${guide.id}`}>
      <div className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 text-center">
        {/* Avatar */}
        <div className="relative mx-auto w-24 h-24 mb-4">
          <img
            src={guide.avatar}
            alt={guide.name}
            className="w-full h-full rounded-full object-cover ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all"
          />
          {guide.verified && (
            <div className="absolute -bottom-1 -right-1 bg-secondary rounded-full p-1">
              <CheckCircle className="w-5 h-5 text-secondary-foreground" />
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
          {guide.name}
        </h3>

        {/* Location */}
        <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span>{guide.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-semibold">{guide.rating}</span>
          </div>
          <span className="text-muted-foreground text-sm">
            ({guide.totalReviews} reviews)
          </span>
        </div>

        {/* Languages */}
        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-4">
          <Globe className="w-4 h-4" />
          <span>{guide.languages.slice(0, 2).join(', ')}</span>
        </div>

        {/* Expertise */}
        <div className="flex flex-wrap justify-center gap-2">
          {guide.expertise.slice(0, 3).map((exp) => (
            <Badge key={exp} variant="secondary" className="text-xs">
              {exp}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-border flex justify-center gap-6 text-sm">
          <div>
            <span className="font-semibold text-foreground">{guide.totalTours}</span>
            <span className="text-muted-foreground ml-1">tours</span>
          </div>
          <div>
            <span className="font-semibold text-primary">${guide.dailyRate}</span>
            <span className="text-muted-foreground ml-1">/day</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GuideCard;

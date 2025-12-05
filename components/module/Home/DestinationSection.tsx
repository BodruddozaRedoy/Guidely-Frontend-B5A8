import { destinations } from '@/data/mockData';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

const DestinationsSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Popular Destinations
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover amazing local experiences in these trending cities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, index) => (
            <Link
              key={dest.name}
              href={`/explore?destination=${encodeURIComponent(dest.name)}`}
              className="group"
            >
              <div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display font-bold text-2xl text-primary-foreground mb-1">
                    {dest.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-foreground/80 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {dest.country}
                    </span>
                    <span className="text-primary-foreground/80 text-sm">
                      {dest.tours} tours
                    </span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;

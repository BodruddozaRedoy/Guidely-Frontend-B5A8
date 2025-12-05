import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { mockGuides } from '@/data/mockData';
import Link from 'next/link';
import GuideCard from '@/components/common/Cards/GuideCard';

const TopGuidesSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Meet Our Top Guides
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Passionate locals ready to share their citys best-kept secrets with you.
            </p>
          </div>
          <Link href="/explore">
            <Button variant="ghost" className="gap-2 mt-4 md:mt-0">
              View all guides
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockGuides.map((guide, index) => (
            <div
              key={guide.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <GuideCard guide={guide} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopGuidesSection;

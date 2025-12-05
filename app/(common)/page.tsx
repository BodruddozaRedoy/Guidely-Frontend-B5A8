import HeroSection from '@/components/module/Home/HeroSection';
import CommonLayout from './layout';
import CategoriesSection from '@/components/module/Home/CategorySection';
import FeaturedToursSection from '@/components/module/Home/FeaturedTourSection';
import HowItWorksSection from '@/components/module/Home/HowItWorks';
import DestinationsSection from '@/components/module/Home/DestinationSection';
import TopGuidesSection from '@/components/module/Home/TopGuideSection';
import TestimonialsSection from '@/components/module/Home/TestimonialSection';
import BecomeGuideSection from '@/components/module/Home/BecomeGuideSection';

const HomePage = () => {
  return (
    <CommonLayout>
      <HeroSection />
      <CategoriesSection />
      <FeaturedToursSection />
      <HowItWorksSection />
      <DestinationsSection />
      <TopGuidesSection />
      <TestimonialsSection />
      <BecomeGuideSection />
    </CommonLayout>
  );
};

export default HomePage;

import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const CommonLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default CommonLayout;

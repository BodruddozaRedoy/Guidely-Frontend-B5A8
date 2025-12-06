import { MapPin, Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">Guidely</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting travelers with passionate local experts for authentic, unforgettable experiences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-semibold mb-4">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/explore" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  All Tours
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Food" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Food & Culinary
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Adventure" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Adventure
                </Link>
              </li>
              <li>
                <Link href="/explore?category=History" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  History & Culture
                </Link>
              </li>
            </ul>
          </div>

          {/* For Guides */}
          <div>
            <h4 className="font-display font-semibold mb-4">For Guides</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/become-guide" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Become a Guide
                </Link>
              </li>
              <li>
                <Link href="/guide-resources" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Safety Information
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <a href="mailto:support@localguide.com" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 LocalGuide. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

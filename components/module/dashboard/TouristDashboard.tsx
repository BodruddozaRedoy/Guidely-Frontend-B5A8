"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockTours, getTouristBookings } from '@/data/mockData';
import {
  Calendar, MapPin, Clock, CheckCircle, XCircle,
  Star, Heart, Trash2, Search
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WishlistItem, Booking } from '@/types/index.type';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

// Mock wishlist data
const mockWishlist: WishlistItem[] = [
  { id: '1', tourId: '2', tour: mockTours[1], addedAt: new Date('2024-11-20') },
  { id: '2', tourId: '3', tour: mockTours[2], addedAt: new Date('2024-11-25') },
];

const TouristDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [wishlist, setWishlist] = useState(mockWishlist);

  // Get tourist's bookings
  const touristId = user?.id || 'tourist1';
  const myBookings = getTouristBookings(touristId);

  const upcomingBookings = myBookings.filter(b =>
    (b.status === 'confirmed' || b.status === 'pending') && new Date(b.date) >= new Date()
  );
  const pastBookings = myBookings.filter(b =>
    b.status === 'completed' || new Date(b.date) < new Date()
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="gap-1 border-accent text-accent"><Clock className="w-3 h-3" />Pending</Badge>;
      case 'confirmed':
        return <Badge className="gap-1 bg-secondary text-secondary-foreground"><CheckCircle className="w-3 h-3" />Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="gap-1 text-muted-foreground"><CheckCircle className="w-3 h-3" />Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Cancelled</Badge>;
      default:
        return null;
    }
  };

  const handleRemoveFromWishlist = (wishlistId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== wishlistId));
    toast("Removed from Wishlist", {
      description: "The tour has been removed from your wishlist.",
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    toast("Booking Cancelled", {
      description: "Your booking has been cancelled.",
    });
  };

  const renderBookingCard = (booking: Booking, showCancelButton = false) => (
    <div key={booking.id} className="flex flex-col md:flex-row gap-4 p-4 bg-muted/50 rounded-xl">
      <Image
        src={booking.tour?.images[0] || ""}
        alt={booking.tour?.title || ""}
        className="w-full md:w-32 h-40 md:h-24 object-cover rounded-lg"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium">{booking.tour?.title}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {booking.tour?.location}
            </p>
          </div>
          {getStatusBadge(booking.status)}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(booking.date).toLocaleDateString()}
          </span>
          <span>{booking.groupSize} guests</span>
          <span className="font-medium text-foreground">${booking.totalPrice}</span>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={booking.guide?.avatar} />
            <AvatarFallback>{booking.guide?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{booking.guide?.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Star className="w-3 h-3 fill-accent text-accent" />
              {booking.guide?.rating}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-row md:flex-col gap-2">
        <Link href={`/tours/${booking.tourId}`} className="flex-1 md:flex-none">
          <Button variant="outline" size="sm" className="w-full">View Tour</Button>
        </Link>
        {showCancelButton && booking.status === 'pending' && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 md:flex-none text-destructive hover:text-destructive"
            onClick={() => handleCancelBooking(booking.id)}
          >
            Cancel
          </Button>
        )}
        {booking.status === 'completed' && (
          <Button variant="outline" size="sm" className="flex-1 md:flex-none">
            Write Review
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}!
          </h1>
          <p className="text-muted-foreground">
            Plan your next adventure and manage your trips.
          </p>
        </div>
        <Link href="/explore">
          <Button className="gap-2 mt-4 md:mt-0">
            <Search className="w-4 h-4" />
            Find Tours
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Upcoming Trips</span>
          </div>
          <p className="font-display font-bold text-3xl">{upcomingBookings.length}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-sm text-muted-foreground">Completed Tours</span>
          </div>
          <p className="font-display font-bold text-3xl">{pastBookings.length}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">Wishlist</span>
          </div>
          <p className="font-display font-bold text-3xl">{wishlist.length}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Cities Visited</span>
          </div>
          <p className="font-display font-bold text-3xl">
            {new Set(pastBookings.map(b => b.tour?.location)).size}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
          <TabsTrigger value="past">Past Trips</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <h2 className="font-display font-semibold text-xl mb-4">Upcoming Trips ({upcomingBookings.length})</h2>
            <div className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => renderBookingCard(booking, true))
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No upcoming trips planned</p>
                  <Link href="/explore">
                    <Button>Explore Tours</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <h2 className="font-display font-semibold text-xl mb-4">Past Trips ({pastBookings.length})</h2>
            <div className="space-y-4">
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => renderBookingCard(booking))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No past trips yet</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="wishlist">
          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <h2 className="font-display font-semibold text-xl mb-4">Wishlist ({wishlist.length})</h2>
            <div className="space-y-4">
              {wishlist.length > 0 ? wishlist.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 bg-muted/50 rounded-xl">
                  <Image
                    src={item.tour.images[0]}
                    alt={item.tour.title}
                    className="w-full md:w-32 h-40 md:h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{item.tour.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" />
                      {item.tour.location}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.tour.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        {item.tour.rating}
                      </span>
                      <span className="font-medium text-foreground">${item.tour.price}/person</span>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col gap-2">
                    <Link href={`/tours/${item.tourId}`} className="flex-1 md:flex-none">
                      <Button size="sm" className="w-full">Book Now</Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                  <Link href="/explore">
                    <Button>Explore Tours</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TouristDashboard;

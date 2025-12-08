import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockTours } from '@/data/mockData';
import { 
  Calendar, MapPin, Clock, Users, Star,
  CheckCircle, XCircle, MessageCircle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import Link from 'next/link';

// Mock tourist bookings
type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface TouristBooking {
  id: string;
  tour: typeof mockTours[0];
  date: Date;
  groupSize: number;
  totalPrice: number;
  status: BookingStatus;
}

const mockTouristBookings: TouristBooking[] = [
  {
    id: '1',
    tour: mockTours[0],
    date: new Date('2024-12-20'),
    groupSize: 2,
    totalPrice: 90,
    status: 'confirmed',
  },
  {
    id: '2',
    tour: mockTours[1],
    date: new Date('2024-12-25'),
    groupSize: 3,
    totalPrice: 285,
    status: 'pending',
  },
  {
    id: '3',
    tour: mockTours[2],
    date: new Date('2024-11-15'),
    groupSize: 2,
    totalPrice: 360,
    status: 'completed',
  },
];

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3" />Pending</Badge>;
      case 'confirmed':
        return <Badge className="gap-1 bg-secondary"><CheckCircle className="w-3 h-3" />Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="gap-1 text-muted-foreground"><CheckCircle className="w-3 h-3" />Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Cancelled</Badge>;
      default:
        return null;
    }
  };

  const upcomingBookings = mockTouristBookings.filter(b => 
    b.status === 'pending' || b.status === 'confirmed'
  );
  const pastBookings = mockTouristBookings.filter(b => 
    b.status === 'completed' || b.status === 'cancelled'
  );

  return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              Manage your upcoming trips and view past experiences.
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <div key={booking.id} className="bg-card rounded-2xl overflow-hidden shadow-soft">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <Link href={`/tours/${booking.tour.id}`} className="md:w-64 h-48 md:h-auto">
                        <Image
                          src={booking.tour.images[0]}
                          alt={booking.tour.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            {getStatusBadge(booking.status)}
                            <Link href={`/tours/${booking.tour.id}`}>
                              <h3 className="font-display font-semibold text-xl mt-2 hover:text-primary transition-colors">
                                {booking.tour.title}
                              </h3>
                            </Link>
                          </div>
                          <div className="text-right">
                            <p className="font-display font-bold text-2xl">${booking.totalPrice}</p>
                            <p className="text-sm text-muted-foreground">Total paid</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {booking.date.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {booking.tour.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {booking.groupSize} guests
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.tour.duration}
                          </span>
                        </div>

                        {/* Guide */}
                        {booking.tour.guide && (
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <Link href={`/profile/${booking.tour.guide.id}`} className="flex items-center gap-3 group">
                              <Avatar>
                                <AvatarImage src={booking.tour.guide.avatar} />
                                <AvatarFallback>{booking.tour.guide.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium group-hover:text-primary transition-colors">
                                  {booking.tour.guide.name}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-accent text-accent" />
                                  {booking.tour.guide.rating} • {booking.tour.guide.totalTours} tours
                                </p>
                              </div>
                            </Link>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="gap-1">
                                <MessageCircle className="w-4 h-4" />
                                Message
                              </Button>
                              {booking.status === 'pending' && (
                                <Button variant="destructive" size="sm">
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-card rounded-2xl p-12 text-center shadow-soft">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="font-display font-semibold text-xl mb-2">No upcoming trips</h3>
                  <p className="text-muted-foreground mb-6">
                    Time to plan your next adventure!
                  </p>
                  <Link href="/explore">
                    <Button>Explore Tours</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {pastBookings.length > 0 ? (
                pastBookings.map((booking) => (
                  <div key={booking.id} className="bg-card rounded-2xl overflow-hidden shadow-soft">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <Link href={`/tours/${booking.tour.id}`} className="md:w-64 h-48 md:h-auto">
                        <Image
                          src={booking.tour.images[0]}
                          alt={booking.tour.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            {getStatusBadge(booking.status)}
                            <Link href={`/tours/${booking.tour.id}`}>
                              <h3 className="font-display font-semibold text-xl mt-2 hover:text-primary transition-colors">
                                {booking.tour.title}
                              </h3>
                            </Link>
                          </div>
                          <div className="text-right">
                            <p className="font-display font-bold text-2xl">${booking.totalPrice}</p>
                            <p className="text-sm text-muted-foreground">Total paid</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {booking.date.toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {booking.tour.location}
                          </span>
                        </div>

                        {booking.status === 'completed' && (
                          <div className="pt-4 border-t border-border">
                            <Button variant="outline">
                              <Star className="w-4 h-4 mr-2" />
                              Write a Review
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-card rounded-2xl p-12 text-center shadow-soft">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="font-display font-semibold text-xl mb-2">No past trips</h3>
                  <p className="text-muted-foreground">
                    Your completed trips will appear here.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
};

export default Bookings;

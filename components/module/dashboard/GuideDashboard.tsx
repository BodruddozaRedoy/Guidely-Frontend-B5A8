import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockTours, mockBookings, getGuideBookings, getGuideTours } from '@/data/mockData';
import {
    Plus, Calendar, DollarSign, Clock, CheckCircle, XCircle,
    MapPin, Star, Edit, Trash2, Eye, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import Link from 'next/link';

const GuideDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data - in real app, this would come from API based on guide ID
    const guideId = user?.id || '1';
    const myTours = getGuideTours(guideId);
    const myBookings = getGuideBookings(guideId);

    const pendingBookings = myBookings.filter(b => b.status === 'pending');
    const confirmedBookings = myBookings.filter(b => b.status === 'confirmed');
    const completedBookings = myBookings.filter(b => b.status === 'completed');

    const stats = {
        totalBookings: myBookings.length,
        pendingBookings: pendingBookings.length,
        totalRevenue: completedBookings.reduce((sum, b) => sum + b.totalPrice, 0),
        thisMonth: completedBookings
            .filter(b => new Date(b.date).getMonth() === new Date().getMonth())
            .reduce((sum, b) => sum + b.totalPrice, 0),
        rating: 4.9,
        activeTours: myTours.filter(t => t.active).length,
    };

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

    const handleAcceptBooking = (bookingId: string) => {
        toast("Booking Accepted", {
            description: "The booking has been confirmed.",
        });
    };

    const handleDeclineBooking = (bookingId: string) => {
        toast("Booking Declined", {
            description: "The booking has been declined.",
        });
    };

    const handleToggleTourStatus = (tourId: string, currentStatus: boolean) => {
        toast(currentStatus ? "Tour Deactivated" : "Tour Activated", {
            description: currentStatus ? "The tour is now hidden from search." : "The tour is now visible to travelers.",
        });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-3xl mb-2">
                        Welcome back, {user?.name?.split(' ')[0] || 'Guide'}!
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your tours, bookings, and earnings.
                    </p>
                </div>
                <Link href="/dashboard/listings/new">
                    <Button className="gap-2 mt-4 md:mt-0">
                        <Plus className="w-4 h-4" />
                        Create New Tour
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">Total Bookings</span>
                    </div>
                    <p className="font-display font-bold text-3xl">{stats.totalBookings}</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-accent" />
                        </div>
                        <span className="text-sm text-muted-foreground">Pending</span>
                    </div>
                    <p className="font-display font-bold text-3xl">{stats.pendingBookings}</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-secondary" />
                        </div>
                        <span className="text-sm text-muted-foreground">Total Revenue</span>
                    </div>
                    <p className="font-display font-bold text-3xl">${stats.totalRevenue}</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Star className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">Rating</span>
                    </div>
                    <p className="font-display font-bold text-3xl">{stats.rating}</p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="bookings">All Bookings</TabsTrigger>
                    <TabsTrigger value="listings">My Listings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Pending Requests */}
                    <div className="bg-card rounded-2xl p-6 shadow-soft">
                        <h2 className="font-display font-semibold text-xl mb-4">Pending Requests</h2>
                        <div className="space-y-4">
                            {pendingBookings.length > 0 ? pendingBookings.map((booking) => (
                                <div key={booking.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 rounded-xl gap-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={booking.tourist?.avatar} />
                                            <AvatarFallback>{booking.tourist?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{booking.tourist?.name}</p>
                                            <p className="text-sm text-muted-foreground">{booking.tour?.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(booking.date).toLocaleDateString()} • {booking.groupSize} guests • ${booking.totalPrice}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleDeclineBooking(booking.id)}>
                                            Decline
                                        </Button>
                                        <Button size="sm" onClick={() => handleAcceptBooking(booking.id)}>
                                            Accept
                                        </Button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-muted-foreground text-center py-8">No pending requests</p>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Tours */}
                    <div className="bg-card rounded-2xl p-6 shadow-soft">
                        <h2 className="font-display font-semibold text-xl mb-4">Upcoming Tours</h2>
                        <div className="space-y-4">
                            {confirmedBookings.length > 0 ? confirmedBookings.map((booking) => (
                                <div key={booking.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 rounded-xl gap-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={booking.tourist?.avatar} />
                                            <AvatarFallback>{booking.tourist?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{booking.tourist?.name}</p>
                                            <p className="text-sm text-muted-foreground">{booking.tour?.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(booking.date).toLocaleDateString()} • {booking.groupSize} guests
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>
                            )) : (
                                <p className="text-muted-foreground text-center py-8">No upcoming tours</p>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="bookings">
                    <div className="bg-card rounded-2xl p-6 shadow-soft">
                        <h2 className="font-display font-semibold text-xl mb-4">All Bookings</h2>
                        <div className="space-y-4">
                            {myBookings.length > 0 ? myBookings.map((booking) => (
                                <div key={booking.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 rounded-xl gap-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={booking.tourist?.avatar} />
                                            <AvatarFallback>{booking.tourist?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{booking.tourist?.name}</p>
                                            <p className="text-sm text-muted-foreground">{booking.tour?.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(booking.date).toLocaleDateString()} • {booking.groupSize} guests • ${booking.totalPrice}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>
                            )) : (
                                <p className="text-muted-foreground text-center py-8">No bookings yet</p>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="listings">
                    <div className="bg-card rounded-2xl p-6 shadow-soft">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display font-semibold text-xl">My Tours ({myTours.length})</h2>
                            <Link href="/dashboard/listings/new">
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Tour
                                </Button>
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {myTours.length > 0 ? myTours.map((tour) => (
                                <div key={tour.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-muted/50 rounded-xl">
                                    <img
                                        src={tour.images[0]}
                                        alt={tour.title}
                                        className="w-full md:w-24 h-32 md:h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium">{tour.title}</h3>
                                            {tour.active ? (
                                                <Badge className="bg-secondary/20 text-secondary text-xs">Active</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-xs">Inactive</Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {tour.location}
                                            </span>
                                            <span>${tour.price}/person</span>
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-accent text-accent" />
                                                {tour.rating}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Link href={`/tours/${tour.id}`} className="flex-1 md:flex-none">
                                            <Button variant="outline" size="icon" className="w-full md:w-10">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/dashboard/listings/${tour.id}/edit`} className="flex-1 md:flex-none">
                                            <Button variant="outline" size="icon" className="w-full md:w-10">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="flex-1 md:flex-none w-full md:w-10"
                                            onClick={() => handleToggleTourStatus(tour.id, tour.active || false)}
                                        >
                                            {tour.active ? <ToggleRight className="w-4 h-4 text-secondary" /> : <ToggleLeft className="w-4 h-4" />}
                                        </Button>
                                        <Button variant="outline" size="icon" className="flex-1 md:flex-none w-full md:w-10 text-destructive hover:text-destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground mb-4">You haven&apos;t created any tours yet</p>
                                    <Link href="/dashboard/listings/new">
                                        <Button className="gap-2">
                                            <Plus className="w-4 h-4" />
                                            Create Your First Tour
                                        </Button>
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

export default GuideDashboard;

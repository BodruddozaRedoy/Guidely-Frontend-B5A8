"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
    mockTours, mockBookings, getAllUsers, mockGuides, mockTourists
} from '@/data/mockData';
import {
    Users, MapPin, Calendar, DollarSign, Search, Eye,
    Ban, CheckCircle, XCircle, Clock, Edit, Trash2,
    TrendingUp, Shield, AlertTriangle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import Image from 'next/image';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [userSearch, setUserSearch] = useState('');
    const [tourSearch, setTourSearch] = useState('');
    const [bookingSearch, setBookingSearch] = useState('');

    const allUsers = getAllUsers();
    const totalRevenue = mockBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

    const stats = {
        totalUsers: allUsers.length,
        totalGuides: mockGuides.length,
        totalTourists: mockTourists.length,
        totalTours: mockTours.length,
        activeTours: mockTours.filter(t => t.active).length,
        totalBookings: mockBookings.length,
        pendingBookings: mockBookings.filter(b => b.status === 'pending').length,
        totalRevenue,
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

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'guide':
                return <Badge className="bg-primary text-primary-foreground">Guide</Badge>;
            case 'tourist':
                return <Badge variant="outline">Tourist</Badge>;
            case 'admin':
                return <Badge className="bg-destructive text-destructive-foreground">Admin</Badge>;
            default:
                return null;
        }
    };

    const handleBanUser = (userId: string, userName: string) => {
        toast("User Banned", {
            description: `${userName} has been banned from the platform.`,
        });
    };

    const handleDeleteTour = (tourId: string, tourTitle: string) => {
        toast("Tour Deleted", {
            description: `"${tourTitle}" has been removed from the platform.`,
        });
    };

    const handleCancelBooking = (bookingId: string) => {
        toast("Booking Cancelled", {
            description: "The booking has been cancelled by admin.",
        });
    };

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredTours = mockTours.filter(tour =>
        tour.title.toLowerCase().includes(tourSearch.toLowerCase()) ||
        tour.location.toLowerCase().includes(tourSearch.toLowerCase())
    );

    const filteredBookings = mockBookings.filter(booking =>
        booking.tour?.title.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        booking.tourist?.name.toLowerCase().includes(bookingSearch.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-3xl mb-2 flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary" />
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Manage users, tours, and bookings across the platform.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">Total Users</span>
                    </div>
                    <p className="font-display font-bold text-3xl">{stats.totalUsers}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {stats.totalGuides} guides • {stats.totalTourists} tourists
                    </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-secondary" />
                        </div>
                        <span className="text-sm text-muted-foreground">Total Tours</span>
                    </div>
                    <p className="font-display font-bold text-3xl">{stats.totalTours}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {stats.activeTours} active
                    </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-accent" />
                        </div>
                        <span className="text-sm text-muted-foreground">Bookings</span>
                    </div>
                    <p className="font-display font-bold text-3xl">{stats.totalBookings}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {stats.pendingBookings} pending
                    </p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">Revenue</span>
                    </div>
                    <p className="font-display font-bold text-3xl">${stats.totalRevenue}</p>
                    <p className="text-xs text-secondary flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        +12% this month
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="tours">Tour Management</TabsTrigger>
                    <TabsTrigger value="bookings">Booking Management</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Recent Activity */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Recent Users */}
                        <div className="bg-card rounded-2xl p-6 shadow-soft">
                            <h2 className="font-display font-semibold text-xl mb-4">Recent Users</h2>
                            <div className="space-y-3">
                                {allUsers.slice(0, 5).map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        {getRoleBadge(user.role)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Bookings */}
                        <div className="bg-card rounded-2xl p-6 shadow-soft">
                            <h2 className="font-display font-semibold text-xl mb-4">Recent Bookings</h2>
                            <div className="space-y-3">
                                {mockBookings.slice(0, 5).map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-sm">{booking.tour?.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {booking.tourist?.name} • {new Date(booking.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {getStatusBadge(booking.status)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-medium mb-1">Pending Actions</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    You have {stats.pendingBookings} pending bookings that require attention.
                                </p>
                                <Button variant="outline" size="sm" onClick={() => setActiveTab('bookings')}>
                                    View Pending Bookings
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="users">
                    <div className="bg-card rounded-2xl p-6 shadow-soft">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h2 className="font-display font-semibold text-xl">All Users ({filteredUsers.length})</h2>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 rounded-xl gap-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Joined {new Date(user.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getRoleBadge(user.role)}
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="icon">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                                                        <Ban className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Ban User</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to ban {user.name}? This will prevent them from accessing the platform.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleBanUser(user.id, user.name)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Ban User
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="tours">
                    <div className="bg-card rounded-2xl p-6 shadow-soft">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h2 className="font-display font-semibold text-xl">All Tours ({filteredTours.length})</h2>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search tours..."
                                    value={tourSearch}
                                    onChange={(e) => setTourSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {filteredTours.map((tour) => (
                                <div key={tour.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-muted/50 rounded-xl">
                                    <Image
                                        src={tour.images[0]}
                                        alt={tour.title}
                                        fill
                                        className="w-full md:w-20 h-32 md:h-14 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-sm">{tour.title}</h3>
                                            {tour.active ? (
                                                <Badge className="bg-secondary/20 text-secondary text-xs">Active</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-xs">Inactive</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            By {tour.guide?.name} • {tour.location} • ${tour.price}/person
                                        </p>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button variant="outline" size="icon" className="flex-1 md:flex-none">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="flex-1 md:flex-none">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" size="icon" className="flex-1 md:flex-none text-destructive hover:text-destructive">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Tour</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete &quot;{tour.title}&quot;? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteTour(tour.id, tour.title)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="bookings">
                    <div className="bg-card rounded-2xl p-6 shadow-soft">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h2 className="font-display font-semibold text-xl">All Bookings ({filteredBookings.length})</h2>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search bookings..."
                                    value={bookingSearch}
                                    onChange={(e) => setBookingSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {filteredBookings.map((booking) => (
                                <div key={booking.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 rounded-xl gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-sm mb-1">{booking.tour?.title}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Tourist: {booking.tourist?.name} • Guide: {booking.guide?.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(booking.date).toLocaleDateString()} • {booking.groupSize} guests • ${booking.totalPrice}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(booking.status)}
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="icon">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            {booking.status === 'pending' && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to cancel this booking? Both the tourist and guide will be notified.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleCancelBooking(booking.id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Cancel Booking
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;

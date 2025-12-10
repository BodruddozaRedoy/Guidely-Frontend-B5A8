/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Plus, Calendar, DollarSign, Clock, CheckCircle, XCircle,
    MapPin, Star, Edit, Trash2, Eye, ToggleLeft, ToggleRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Link from "next/link";



// ---------------------------------------------------
// UI HELPERS
// ---------------------------------------------------
const getStatusBadge = (status: string) => {
    switch (status) {
        case "PENDING":
            return (
                <Badge variant="outline" className="gap-1 border-accent text-accent">
                    <Clock className="w-3 h-3" /> Pending
                </Badge>
            );
        case "CONFIRMED":
            return (
                <Badge className="gap-1 bg-secondary text-secondary-foreground">
                    <CheckCircle className="w-3 h-3" /> Confirmed
                </Badge>
            );
        case "COMPLETED":
            return (
                <Badge variant="outline" className="gap-1 text-muted-foreground">
                    <CheckCircle className="w-3 h-3" /> Completed
                </Badge>
            );
        case "CANCELLED":
            return (
                <Badge variant="destructive" className="gap-1">
                    <XCircle className="w-3 h-3" /> Cancelled
                </Badge>
            );
    }
};

const GuideDashboard = () => {
    const { user, token } = useAuth();
    const guideId = user?.id;

    const [activeTab, setActiveTab] = useState("overview");
    const [tours, setTours] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    // ---------------------------------------------------
    // LOAD REAL DATA
    // ---------------------------------------------------
    useEffect(() => {
        if (!guideId || !token) return;

        const fetchData = async () => {
            try {
                const [tourRes, bookingRes] = await Promise.all([
                    fetch(`${BASE_URL}/api/listings/guide/${guideId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${BASE_URL}/api/bookings/${guideId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const tourData = await tourRes.json();
                const bookingData = await bookingRes.json();

                setTours(tourData?.data || []);
                setBookings(bookingData?.data || []);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [guideId, token]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
        );
    }

    // ---------------------------------------------------
    // STATS (REAL DATA)
    // ---------------------------------------------------
    const pendingBookings = bookings.filter((b) => b.status === "PENDING");
    const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
    const completedBookings = bookings.filter((b) => b.status === "COMPLETED");

    const stats = {
        totalBookings: bookings.length,
        pendingBookings: pendingBookings.length,
        totalRevenue: completedBookings.reduce((sum, b) => sum + b.totalPrice, 0),
        thisMonth: completedBookings
            .filter((b) => new Date(b.createdAt).getMonth() === new Date().getMonth())
            .reduce((sum, b) => sum + b.totalPrice, 0),
        rating:
            tours.length > 0
                ? (
                    tours.reduce((sum, t) => sum + (t.avgRating || 0), 0) / tours.length
                ).toFixed(1)
                : "0.0",
        activeTours: tours.filter((t) => t.isActive).length,
    };



    const handleToggleTourStatus = async (tourId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`${BASE_URL}/api/listings/${tourId}/toggle`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to update status");

            setTours((prev) =>
                prev.map((t) =>
                    t.id === tourId ? { ...t, isActive: !currentStatus } : t
                )
            );

            toast.success(currentStatus ? "Tour deactivated" : "Tour activated");
        } catch (error) {
            toast.error("Could not update tour status");
        }
    };

    // ---------------------------------------------------
    // RENDER UI
    // ---------------------------------------------------
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-3xl mb-2">
                        Welcome back, {user?.name?.split(" ")[0] || "Guide"}!
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your tours, bookings, and earnings.
                    </p>
                </div>

                <Link href="/dashboard/listings/new">
                    <Button className="gap-2 mt-4 md:mt-0">
                        <Plus className="w-4 h-4" /> Create New Tour
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Calendar />} label="Total Bookings" value={stats.totalBookings} />
                <StatCard icon={<Clock />} label="Pending" value={stats.pendingBookings} />
                <StatCard icon={<DollarSign />} label="Total Revenue" value={`$${stats.totalRevenue}`} />
                <StatCard icon={<Star />} label="Rating" value={stats.rating} />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="bookings">All Bookings</TabsTrigger>
                    <TabsTrigger value="listings">My Listings</TabsTrigger>
                </TabsList>

                {/* ---------------- OVERVIEW ---------------- */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Pending */}
                    <SectionCard title="Pending Requests">
                        {pendingBookings.length > 0 ? (
                            pendingBookings.map(RenderBooking)
                        ) : (
                            <Empty text="No pending requests" />
                        )}
                    </SectionCard>

                    {/* Upcoming */}
                    <SectionCard title="Upcoming Tours">
                        {confirmedBookings.length > 0 ? (
                            confirmedBookings.map(RenderBooking)
                        ) : (
                            <Empty text="No upcoming tours" />
                        )}
                    </SectionCard>
                </TabsContent>

                {/* ---------------- BOOKINGS ---------------- */}
                <TabsContent value="bookings">
                    <SectionCard title="All Bookings">
                        {bookings.length > 0 ? (
                            bookings.map(RenderBooking)
                        ) : (
                            <Empty text="No bookings yet" />
                        )}
                    </SectionCard>
                </TabsContent>

                {/* ---------------- LISTINGS ---------------- */}
                <TabsContent value="listings">
                    <SectionCard title={`My Tours (${tours.length})`}>
                        {tours.length > 0 ? (
                            tours.map((tour) => (
                                <div
                                    key={tour.id}
                                    className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-muted/50 rounded-xl"
                                >
                                    <img
                                        src={tour.images?.[0]}
                                        alt={tour.title}
                                        className="w-full md:w-24 h-32 md:h-16 object-cover rounded-lg"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium">{tour.title}</h3>
                                            {tour.isActive ? (
                                                <Badge className="bg-secondary/20 text-secondary text-xs">Active</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-xs">Inactive</Badge>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {tour.city}, {tour.country}
                                            </span>
                                            <span>${tour.tourFee}/person</span>
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-accent text-accent" />
                                                {tour.avgRating || "0.0"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Link href={`/tours/${tour.id}`}>
                                            <Button variant="outline" size="icon">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>

                                        <Link href={`/dashboard/listings/${tour.id}/edit`}>
                                            <Button variant="outline" size="icon">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleToggleTourStatus(tour.id, tour.isActive)}
                                        >
                                            {tour.isActive ? (
                                                <ToggleRight className="w-4 h-4 text-secondary" />
                                            ) : (
                                                <ToggleLeft className="w-4 h-4" />
                                            )}
                                        </Button>

                                        <Button variant="outline" size="icon" className="text-destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Empty text="No tours yet" />
                        )}
                    </SectionCard>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default GuideDashboard;

/* -----------------------------------------
   REUSABLE COMPONENTS
------------------------------------------ */

const StatCard = ({ icon, label, value }: any) => (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">{icon}</div>
            <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <p className="font-display font-bold text-3xl">{value}</p>
    </div>
);

const SectionCard = ({ title, children }: any) => (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
        <h2 className="font-display font-semibold text-xl mb-4">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const Empty = ({ text }: any) => (
    <p className="text-muted-foreground text-center py-8">{text}</p>
);

const RenderBooking = (booking: any) => (
    <div
        key={booking.id}
        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 rounded-xl gap-4"
    >
        <div className="flex items-center gap-4">
            <Avatar>
                <AvatarImage src={booking.tourist?.image} />
                <AvatarFallback>{booking.tourist?.name?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div>
                <p className="font-medium">{booking.tourist?.name}</p>
                <p className="text-sm text-muted-foreground">{booking.listing?.title}</p>
                <p className="text-sm text-muted-foreground">
                    {new Date(booking.createdAt).toLocaleDateString()} • $
                    {booking.totalPrice}
                </p>
            </div>
        </div>

        {getStatusBadge(booking.status)}
    </div>
);

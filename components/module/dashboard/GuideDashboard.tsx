/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboard)/guide/page.tsx  (or wherever your GuideDashboard lives)
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Plus,
    Calendar,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    MapPin,
    Star,
    Edit,
    Trash2,
    Eye,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Link from "next/link";

/**
 * GuideDashboard
 *
 * Uses your existing API:
 * - GET  /api/bookings        -> returns bookings for the logged-in user (guide or tourist)
 * - PATCH /api/bookings/:id   -> update booking status (guide only)
 *
 * Note: guide must be logged-in and token must be provided by AuthContext.
 */

// small helpers
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
      default:
          return null;
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

    // fetch listings for guide (if you have an endpoint for that)
    const fetchTours = async () => {
        try {
            // If you have GET /api/listings/guide/:id use it; otherwise fallback to GET /api/listings and filter
            const guideListRes = await fetch(`${BASE_URL}/api/listings/guide/${guideId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });

            if (guideListRes.ok) {
                const json = await guideListRes.json();
                setTours(json?.data || []);
                return;
            }

            // fallback: fetch all listings and filter client-side (not recommended for production)
            const allRes = await fetch(`${BASE_URL}/api/listings`);
            if (allRes.ok) {
                const json = await allRes.json();
                const all = json?.data || [];
                setTours(all.filter((t: any) => t.guideId === guideId));
            }
        } catch (err) {
            console.error("Failed to load tours:", err);
        }
    };

    // fetch bookings for logged-in user (guide)
    const fetchBookings = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/bookings`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.message || "Failed to fetch bookings");
            }
            const json = await res.json();
            setBookings(json?.data || []);
        } catch (err) {
            console.error("Failed to load bookings:", err);
            toast.error("Failed to load bookings");
        }
    };

    useEffect(() => {
        if (!guideId || !token) return;

      setLoading(true);
      Promise.all([fetchTours(), fetchBookings()]).finally(() => setLoading(false));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideId, token]);

    // -----------------------
    // Booking status handlers
    // -----------------------
    // Guide should accept (CONFIRMED) or decline (CANCELLED) bookings.
    // Admin could also update if you allow that server-side, but here we implement guide actions.

    const updateBookingStatus = async (bookingId: string, status: "CONFIRMED" | "CANCELLED") => {
        if (!token) {
            toast.error("Not authenticated");
            return;
        }

        // optimistic UI: mark updating (optional)
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, __updating: true } : b)));

        try {
        const res = await fetch(`${BASE_URL}/api/bookings/${bookingId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });

        const json = await res.json().catch(() => ({}));

          if (!res.ok) {
              const message = json?.message || "Failed to update booking status";
              throw new Error(message);
          }

          // update local state with new status returned from server (json.data)
          const updated = json?.data ?? null;
          if (updated) {
              setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
          } else {
              // fallback: just update status locally
              setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));
          }

          toast.success(status === "CONFIRMED" ? "Booking confirmed" : "Booking cancelled");
      } catch (err: any) {
          console.error("Error updating booking:", err);
          toast.error(err?.message || "Could not update booking status");
          // remove optimistic flag
          setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, __updating: false } : b)));
      }
  };

    const handleAcceptBooking = (bookingId: string) => updateBookingStatus(bookingId, "CONFIRMED");
    const handleDeclineBooking = (bookingId: string) => updateBookingStatus(bookingId, "CANCELLED");

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
        );
    }

    // derived lists
    const pendingBookings = bookings.filter((b) => b.status === "PENDING");
    const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
    const completedBookings = bookings.filter((b) => b.status === "COMPLETED");

    const stats = {
        totalBookings: bookings.length,
        pendingBookings: pendingBookings.length,
      totalRevenue: completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      thisMonth: completedBookings
          .filter((b) => new Date(b.createdAt).getMonth() === new Date().getMonth())
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      rating:
          tours.length > 0 ? (tours.reduce((sum, t) => sum + (t.avgRating || 0), 0) / tours.length).toFixed(1) : "0.0",
      activeTours: tours.filter((t) => t.isActive).length,
  };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="font-display font-bold text-3xl mb-2">Welcome back, {user?.name?.split(" ")[0] || "Guide"}!</h1>
                  <p className="text-muted-foreground">Manage your tours, bookings, and earnings.</p>
              </div>

              <Link href="/dashboard/listings/new">
                  <Button className="gap-2 mt-4 md:mt-0">
                      <Plus className="w-4 h-4" /> Create New Tour
                  </Button>
              </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<Calendar className="w-5 h-5 text-primary" />} label="Total Bookings" value={stats.totalBookings} />
              <StatCard icon={<Clock className="w-5 h-5 text-accent" />} label="Pending" value={stats.pendingBookings} />
              <StatCard icon={<DollarSign className="w-5 h-5 text-secondary" />} label="Total Revenue" value={`$${stats.totalRevenue}`} />
              <StatCard icon={<Star className="w-5 h-5 text-primary" />} label="Rating" value={stats.rating} />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="bookings">All Bookings</TabsTrigger>
                  <TabsTrigger value="listings">My Listings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                  <SectionCard title="Pending Requests">
                      {pendingBookings.length > 0 ? pendingBookings.map((b) => (
                          <div key={b.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 rounded-xl gap-4">
                              <div className="flex items-center gap-4">
                                  <Avatar>
                                      <AvatarImage src={b.tourist?.image || b.tourist?.avatar || ""} />
                                      <AvatarFallback>{b.tourist?.name?.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                      <p className="font-medium">{b.tourist?.name}</p>
                                      <p className="text-sm text-muted-foreground">{b.listing?.title}</p>
                                      <p className="text-sm text-muted-foreground">{new Date(b.requestedDate).toLocaleDateString()} • ${b.totalPrice}</p>
                                  </div>
                              </div>

                              <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleDeclineBooking(b.id)}>Decline</Button>
                                  <Button size="sm" onClick={() => handleAcceptBooking(b.id)}>Accept</Button>
                              </div>
                          </div>
                      )) : <Empty text="No pending requests" />}
                  </SectionCard>

                  <SectionCard title="Upcoming Tours">
                      {confirmedBookings.length > 0 ? confirmedBookings.map((b) => (
                          <div key={b.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 rounded-xl gap-4">
                              <div className="flex items-center gap-4">
                                  <Avatar>
                                      <AvatarImage src={b.tourist?.image || ""} />
                                      <AvatarFallback>{b.tourist?.name?.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                      <p className="font-medium">{b.tourist?.name}</p>
                                      <p className="text-sm text-muted-foreground">{b.listing?.title}</p>
                                      <p className="text-sm text-muted-foreground">{new Date(b.requestedDate).toLocaleDateString()} • ${b.totalPrice}</p>
                                  </div>
                              </div>
                              {getStatusBadge(b.status)}
                          </div>
                      )) : <Empty text="No upcoming tours" />}
                  </SectionCard>
              </TabsContent>

              <TabsContent value="bookings">
                  <SectionCard title="All Bookings">
                      {bookings.length > 0 ? bookings.map((b) => (
                          <div key={b.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/50 rounded-xl gap-4">
                              <div className="flex items-center gap-4">
                                  <Avatar>
                                      <AvatarImage src={b.tourist?.image || ""} />
                                      <AvatarFallback>{b.tourist?.name?.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                      <p className="font-medium">{b.tourist?.name}</p>
                                      <p className="text-sm text-muted-foreground">{b.listing?.title}</p>
                                      <p className="text-sm text-muted-foreground">{new Date(b.requestedDate).toLocaleDateString()} • ${b.totalPrice}</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-3">
                                  {getStatusBadge(b.status)}
                              </div>
                          </div>
                      )) : <Empty text="No bookings yet" />}
                  </SectionCard>
              </TabsContent>

              <TabsContent value="listings">
                  <SectionCard title={`My Tours (${tours.length})`}>
                      {tours.length > 0 ? tours.map((tour) => (
                          <div key={tour.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-muted/50 rounded-xl">
                              <img src={tour.images?.[0] || "/placeholder.png"} alt={tour.title} className="w-full md:w-24 h-32 md:h-16 object-cover rounded-lg" />
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
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{tour.city}, {tour.country}</span>
                            <span>${tour.tourFee}/person</span>
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-accent text-accent" />{tour.avgRating || "0.0"}</span>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Link href={`/tours/${tour.id}`}>
                            <Button variant="outline" size="icon"><Eye className="w-4 h-4" /></Button>
                        </Link>
                        <Link href={`/dashboard/listings/${tour.id}/edit`}>
                            <Button variant="outline" size="icon"><Edit className="w-4 h-4" /></Button>
                        </Link>
                        {/* toggle handled elsewhere; ensure server route exists */}
                        <Button variant="outline" size="icon"><ToggleRight className="w-4 h-4 text-secondary" /></Button>
                        <Button variant="outline" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                </div>
            )) : <Empty text="No tours yet" />}
                  </SectionCard>
              </TabsContent>
          </Tabs>
      </div>
  );
};

export default GuideDashboard;

/* -------------------------
   Reusable small components
   ------------------------- */

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

const Empty = ({ text }: any) => <p className="text-muted-foreground text-center py-8">{text}</p>;

// app/(dashboard)/tourist/page.tsx  (or wherever your TouristDashboard lives)
"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Heart,
  Trash2,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { Booking, WishlistItem } from "@/types/index.type";
import { useRouter } from "next/navigation";

// ------------------------------------------
// API BASE URL
// ------------------------------------------
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const TouristDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  // ------------------------------------------------
  // FETCH BOOKINGS FROM REAL API (CORRECTED)
  // ------------------------------------------------
  const fetchBookings = useCallback(async () => {
    if (!token) return;
    try {
      // CORRECT endpoint: GET /api/bookings (returns bookings for auth user)
      const res = await fetch(`${BASE_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Bookings API error:", result);
        toast.error(result?.message || "Failed to load bookings");
        return;
      }

      // Backend returns bookings in result.data (your controller uses sendSuccess)
      setBookings(result.data ?? []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      toast.error("Failed to load bookings");
    }
  }, [token]);

  // ------------------------------------------------
  // FETCH WISHLIST  (if you later implement backend)
  // ------------------------------------------------
  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/wishlist`, {
      // I changed to GET /api/wishlist (no user id) — prefer server read from token.
      // If your backend requires /api/wishlist/:userId, change accordingly.
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (res.ok) setWishlist(result.data ?? []);
      else setWishlist([]);
    } catch {
      // fallback → empty wishlist in case API not implemented
      setWishlist([]);
    }
  }, [token]);

  // ------------------------------------------------
  // Load data on mount / when auth changes
  // ------------------------------------------------
  useEffect(() => {
    // wait for auth (user & token)
    if (!user || !token) {
      setBookings([]);
      setWishlist([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBookings(), fetchWishlist()]);
      if (mounted) setLoading(false);
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [user, token, fetchBookings, fetchWishlist]);

  // ------------------------------------------------
  // STATUS BADGES
  // ------------------------------------------------
  const getStatusBadge = (status: string | undefined) => {
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

  // ------------------------------------------------
  // Derived Lists
  // ------------------------------------------------
  const upcoming = bookings.filter(
    (b) =>
      (b.status === "PENDING" || b.status === "CONFIRMED") &&
      new Date(b.requestedDate) >= new Date(new Date().setHours(0, 0, 0, 0))
  );

  const past = bookings.filter(
    (b) => b.status === "COMPLETED" || new Date(b.requestedDate) < new Date(new Date().setHours(0, 0, 0, 0))
  );

  // ------------------------------------------------
  // Actions
  // ------------------------------------------------
  const cancelBooking = async (id: string) => {
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || "Failed to cancel booking");

      // update local state
      setBookings((prev) => prev.map((b) => (b.id === id ? result.data ?? { ...b, status: "CANCELLED" } : b)));
      toast.success("Booking cancelled");
    } catch (err) {
      console.error("cancelBooking error:", err);
      toast.error("Could not cancel booking");
    }
  };

  const removeWishlist = async (id: string) => {
    // adapt endpoint if you have DELETE /api/wishlist/:id
    setWishlist((prev) => prev.filter((w) => w.id !== id));
    toast.success("Removed from wishlist");
  };

  const handlePayment = async (bookingId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/payments/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Payment failed");
        return;
      }

      const { clientSecret } = result.data;


      // Redirect to Stripe payment element page
      router.push(`/pay?client_secret=${clientSecret}`);
    } catch (err) {
      console.error(err);
      toast.error("Payment initiation failed");
    }
  };


  // ------------------------------------------------
  // Booking Card UI
  // ------------------------------------------------
  const renderBookingCard = (b: Booking, allowCancel = false) => (
    <div key={b.id} className="flex flex-col md:flex-row gap-4 p-4 bg-muted/50 rounded-xl">
      <Image
        src={b.listing?.images?.[0] ?? "/placeholder.jpg"}
        alt={b.listing?.title ?? "Tour image"}
        width={120}
        height={90}
        className="rounded-lg object-cover"
      />

      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium">{b.listing?.title ?? "Unknown Tour"}</h3>

            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {b.listing?.city ?? "N/A"}, {b.listing?.country ?? ""}
            </p>
          </div>

          {getStatusBadge(b.status)}
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(b.requestedDate).toLocaleDateString()}
          </span>
          <span>{b.totalPrice} USD</span>
        </div>

        {/* GUIDE INFO */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={b.guide?.image ?? ""} />
            <AvatarFallback>{b.guide?.name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{b.guide?.name ?? "Unknown Guide"}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Star className="w-3 h-3 fill-accent text-accent" />
              {b.guide?.rating ?? "4.9"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-row md:flex-col gap-2">
        <Link href={`/tours/${b.listingId}`}>
          <Button variant="outline" size="sm">View Tour</Button>
        </Link>

        {allowCancel && b.status === "PENDING" && (
          <Button variant="outline" size="sm" className="text-destructive" onClick={() => cancelBooking(b.id)}>
            Cancel
          </Button>
        )}

        {b.status === "COMPLETED" && (
          <Button variant="outline" size="sm">Write Review</Button>
        )}
        {b.status === "CONFIRMED" && (
          <Button
            className="bg-primary text-white"
            onClick={() => handlePayment(b.id)}
          >
            Pay Now
          </Button>
        )}

      </div>
    </div>
  );

  // ------------------------------------------------
  // LOADING STATE
  // ------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  // ------------------------------------------------
  // MAIN UI
  // ------------------------------------------------
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">Welcome back, {user?.name?.split(" ")[0] ?? "Traveler"}!</h1>
          <p className="text-muted-foreground">Manage trips, wishlist, and discover new tours.</p>
        </div>

        <Link href="/explore">
          <Button className="gap-2 mt-4 md:mt-0">
            <Search className="w-4 h-4" />
            Find Tours
          </Button>
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard icon={<Calendar className="w-5 h-5 text-primary" />} title="Upcoming Trips" value={upcoming.length} />
        <DashboardStatCard icon={<CheckCircle className="w-5 h-5 text-secondary" />} title="Completed Tours" value={past.length} />
        <DashboardStatCard icon={<Heart className="w-5 h-5 text-accent" />} title="Wishlist" value={wishlist.length} />
        <DashboardStatCard icon={<MapPin className="w-5 h-5 text-primary" />} title="Cities Visited" value={new Set(past.map((b) => b.listing?.city)).size} />
      </div>

      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
          <TabsTrigger value="past">Past Trips</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        {/* UPCOMING */}
        <TabsContent value="upcoming">
          <DashboardSection title="Upcoming Trips" count={upcoming.length}>
            {upcoming.length ? upcoming.map((b) => renderBookingCard(b, true)) : (
              <EmptyState icon={<MapPin className="w-12 h-12 text-muted-foreground/50" />} text="No upcoming trips" buttonText="Explore Tours" />
            )}
          </DashboardSection>
        </TabsContent>

        {/* PAST */}
        <TabsContent value="past">
          <DashboardSection title="Past Trips" count={past.length}>
            {past.length ? past.map((b) => renderBookingCard(b)) : (
              <EmptyState icon={<Calendar className="w-12 h-12 text-muted-foreground/50" />} text="No past trips yet" />
            )}
          </DashboardSection>
        </TabsContent>

        {/* WISHLIST */}
        <TabsContent value="wishlist">
          <DashboardSection title="Wishlist" count={wishlist.length}>
            {wishlist.length ? wishlist.map((item) => (
              <WishlistCard key={item.id} item={item} onRemove={removeWishlist} />
            )) : (
              <EmptyState icon={<Heart className="w-12 h-12 text-muted-foreground/50" />} text="Your wishlist is empty" buttonText="Explore Tours" />
            )}
          </DashboardSection>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TouristDashboard;

// ----------------------------------------------------------------------
// Shared UI COMPONENTS
// ----------------------------------------------------------------------

const DashboardStatCard = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: number; }) => (
  <div className="bg-card rounded-2xl p-6 shadow-soft">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">{icon}</div>
      <span className="text-sm text-muted-foreground">{title}</span>
    </div>
    <p className="font-display font-bold text-3xl">{value}</p>
  </div>
);

const DashboardSection = ({ title, count, children }: { title: string; count: number; children: React.ReactNode; }) => (
  <div className="bg-card rounded-2xl p-6 shadow-soft">
    <h2 className="font-display font-semibold text-xl mb-4">{title} ({count})</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const WishlistCard = ({ item, onRemove }: { item: WishlistItem; onRemove: (id: string) => void; }) => (
  <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/50 rounded-xl">
    <Image src={item.tour.images[0]} alt={item.tour.title} width={120} height={90} className="rounded-lg object-cover" />
    <div className="flex-1">
      <h3 className="font-medium">{item.tour.title}</h3>
      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{item.tour.location}</p>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.tour.durationDays}</div>
        <div className="flex items-center gap-1"><Star className="w-3 h-3 fill-accent text-accent" />{item.tour.rating}</div>
        <span className="font-medium">${item.tour.tourFee}</span>
      </div>
    </div>
    <div className="flex gap-2">
      <Link href={`/tours/${item.tourId}`}><Button size="sm">Book Now</Button></Link>
      <Button variant="outline" size="icon" className="text-destructive" onClick={() => onRemove(item.id)}><Trash2 className="w-4 h-4" /></Button>
    </div>
  </div>
);

const EmptyState = ({ icon, text, buttonText }: { icon: React.ReactNode; text: string; buttonText?: string; }) => (
  <div className="text-center py-12">
    <div className="mx-auto mb-4">{icon}</div>
    <p className="text-muted-foreground mb-4">{text}</p>
    {buttonText && <Link href="/explore"><Button>{buttonText}</Button></Link>}
  </div>
);

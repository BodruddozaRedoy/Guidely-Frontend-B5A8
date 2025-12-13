/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    Users, MapPin, Calendar, DollarSign, Search, Eye, Ban, CheckCircle,
    XCircle, Clock, Edit, Trash2, TrendingUp, Shield, AlertTriangle,
    ToggleRight,
    ToggleLeft
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminDashboard() {
    const { token, user } = useAuth();

    // DATA STATES
    const [users, setUsers] = useState<any[]>([]);
    const [tours, setTours] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // SEARCH STATES
    const [userSearch, setUserSearch] = useState("");
    const [tourSearch, setTourSearch] = useState("");
    const [bookingSearch, setBookingSearch] = useState("");

    const [activeTab, setActiveTab] = useState("overview");

    // -------------------------------------------------------
    // FETCH DATA
    // -------------------------------------------------------
    const fetchAdminData = async () => {
        try {
            const [uRes, tRes, bRes] = await Promise.all([
                fetch(`${BASE_URL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/api/admin/tours`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/api/admin/bookings`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
            ]);

            const usersData = await uRes.json();
            const toursData = await tRes.json();
            const bookingsData = await bRes.json();

            setUsers(usersData.data || []);
            setTours(toursData.data || []);
            setBookings(bookingsData.data || []);

        } catch (err) {
            console.error(err);
            toast.error("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && user?.role === "ADMIN") {
            fetchAdminData();
        }
    }, [token]);

    if (loading)
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-muted-foreground">Loading admin dashboard...</p>
            </div>
        );

    // -------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="outline" className="gap-1 border-accent text-accent"><Clock className="w-3 h-3" />Pending</Badge>;
            case "CONFIRMED":
                return <Badge className="gap-1 bg-secondary text-secondary-foreground"><CheckCircle className="w-3 h-3" />Confirmed</Badge>;
            case "COMPLETED":
                return <Badge variant="outline" className="gap-1 text-muted-foreground"><CheckCircle className="w-3 h-3" />Completed</Badge>;
            case "CANCELLED":
                return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Cancelled</Badge>;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "GUIDE":
                return <Badge className="bg-primary text-primary-foreground">Guide</Badge>;
            case "TOURIST":
                return <Badge variant="outline">Tourist</Badge>;
            case "ADMIN":
                return <Badge className="bg-destructive text-destructive-foreground">Admin</Badge>;
        }
    };

    // -------------------------------------------------------
    // ACTIONS
    // -------------------------------------------------------

    // BAN USER
    const handleBanUser = async (id: string) => {
        try {
            const res = await fetch(`${BASE_URL}/api/admin/users/${id}/ban`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to ban user");

            toast.success("User banned");
            fetchAdminData();
        } catch (err) {
            toast.error("Ban failed");
        }
    };

    // DELETE TOUR
    const handleDeleteTour = async (id: string) => {
        try {
            const res = await fetch(`${BASE_URL}/api/admin/tours/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to delete tour");

            toast.success("Tour deleted");
            setTours((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            toast.error("Could not delete tour");
        }
    };

    // CANCEL BOOKING
    const handleCancelBooking = async (id: string) => {
        try {
            const res = await fetch(`${BASE_URL}/api/admin/bookings/${id}/cancel`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to cancel booking");

            toast.success("Booking cancelled");
            fetchAdminData();
        } catch (err) {
            toast.error("Cancel failed");
        }
    };

    const handleToggleTourStatus = async (tourId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`${BASE_URL}/api/listings/${tourId}/toggle`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed");

            // update local state
            setTours(prev =>
                prev.map(t => t.id === tourId ? { ...t, isActive: !currentStatus } : t)
            );

            toast.success(
                currentStatus ? "Tour deactivated" : "Tour activated"
            );
        } catch (error) {
            toast.error("Could not update tour status");
        }
    };


    // -------------------------------------------------------
    // FILTERS
    // -------------------------------------------------------
    const filteredUsers = users.filter((u) =>
        `${u.name}${u.email}`.toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredTours = tours.filter((t) =>
        `${t.title}${t.city}${t.country}`.toLowerCase().includes(tourSearch.toLowerCase())
    );

    const filteredBookings = bookings.filter((b) =>
        `${b.listing?.title}${b.tourist?.name}${b.guide?.name}`
            .toLowerCase()
            .includes(bookingSearch.toLowerCase())
    );

    // -------------------------------------------------------
    // STATS
    // -------------------------------------------------------
    const stats = {
        totalUsers: users.length,
        guides: users.filter((u) => u.role === "GUIDE").length,
        tourists: users.filter((u) => u.role === "TOURIST").length,
        totalTours: tours.length,
        activeTours: tours.filter((t) => t.isActive).length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === "PENDING").length,
        revenue: bookings
            .filter((b) => b.status === "COMPLETED")
            .reduce((sum, b) => sum + b.totalPrice, 0),
    };

    // -------------------------------------------------------
    // RETURN UI (Same UI as you provided, but data is now REAL)
    // -------------------------------------------------------

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-3xl mb-2 flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary" />
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground">Platform insights & control</p>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users />} label="Users" value={stats.totalUsers} desc={`${stats.guides} guides • ${stats.tourists} tourists`} />
                <StatCard icon={<MapPin />} label="Tours" value={stats.totalTours} desc={`${stats.activeTours} active`} />
                <StatCard icon={<Calendar />} label="Bookings" value={stats.totalBookings} desc={`${stats.pendingBookings} pending`} />
                <StatCard icon={<DollarSign />} label="Revenue" value={`$${stats.revenue}`} desc="Completed payments" />
            </div>

            {/* TABS */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="tours">Tours</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                </TabsList>

                {/* --- USERS TAB --- */}
                <TabsContent value="users">
                    <UsersTab
                        users={filteredUsers}
                        userSearch={userSearch}
                        setUserSearch={setUserSearch}
                        getRoleBadge={getRoleBadge}
                        handleBanUser={handleBanUser}
                    />
                </TabsContent>

                {/* --- TOURS TAB --- */}
                <TabsContent value="tours">
                    <ToursTab
                        tours={filteredTours}
                        tourSearch={tourSearch}
                        setTourSearch={setTourSearch}
                        handleDeleteTour={handleDeleteTour}
                        handleToggleTourStatus={handleToggleTourStatus}
                    />
                </TabsContent>

                {/* --- BOOKINGS TAB --- */}
                <TabsContent value="bookings">
                    <BookingsTab
                        bookings={filteredBookings}
                        bookingSearch={bookingSearch}
                        setBookingSearch={setBookingSearch}
                        getStatusBadge={getStatusBadge}
                        handleCancelBooking={handleCancelBooking}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

/* ---------------- COMPONENTS BELOW (StatCard, Tabs etc.) ---------------- */

const StatCard = ({ icon, label, value, desc }: any) => (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">{icon}</div>
            <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <p className="font-display font-bold text-3xl">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
);

// ========= USERS TAB =========
const UsersTab = ({ users, userSearch, setUserSearch, getRoleBadge, handleBanUser }: any) => (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl">Users ({users.length})</h2>
            <Input
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-64"
            />
        </div>

        <div className="space-y-3">
            {users.map((u: any) => (
                <div key={u.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={u.image} />
                            <AvatarFallback>{u.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                            <p className="text-xs text-muted-foreground">
                                Joined {new Date(u.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {getRoleBadge(u.role)}
                        {/* <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleBanUser(u.id)}>
                            Ban
                        </Button> */}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ========= TOURS TAB =========
const ToursTab = ({ tours, tourSearch, setTourSearch, handleDeleteTour, handleToggleTourStatus }: any) => {
    const router = useRouter()
    return (
        <div className="bg-card rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-xl">Tours ({tours.length})</h2>
                <Input
                    placeholder="Search tours..."
                    value={tourSearch}
                    onChange={(e) => setTourSearch(e.target.value)}
                    className="w-64"
                />
            </div>

            <div className="space-y-3">
                {tours.map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <div className="flex items-center gap-4">
                            <Image
                                src={t.images?.[0] ?? "/placeholder.jpg"}
                                alt={t.title}
                                width={70}
                                height={50}
                                className="object-cover rounded-md"
                            />
                            <div>
                                <h3 className="font-medium">{t.title}</h3>
                                <p className="text-xs text-muted-foreground">
                                    {t.city}, {t.country}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={() => router.push(`/tours/${t.id}`)} variant="outline" size="icon">
                                <Eye className="w-4 h-4" />
                            </Button>
                            {/* <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteTour(t.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button> */}
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleToggleTourStatus(t.id, t.isActive)}
                            >
                                {t.isActive ? (
                                    <ToggleRight className="w-4 h-4 text-secondary" />
                                ) : (
                                    <ToggleLeft className="w-4 h-4" />
                                )}
                            </Button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

// ========= BOOKINGS TAB =========
const BookingsTab = ({ bookings, bookingSearch, setBookingSearch, getStatusBadge, handleCancelBooking }: any) => (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl">Bookings ({bookings.length})</h2>
            <Input
                placeholder="Search bookings..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-64"
            />
        </div>

        <div className="space-y-3">
            {bookings.map((b: any) => (
                <div key={b.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                        <h3 className="font-medium">{b.listing?.title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {b.tourist?.name} → {b.guide?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {new Date(b.requestedDate).toLocaleDateString()} • ${b.totalPrice}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {getStatusBadge(b.status)}

                        {b.status === "PENDING" && (
                            <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleCancelBooking(b.id)}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

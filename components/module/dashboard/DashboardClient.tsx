"use client";

import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

import AdminDashboard from '@/components/module/dashboard/AdminDashboard';
import GuideDashboard from '@/components/module/dashboard/GuideDashboard';
import TouristDashboard from '@/components/module/dashboard/TouristDashboard';

export default function DashboardClient() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="font-display font-bold text-2xl mb-4">
                    Please log in to access your dashboard
                </h1>
                <p className="text-muted-foreground mb-6">
                    You need to be logged in to view this page.
                </p>
                <Link href="/login">
                    <Button className="gap-2">
                        <LogIn className="w-4 h-4" />
                        Log In
                    </Button>
                </Link>
            </div>
        );
    }

    const renderDashboard = () => {
        switch (user?.role) {
            case "ADMIN":
                return <AdminDashboard />;
            case "GUIDE":
                return <GuideDashboard />;
            case "TOURIST":
            default:
                return <TouristDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-8">
                {renderDashboard()}
            </div>
        </div>
    );
}

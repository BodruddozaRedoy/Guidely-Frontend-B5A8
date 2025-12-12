"use client";

import Link from "next/link";
// import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
    DollarSign,
    Clock,
    Users,
    Award,
    Globe,
    Shield,
    CheckCircle,
    ArrowRight,
    Star,
} from "lucide-react";
import Image from "next/image";

const benefits = [
    {
        icon: DollarSign,
        title: "Set Your Own Rates",
        description: "You decide how much to charge. Keep 85% of every booking.",
    },
    {
        icon: Clock,
        title: "Flexible Schedule",
        description: "Work when you want. Accept bookings that fit your life.",
    },
    {
        icon: Users,
        title: "Meet Amazing People",
        description: "Connect with travelers from 120+ countries worldwide.",
    },
    {
        icon: Award,
        title: "Build Your Reputation",
        description: "Earn badges and climb the ranks to become a Super Guide.",
    },
    {
        icon: Globe,
        title: "Global Exposure",
        description: "Get discovered by thousands of travelers searching daily.",
    },
    {
        icon: Shield,
        title: "Secure Payments",
        description: "Get paid safely and on time, every time. 24/7 support.",
    },
];

const steps = [
    {
        number: "01",
        title: "Create Your Profile",
        description:
            "Tell us about yourself, your expertise, and the languages you speak.",
    },
    {
        number: "02",
        title: "Design Your Tours",
        description:
            "Create unique experiences that showcase the best of your city.",
    },
    {
        number: "03",
        title: "Get Verified",
        description: "Complete a quick verification to build trust with travelers.",
    },
    {
        number: "04",
        title: "Start Earning",
        description: "Accept bookings and share your passion with the world.",
    },
];

const testimonials = [
    {
        name: "Maria Santos",
        location: "Lisbon, Portugal",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
        quote:
            "LocalGuide changed my life. I went from giving occasional tours to friends to earning a full-time income doing what I love.",
        earnings: "$2,400/month",
    },
    {
        name: "Kenji Tanaka",
        location: "Tokyo, Japan",
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        quote:
            "The platform makes everything easy—from managing bookings to getting paid. I can focus on creating amazing experiences.",
        earnings: "$3,100/month",
    },
];

const BecomeGuide = () => {
    return (
        <>
            {/* HERO */}
            <section className="relative min-h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920"
                        alt="Become a guide"
                        fill
                        className="object-cover"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl">
                        <h1 className="font-display font-bold text-5xl md:text-6xl text-primary-foreground mb-6">
                            Turn Your Passion Into Profit
                        </h1>
                        <p className="text-xl text-primary-foreground/80 mb-8">
                            Share your citys hidden gems, meet travelers from around the
                            world, and earn money doing what you love.
                        </p>

                        {/* CTA BUTTONS */}
                        <div className="flex flex-wrap gap-4">
                            <Link href="/register?role=guide">
                                <Button size="xl" className="gap-2">
                                    Start Guiding Today
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>

                            <Button size="xl" variant="glass">
                                Watch How It Works
                            </Button>
                        </div>

                        {/* STATS */}
                        <div className="flex flex-wrap gap-8 mt-12">
                            <div className="text-primary-foreground">
                                <div className="font-display font-bold text-4xl">$850</div>
                                <div className="text-primary-foreground/70 text-sm">
                                    Avg. monthly earnings
                                </div>
                            </div>

                            <div className="text-primary-foreground">
                                <div className="font-display font-bold text-4xl">2.5K+</div>
                                <div className="text-primary-foreground/70 text-sm">
                                    Active guides
                                </div>
                            </div>

                            <div className="text-primary-foreground">
                                <div className="font-display font-bold text-4xl">120+</div>
                                <div className="text-primary-foreground/70 text-sm">
                                    Cities worldwide
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENEFITS */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
                            Why Guide with Us?
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Join a community of passionate locals making a difference in how
                            people travel.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={benefit.title}
                                className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 animate-fade-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                    <benefit.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-display font-semibold text-xl mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-muted-foreground">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
                            Getting Started is Easy
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            From sign up to your first booking in just a few simple steps.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={step.number} className="relative">
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-primary/10" />
                                )}

                                <div className="bg-card rounded-2xl p-8 shadow-soft relative">
                                    <div className="font-display font-bold text-6xl text-primary/10 mb-4">
                                        {step.number}
                                    </div>
                                    <h3 className="font-display font-semibold text-xl mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
                            Hear From Our Guides
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Real stories from guides who turned their passion into a thriving
                            business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.name}
                                className="bg-card rounded-2xl p-8 shadow-soft"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-display font-semibold">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.location}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-muted-foreground mb-6">
                                    {testimonial.quote}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-border">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-4 h-4 fill-accent text-accent"
                                            />
                                        ))}
                                    </div>
                                    <div className="text-right">
                                        <div className="font-display font-bold text-primary">
                                            {testimonial.earnings}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            avg. earnings
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-20 bg-gradient-to-br from-primary to-secondary">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-display font-bold text-3xl md:text-4xl text-primary-foreground mb-6">
                        Ready to Share Your City?
                    </h2>
                    <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                        Join thousands of guides already earning on LocalGuide. It takes
                        less than 10 minutes to get started.
                    </p>

                    <Link href="/register?role=guide">
                        <Button size="xl" variant="accent" className="gap-2">
                            Become a Guide
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>

                    <div className="flex justify-center gap-8 mt-12 text-primary-foreground/80 text-sm">
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Free to join
                        </span>
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            No commitments
                        </span>
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            24/7 support
                        </span>
                    </div>
                </div>
            </section>
        </>
    );
};

export default BecomeGuide;

import { Search, CalendarCheck, Compass, Star } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: 'Find Your Experience',
        description: 'Browse tours by destination, category, or let our guides inspire you with unique local perspectives.',
    },
    {
        icon: CalendarCheck,
        title: 'Book Instantly',
        description: 'Choose your date and group size. Secure booking with flexible cancellation options.',
    },
    {
        icon: Compass,
        title: 'Meet Your Guide',
        description: 'Connect with a passionate local who knows all the hidden gems and stories.',
    },
    {
        icon: Star,
        title: 'Share Your Story',
        description: 'Leave a review and help fellow travelers discover amazing experiences.',
    },
];

const HowItWorksSection = () => {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
                        How It Works
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        From discovery to unforgettable memories, we make it simple.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={step.title}
                            className="relative text-center animate-fade-up"
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 right-[-50%] w-full h-[2px] bg-gradient-to-r from-primary/40 to-primary/10" />
                            )}


                            {/* Step Number */}
                            <div className="relative mx-auto w-24 h-24 mb-6">
                                <div className="absolute inset-0 bg-primary/10 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform" />
                                <div className="relative bg-card rounded-2xl w-full h-full flex items-center justify-center shadow-soft">
                                    <step.icon className="w-10 h-10 text-primary" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-display font-bold flex items-center justify-center text-sm">
                                    {index + 1}
                                </div>
                            </div>

                            <h3 className="font-display font-semibold text-xl mb-3">
                                {step.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;

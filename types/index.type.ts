export type UserRole = "TOURIST" | "GUIDE" | "ADMIN";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  languages: string[];
  createdAt: Date;
}

export interface Guide extends User {
  role: "GUIDE";
  expertise: string[];
  dailyRate: number;
  rating: number;
  totalReviews: number;
  totalTours: number;
  location: string;
  verified: boolean;
}

export interface Tour {
  id: string;
  guideId: string;
  guide?: Guide;
  title: string;
  description: string;
  itinerary: string[];
  price: number;
  duration: string;
  maxGroupSize: number;
  meetingPoint: string;
  category: string;
  images: string[];
  rating: number;
  totalReviews: number;
  location: string;
  featured?: boolean;
  active?: boolean;
}

export interface Booking {
  id: string;
  tourId: string;
  tour?: Tour;
  touristId: string;
  tourist?: User;
  guideId: string;
  guide?: Guide;
  date: Date;
  status: BookingStatus;
  totalPrice: number;
  groupSize: number;
  createdAt: Date;
}

export interface Review {
  id: string;
  tourId: string;
  tour?: Tour;
  touristId: string;
  tourist?: User;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface SearchFilters {
  destination?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  language?: string;
  date?: Date;
}

export interface WishlistItem {
  id: string;
  tourId: string;
  tour: Tour;
  addedAt: Date;
}

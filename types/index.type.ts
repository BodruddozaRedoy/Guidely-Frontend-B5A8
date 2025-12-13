// =========================================
// ENUMS
// =========================================

export type UserRole = "TOURIST" | "GUIDE" | "ADMIN";

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

// =========================================
// USER MODELS
// =========================================

export interface User {
  id: string;
  name: string | null;
  email: string | null;

  image?: string | null; // From Prisma "image"
  profilePic?: string | null; // Custom field
  bio?: string | null;

  role: UserRole;

  languages: string[]; // For all users
  expertise?: string[]; // Only for GUIDE
  dailyRate?: number; // Only for GUIDE
  travelPreferences?: string | null;

  createdAt: string; // From backend ISO date string
  updatedAt: string;
}

// =========================================
// GUIDE (EXTENDS USER)
// =========================================

export interface Guide extends User {
  role: "GUIDE";

  expertise: string[];
  dailyRate: number;

  // Computed fields returned by API
  rating?: number;
  totalReviews?: number;
  totalTours?: number;

  verified?: boolean;
  location?: string;
}

// =========================================
// LISTING (CALLED "TOUR" ON UI)
// =========================================
//
// Matches Prisma model:
// id, title, description, itinerary, tourFee,
// durationDays, meetingPoint, maxGroupSize,
// city, country, language, category, images, guideId
// -----------------------------------------

export interface Tour {
  id: string;

  guideId: string;
  guide?: Guide;

  title: string;
  description: string;
  itinerary: string[];

  tourFee: number; // Prisma field
  durationDays: number; // Prisma field
  meetingPoint: string | null;

  maxGroupSize: number;

  city: string;
  country?: string | null;

  language: string;
  category: string;

  images: string[];

  // Optional/computed API data
  reviews?: number;
  totalReviews?: number;
  location?: string;
  featured?: boolean;
  active?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

// =========================================
// BOOKING
// =========================================
//
// Prisma fields:
// id, listingId, touristId, guideId,
// requestedDate, status, totalPrice
// -----------------------------------------

export interface Booking {
  id: string;

  listingId: string;
  listing?: Tour;

  touristId: string;
  tourist?: User;

  guideId: string;
  guide?: Guide;

  requestedDate: string; // ISO date string
  status: BookingStatus;

  totalPrice: number;

  // Optional UI fields (not stored in DB)
  groupSize?: number;

  createdAt: string;
  updatedAt?: string;
}

// =========================================
// REVIEW
// =========================================
//
// Prisma:
// id, rating, comment, listingId, guideId, touristId
// -----------------------------------------

export interface Review {
  id: string;

  listingId: string;
  listing?: Tour;

  guideId: string;
  touristId: string;
  tourist?: User;

  rating: number;
  comment?: string;

  createdAt: string;
}

// =========================================
// SEARCH FILTERS
// =========================================

export interface SearchFilters {
  destination?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  language?: string;
  date?: string; // ISO date
}

// =========================================
// WISHLIST
// =========================================

export interface WishlistItem {
  id: string;
  tourId: string;
  tour: Tour;
  addedAt: string;
}

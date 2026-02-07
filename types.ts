export interface City {
  id: string;
  name: string;
  country: string;
  safetyScore: number;
  popularityScore: number;
  imageUrl: string;
}

export interface Interest {
  id: string;
  label: string;
  icon: string;
}

export interface Guide {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  pricePerHour: number;
  currency: string;
  tags: string[];
  bio: string;
  languages: string[];
  specialties: string[];
  heroImageUrl: string;
  toursCompleted: number;
  responseTime: string;
  experienceYears: number;
  tourPackages: TourPackage[];
  whatsappNumber: string;
}

export interface TourPackage {
  id: string;
  title: string;
  duration: string;
  price: number;
  currency: string;
  description: string;
}

export interface Place {
  id: string;
  name: string;
  imageUrl: string;
  safetyScore: number;
  rating?: number;
  tags: string[];
  description?: string;
}

export type SafetyLevel = "safe" | "warning" | "danger";

export interface TimelineStop {
  id: string;
  title: string;
  time: string;
  imageUrl: string;
  safetyLevel: SafetyLevel;
  safetyScore: number;
  tags: string[];
  instaWorthy?: boolean;
  walkingTime?: string;
  walkingTerrain?: string;
  aiNote?: string;
  visibility?: string;
  crowdLevel?: string;
}

export interface Itinerary {
  id: string;
  cityId: string;
  cityName: string;
  title: string;
  stops: TimelineStop[];
  totalSafetyScore: number;
  totalDuration: string;
  estimatedCost: string;
  previewImageUrl: string;
  createdAt: string;
}

export interface TrendingExperience {
  id: string;
  title: string;
  imageUrl: string;
  safetyScore: number;
  tags: string[];
}

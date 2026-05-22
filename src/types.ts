export interface ElementSymbol {
  symbol: string;
  name: string;
  category: "Music" | "Culture" | "Sports" | "Business" | "Guests";
  description: string;
  atomicMass: number; // e.g., representing the index or weighting
  colorClass: string;
  bgGradient: string;
  glowColor: string;
}

export interface PodcastEpisode {
  id: string;
  number: string;
  title: string;
  description: string;
  duration: string;
  audioUrl: string;
  date: string;
  ratingIndex?: number; // 1-118
  elements: string[]; // e.g. ["Hm", "Hb"]
  actStructure: {
    crucible: string;
    baseMetals: string;
    reaction: string;
    transmutation: string;
    goldStandard: string;
    residue: string;
  };
  featuredGuest?: string;
}

export interface AlbumReview {
  id: string;
  artist: string;
  album: string;
  releaseYear: number;
  overallScore: number; // 1-118 scale
  ratings: {
    Lr: number; // Lyricism (1-118)
    Pr: number; // Production (1-118)
    Cw: number; // Cultural Weight (1-118)
    Rv: number; // Replay Value (1-118)
    Ch: number; // Cohesion (1-118)
  };
  reviewText: string;
  transmutedValue: string; // "Raw Potential", "Refined Chemistry", or "Pure Gold"
  releaseCover: string;
}

export interface GuestProfile {
  id: string;
  name: string;
  type: "Catalyst" | "Compound" | "Reagent" | "Base";
  role: string;
  bio: string;
  elementSymbol: string; // e.g., "Hg" with some subscript
  profileImage: string;
  currentTransmutation: string; // what they are transmuting right now
  pastEpisodeNumber?: string;
  socials: { twitter?: string; instagram?: string; website?: string };
}

export interface MarketItem {
  id: string;
  name: string;
  price: string;
  category: "Lab Equipment" | "Apparel" | "Print";
  imagePrompt: string;
  imageUrl?: string;
  description: string;
  purityBadge: string;
}

export interface BusinessListing {
  id: string;
  name: string;
  ownerName: string;
  hustleCategory: string;
  shoutoutVoiceNote?: string;
  description: string;
  formulaTip: string;
  location: string;
  link: string;
}

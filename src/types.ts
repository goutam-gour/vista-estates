export type PropertyStatus = "Available" | "Pending" | "Sold" | "Rented";
export type Purpose = "buy" | "rent";

export interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  propertyType: string;
  purpose: Purpose;
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: number;
  status: PropertyStatus;
  verified: boolean;
  featured: boolean;
  yearBuilt: number;
  description: string;
  amenities: string[];
  features: string[];
  images: string[];
  agentId: string;
  lat: number;
  lng: number;
  dateAdded: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  listings: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string; // stored in plain text for demo only — never do this in production
  role: "admin" | "user";
  joined: string;
}

export interface Enquiry {
  id: string;
  type: "enquiry" | "visit";
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  visitDate?: string;
  visitTime?: string;
  status: "New" | "Responded";
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  date: string;
}

export interface PropertyReport {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reason: string;
  details?: string;
  date: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
}

export type ToastKind = "success" | "error" | "info";
export interface Toast {
  id: string;
  kind: ToastKind;
  message: string;
}

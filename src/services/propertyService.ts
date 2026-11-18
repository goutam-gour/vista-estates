
import type { Property } from "../types";

const API_URL = "http://localhost:5000/api";

interface BackendProperty {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  propertyType: string;
  purpose: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  parking?: number;
  status?: Property["status"];
  verified?: boolean;
  featured?: boolean;
  yearBuilt?: number;
  amenities?: string[];
  features?: string[];
  images?: string[];
  agent?: string | { _id: string };
  lat?: number;
  lng?: number;
  createdAt?: string;
  updatedAt?: string;
}

function mapProperty(item: BackendProperty): Property {
  const agentId =
    typeof item.agent === "object" && item.agent !== null
      ? item.agent._id
      : item.agent || "";

  return {
    id: item._id,
    title: item.title,
    location: item.location || "",
    city: item.city || "",
    price: Number(item.price) || 0,
    propertyType: item.propertyType || "House",
    purpose: item.purpose?.toLowerCase() === "rent" ? "rent" : "buy",
    bedrooms: Number(item.bedrooms) || 0,
    bathrooms: Number(item.bathrooms) || 0,
    area: Number(item.area) || 0,
    parking: Number(item.parking) || 0,
    status: item.status || "Available",
    verified: Boolean(item.verified),
    featured: Boolean(item.featured),
    yearBuilt: Number(item.yearBuilt) || 0,
    description: item.description || "",
    amenities: Array.isArray(item.amenities) ? item.amenities : [],
    features: Array.isArray(item.features) ? item.features : [],
    images: Array.isArray(item.images) ? item.images : [],
    agentId,
    lat: Number(item.lat) || 0,
    lng: Number(item.lng) || 0,
    dateAdded: item.createdAt || item.updatedAt || new Date().toISOString(),
  };
}

export async function getPropertiesAPI(): Promise<Property[]> {
  const response = await fetch(`${API_URL}/properties`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to load properties");
  }

  return (data.properties || []).map(mapProperty);
}


function getToken(): string {
  const token =
    localStorage.getItem("vista_token") ||
    sessionStorage.getItem("vista_token");

  if (!token) {
    throw new Error("Please login again. Your session has expired.");
  }

  return token;
}

async function readResponse(response: Response) {
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Property request failed");
  }

  return data;
}

async function makeFormData(property: Property) {
  const formData = new FormData();

  formData.append("title", property.title);
  formData.append("description", property.description);
  formData.append("price", String(property.price));
  formData.append("location", property.location);
  formData.append("city", property.city);
  formData.append("propertyType", property.propertyType);
  formData.append(
    "purpose",
    property.purpose === "rent" ? "Rent" : "Buy"
  );
  formData.append("bedrooms", String(property.bedrooms));
  formData.append("bathrooms", String(property.bathrooms));
  formData.append("area", String(property.area));
  formData.append("parking", String(property.parking));
  formData.append("status", property.status);
  formData.append("verified", String(property.verified));
  formData.append("featured", String(property.featured));
  formData.append("yearBuilt", String(property.yearBuilt));
  formData.append("amenities", JSON.stringify(property.amenities));
  formData.append("features", JSON.stringify(property.features));
  formData.append("lat", String(property.lat));
  formData.append("lng", String(property.lng));

  // Only send an agent ID if it is a real MongoDB ObjectId.
  if (/^[a-f\d]{24}$/i.test(property.agentId)) {
    formData.append("agent", property.agentId);
  }

  // Keep existing Cloudinary images during editing.
  const existingImages = property.images.filter((image) =>
    /^https?:\/\//i.test(image)
  );

  formData.append("keepImages", JSON.stringify(existingImages));

  // Convert selected local image assets into actual files.
  const localImages = property.images.filter(
    (image) => !/^https?:\/\//i.test(image)
  );

  for (let i = 0; i < localImages.length; i++) {
    const imageResponse = await fetch(localImages[i]);

    if (!imageResponse.ok) {
      throw new Error("Unable to read selected property image");
    }

    const blob = await imageResponse.blob();

    const file = new File(
      [blob],
      `property-${Date.now()}-${i}.jpg`,
      { type: blob.type || "image/jpeg" }
    );

    formData.append("images", file);
  }

  return formData;
}

export async function createPropertyAPI(property: Property) {
  const formData = await makeFormData(property);

  const response = await fetch(`${API_URL}/properties`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  return readResponse(response);
}

export async function updatePropertyAPI(property: Property) {
  const formData = await makeFormData(property);

  const response = await fetch(
    `${API_URL}/properties/${property.id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    }
  );

  return readResponse(response);
}

export async function deletePropertyAPI(id: string) {
  const response = await fetch(`${API_URL}/properties/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return readResponse(response);
}

// ===============================
// FAVORITES APIs
// ===============================

// Get logged-in user's favorites
export async function getFavoritesAPI(): Promise<Property[]> {
  const response = await fetch(`${API_URL}/favorites`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await readResponse(response);

  return (data.favorites || []).map(mapProperty);
}

// Add property to favorites
export async function addFavoriteAPI(propertyId: string) {
  const response = await fetch(
    `${API_URL}/favorites/${propertyId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return readResponse(response);
}

// Remove property from favorites
export async function removeFavoriteAPI(propertyId: string) {
  const response = await fetch(
    `${API_URL}/favorites/${propertyId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return readResponse(response);
}

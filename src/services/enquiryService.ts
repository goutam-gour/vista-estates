import API_URL from "./api";

const ENQUIRY_URL = `${API_URL}/enquiries`;
import type { Enquiry } from "../types";



interface MongoEnquiry {
  _id: string;
  property?: {
    _id?: string;
    title?: string;
    name?: string;
  } | string;
  user?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "New" | "Contacted" | "In Progress" | "Closed";
  createdAt: string;
  updatedAt?: string;
}

interface EnquiryResponse {
  success: boolean;
  message?: string;
  count?: number;
  enquiries?: MongoEnquiry[];
  enquiry?: MongoEnquiry;
}

function getToken(): string | null {
  return (
    localStorage.getItem("vista_token") ||
    sessionStorage.getItem("vista_token")
  );
}

async function request(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<EnquiryResponse> {
  const token = getToken();

  if (requiresAuth && !token) {
    throw new Error("Please login as admin.");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = (await response.json()) as EnquiryResponse;

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Enquiry request failed.");
  }

  return data;
}

/* Convert MongoDB status to frontend status */

function mapStatus(
  status: MongoEnquiry["status"]
): "New" | "Responded" {
  return status === "New" ? "New" : "Responded";
}

/* Convert MongoDB enquiry to frontend enquiry */

function mapEnquiry(data: MongoEnquiry): Enquiry {
  const property =
    typeof data.property === "object" && data.property !== null
      ? data.property
      : null;

  return {
    id: data._id,
    type: "enquiry",
    propertyId:
      property?._id ||
      (typeof data.property === "string" ? data.property : ""),
    propertyTitle: property?.title || property?.name || "Property",
    name: data.name,
    email: data.email,
    phone: data.phone || "",
    message: data.message,
    status: mapStatus(data.status),
    date: data.createdAt,
  } as Enquiry;
}

/* Get All Enquiries */

export async function getEnquiriesAPI(): Promise<Enquiry[]> {
  const data = await request("");

  return (data.enquiries || []).map(mapEnquiry);
}

/* Create Enquiry */

export async function createEnquiryAPI(
  enquiry: Omit<Enquiry, "id" | "date" | "status">
): Promise<Enquiry> {
  const data = await request(
    "",
    {
      method: "POST",
      body: JSON.stringify({
        property: enquiry.propertyId,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        message: enquiry.message,
      }),
    },
    false
  );

  if (!data.enquiry) {
    throw new Error("Enquiry was not returned by the server.");
  }

  return mapEnquiry(data.enquiry);
}

/* Update Enquiry Status */

export async function updateEnquiryStatusAPI(
  id: string,
  status: "New" | "Responded"
): Promise<void> {
  await request(`/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      status: status === "Responded" ? "Contacted" : "New",
    }),
  });
}

/* Delete Enquiry */

export async function deleteEnquiryAPI(id: string): Promise<void> {
  await request(`/${id}`, {
    method: "DELETE",
  });
}

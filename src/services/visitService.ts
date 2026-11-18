
// const API_URL = "http://localhost:5000/api";

// export interface Visit {
//   _id: string;
//   property: string | {
//     _id: string;
//     title: string;
//     location?: string;
//     images?: string[];
//   };
//   user?: string | {
//     _id: string;
//     name: string;
//     email: string;
//   } | null;
//   name: string;
//   email: string;
//   phone: string;
//   visitDate: string;
//   visitTime: string;
//   message?: string;
//   status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface CreateVisitData {
//   property: string;
//   name: string;
//   email: string;
//   phone: string;
//   visitDate: string;
//   visitTime: string;
//   message?: string;
// }

// function getToken(): string | null {
//   return (
//     localStorage.getItem("vista_token") ||
//     sessionStorage.getItem("vista_token")
//   );
// }

// async function readResponse(response: Response) {
//   const data = await response.json();

//   if (!response.ok || !data.success) {
//     throw new Error(data.message || "Visit request failed");
//   }

//   return data;
// }

// // Create Property Visit Booking
// export async function createVisitAPI(visit: CreateVisitData) {
//   const token = getToken();

//   const response = await fetch(`${API_URL}/visits`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     },
//     body: JSON.stringify(visit),
//   });

//   return readResponse(response);
// }

// // Get All Visits (Admin)
// export async function getVisitsAPI(): Promise<Visit[]> {
//   const token = getToken();

//   if (!token) {
//     throw new Error("Please login as admin");
//   }

//   const response = await fetch(`${API_URL}/visits`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const data = await readResponse(response);
//   return data.visits || [];
// }

// // Get Single Visit (Admin)
// export async function getVisitByIdAPI(id: string): Promise<Visit> {
//   const token = getToken();

//   if (!token) {
//     throw new Error("Please login as admin");
//   }

//   const response = await fetch(`${API_URL}/visits/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const data = await readResponse(response);
//   return data.visit;
// }

// // Update Visit Status (Admin)
// export async function updateVisitAPI(
//   id: string,
//   status: Visit["status"]
// ) {
//   const token = getToken();

//   if (!token) {
//     throw new Error("Please login as admin");
//   }

//   const response = await fetch(`${API_URL}/visits/${id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ status }),
//   });

//   return readResponse(response);
// }

// // Delete Visit (Admin)
// export async function deleteVisitAPI(id: string) {
//   const token = getToken();

//   if (!token) {
//     throw new Error("Please login as admin");
//   }

//   const response = await fetch(`${API_URL}/visits/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return readResponse(response);
// }

// export async function getMyVisitsAPI(): Promise<Visit[]> {
//   const token = getToken();

//   if (!token) {
//     throw new Error("Please login to view your bookings.");
//   }

//   const response = await fetch(`${API_URL}/visits/my`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const data = await readResponse(response);

//   return data.visits || [];
// }

const API_URL = "http://localhost:5000/api";

export interface Visit {
  _id: string;
  property:
    | string
    | {
        _id: string;
        title: string;
        location?: string;
        images?: string[];
      };
  user?: string | {
    _id: string;
    name: string;
    email: string;
  } | null;
  name: string;
  email: string;
  phone: string;
  visitDate: string;
  visitTime: string;
  message?: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVisitData {
  property: string;
  name: string;
  email: string;
  phone: string;
  visitDate: string;
  visitTime: string;
  message?: string;
}

function getToken(): string {
  const token =
    localStorage.getItem("vista_token") ||
    sessionStorage.getItem("vista_token");

  if (!token) {
    throw new Error("Please login to continue.");
  }

  return token;
}

async function readResponse(response: Response) {
  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

// Create booking with logged-in user's token
export async function createVisitAPI(data: CreateVisitData) {
  const token = getToken();

  const response = await fetch(`${API_URL}/visits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return readResponse(response);
}

// Get all bookings - Admin
export async function getVisitsAPI(): Promise<Visit[]> {
  const token = getToken();

  const response = await fetch(`${API_URL}/visits`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await readResponse(response);
  return data.visits || [];
}

// Get logged-in user's bookings
export async function getMyVisitsAPI(): Promise<Visit[]> {
  const token = getToken();

  const response = await fetch(`${API_URL}/visits/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await readResponse(response);
  return data.visits || [];
}

// Get one booking
export async function getVisitByIdAPI(id: string): Promise<Visit> {
  const token = getToken();

  const response = await fetch(`${API_URL}/visits/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await readResponse(response);
  return data.visit;
}

// Update booking status - Admin
export async function updateVisitAPI(
  id: string,
  status: Visit["status"]
) {
  const token = getToken();

  const response = await fetch(`${API_URL}/visits/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  return readResponse(response);
}

// Delete booking - Admin
export async function deleteVisitAPI(id: string) {
  const token = getToken();

  const response = await fetch(`${API_URL}/visits/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return readResponse(response);
}

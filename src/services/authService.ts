import API_URL from "./api";

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
  };
}

// Login User
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Login failed");
  }

  return data as AuthResponse;
};

// Register User
export const registerUser = async (
  name: string,
  email: string,
  phone: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, password }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Registration failed");
  }

  return data as AuthResponse;
};

// Update Profile
export const updateProfile = async (
  name: string,
  phone: string,
  token: string
) => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, phone }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Profile update failed");
  }

  return data;
};

// Change Password
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  token: string
) => {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Password change failed");
  }

  return data;
};

// Forgot Password
export const forgotPassword = async (
  email: string,
  newPassword: string
) => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      newPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Password reset failed");
  }

  return data;
};

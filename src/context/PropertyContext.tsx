
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getPropertiesAPI,
  createPropertyAPI,
  updatePropertyAPI,
  deletePropertyAPI,
  getFavoritesAPI,
  addFavoriteAPI,
  removeFavoriteAPI,
} from "../services/propertyService";

import {
  getAgentsAPI,
  createAgentAPI,
  updateAgentAPI,
  deleteAgentAPI,
} from "../services/agentService";

import {
  getEnquiriesAPI,
  createEnquiryAPI,
  updateEnquiryStatusAPI,
  deleteEnquiryAPI,
} from "../services/enquiryService";

import type {
  Agent,
  ContactMessage,
  Enquiry,
  Property,
  PropertyReport,
  Toast,
  ToastKind,
  User,
} from "../types";

import { seedProperties, seedUsers } from "../data/properties";
import { readLS, uid, writeLS } from "../utils/helpers";

import {
  loginUser,
  registerUser,
  updateProfile as updateProfileAPI,
  changePassword as changePasswordAPI,
} from "../services/authService";

/* Storage Keys */

const K = {
  properties: "vista_properties",
  agents: "vista_agents",
  users: "vista_users",
  favorites: "vista_favorites",
  enquiries: "vista_enquiries",
  messages: "vista_messages",
  reports: "vista_reports",
  session: "vista_session",
  token: "vista_token",
};

/* Get Saved User */

function getSavedUser(): User | null {
  try {
    const savedUser =
      localStorage.getItem(K.session) ||
      sessionStorage.getItem(K.session);

    return savedUser ? (JSON.parse(savedUser) as User) : null;
  } catch {
    return null;
  }
}

/* Context Interface */

interface PropertyContextValue {
  properties: Property[];
  loading: boolean;
  error: string | null;

  agents: Agent[];
  agentsLoading: boolean;

  favorites: string[];
  user: User | null;
  users: User[];

  enquiries: Enquiry[];
  messages: ContactMessage[];
  reports: PropertyReport[];
  toasts: Toast[];

  agentOf: (agentId: string) => Agent | undefined;
  getProperty: (id: string) => Property | undefined;

  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;

  addProperty: (p: Property) => Promise<void>;
  updateProperty: (p: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;

  addAgent: (a: Agent) => Promise<void>;
  updateAgent: (a: Agent) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;

  login: (
    email: string,
    password: string,
    remember: boolean
  ) => Promise<{
    ok: boolean;
    error?: string;
    user?: User;
  }>;

  register: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<{
    ok: boolean;
    error?: string;
    user?: User;
  }>;

  updateProfile: (
    name: string,
    phone: string
  ) => Promise<{
    ok: boolean;
    error?: string;
    user?: User;
  }>;

  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{
    ok: boolean;
    error?: string;
  }>;

  logout: () => void;
  deleteUser: (id: string) => void;

  addEnquiry: (
    e: Omit<Enquiry, "id" | "date" | "status">
  ) => Promise<void>;

  setEnquiryStatus: (
    id: string,
    status: Enquiry["status"]
  ) => Promise<void>;

  deleteEnquiry: (id: string) => Promise<void>;

  addMessage: (m: Omit<ContactMessage, "id" | "date" | "read">) => void;
  toggleMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  addReport: (r: Omit<PropertyReport, "id" | "date">) => void;
  deleteReport: (id: string) => void;

  toast: (message: string, kind?: ToastKind) => void;
  resetDemoData: () => void;
}

/* Create Context */

const PropertyContext = createContext<PropertyContextValue | null>(null);

/* Custom Hook */

export function useProperties(): PropertyContextValue {
  const ctx = useContext(PropertyContext);

  if (!ctx) {
    throw new Error("useProperties must be used inside <PropertyProvider>");
  }

  return ctx;
}

/* Property Provider */

export function PropertyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Agents - MongoDB */

  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(true);

  const [users, setUsers] = useState<User[]>(() =>
    readLS(K.users, seedUsers)
  );

  const [favorites, setFavorites] = useState<string[]>([]);

  /* Enquiries - MongoDB */

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const [messages, setMessages] = useState<ContactMessage[]>(() =>
    readLS(K.messages, [])
  );

  const [reports, setReports] = useState<PropertyReport[]>(() =>
    readLS(K.reports, [])
  );

  const [user, setUser] = useState<User | null>(getSavedUser);
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* Toast Notifications */

  const toast = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = uid("t");

      setToasts((prev) => [...prev, { id, kind, message }]);

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  /* Load Properties From MongoDB */

  useEffect(() => {
    let cancelled = false;

    const loadProperties = async () => {
      try {
        const mongoProperties = await getPropertiesAPI();

        if (cancelled) return;

        if (mongoProperties.length > 0) {
          setProperties(mongoProperties);
        } else {
          const stored = readLS<Property[] | null>(K.properties, null);

          setProperties(
            stored && stored.length > 0 ? stored : seedProperties
          );
        }

        setError(null);
      } catch (err) {
        if (cancelled) return;

        console.error("MongoDB properties loading error:", err);

        const stored = readLS<Property[] | null>(K.properties, null);

        setProperties(
          stored && stored.length > 0 ? stored : seedProperties
        );

        setError(
          err instanceof Error
            ? err.message
            : "Properties could not be loaded."
        );
      } finally {
        if (!cancelled) {
          setLoaded(true);
          setLoading(false);
        }
      }
    };

    loadProperties();

    return () => {
      cancelled = true;
    };
  }, []);

  /* Load Agents From MongoDB */

  const loadAgents = useCallback(async () => {
    try {
      setAgentsLoading(true);

      const mongoAgents = await getAgentsAPI();

      setAgents(mongoAgents);
    } catch (err) {
      console.error("MongoDB agents loading error:", err);

      toast(
        err instanceof Error ? err.message : "Agents could not be loaded.",
        "error"
      );
    } finally {
      setAgentsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  /* Load Enquiries From MongoDB */

  useEffect(() => {
    let cancelled = false;

    const loadEnquiries = async () => {
      if (!user || user.role !== "admin") {
        setEnquiries([]);
        return;
      }

      try {
        const mongoEnquiries = await getEnquiriesAPI();

        if (!cancelled) {
          setEnquiries(mongoEnquiries);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("MongoDB enquiries loading error:", err);

          toast(
            err instanceof Error
              ? err.message
              : "Enquiries could not be loaded.",
            "error"
          );
        }
      }
    };

    loadEnquiries();

    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.role, toast]);

  /* Persist Data */

  useEffect(() => {
    if (loaded) {
      writeLS(K.properties, properties);
    }
  }, [properties, loaded]);

  useEffect(() => writeLS(K.users, users), [users]);

  /* Messages and Reports remain local */

  useEffect(() => writeLS(K.messages, messages), [messages]);
  useEffect(() => writeLS(K.reports, reports), [reports]);

  /* Load User Favorites From MongoDB */

  useEffect(() => {
    let cancelled = false;

    const loadFavorites = async () => {
      if (!user) {
        setFavorites([]);
        return;
      }

      try {
        const savedProperties = await getFavoritesAPI();

        if (cancelled) return;

        setFavorites([
          ...new Set(savedProperties.map((property) => property.id)),
        ]);
      } catch (err) {
        if (!cancelled) {
          console.error("Favorites loading error:", err);
        }
      }
    };

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  /* Lookups */

  const agentOf = useCallback(
    (agentId: string) => agents.find((a) => a.id === agentId),
    [agents]
  );

  const getProperty = useCallback(
    (id: string) => properties.find((p) => p.id === id),
    [properties]
  );

  /* Favorites - MongoDB */

  const toggleFavorite = useCallback(
    async (id: string) => {
      try {
        if (!user) {
          toast("Please login to save favorites", "info");
          return;
        }

        if (!/^[a-f\d]{24}$/i.test(id)) {
          toast("Invalid property. Please refresh the page.", "error");
          return;
        }

        const exists = favorites.includes(id);

        if (exists) {
          await removeFavoriteAPI(id);

          setFavorites((prev) => prev.filter((f) => f !== id));

          toast("Removed from favorites", "info");
        } else {
          await addFavoriteAPI(id);

          setFavorites((prev) =>
            prev.includes(id) ? prev : [...prev, id]
          );

          toast("Saved to favorites", "success");
        }
      } catch (err) {
        toast(
          err instanceof Error ? err.message : "Favorites update failed",
          "error"
        );
      }
    },
    [favorites, user, toast]
  );

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  /* Properties - Admin */

  const addProperty = useCallback(
    async (p: Property) => {
      await createPropertyAPI(p);

      const updatedProperties = await getPropertiesAPI();
      setProperties(updatedProperties);

      toast("Property added successfully", "success");
    },
    [toast]
  );

  const updateProperty = useCallback(
    async (p: Property) => {
      await updatePropertyAPI(p);

      const updatedProperties = await getPropertiesAPI();
      setProperties(updatedProperties);

      toast("Property updated successfully", "success");
    },
    [toast]
  );

  const deleteProperty = useCallback(
    async (id: string) => {
      await deletePropertyAPI(id);

      setProperties((prev) => prev.filter((p) => p.id !== id));
      setFavorites((prev) => prev.filter((f) => f !== id));

      toast("Property deleted successfully", "success");
    },
    [toast]
  );

  /* Agents - Admin - MongoDB */

  const addAgent = useCallback(
    async (agent: Agent) => {
      try {
        const newAgent = await createAgentAPI(agent);

        setAgents((prev) => [...prev, newAgent]);

        toast("Agent added successfully", "success");
      } catch (err) {
        toast(
          err instanceof Error ? err.message : "Agent could not be added",
          "error"
        );

        throw err;
      }
    },
    [toast]
  );

  const updateAgent = useCallback(
    async (agent: Agent) => {
      try {
        const updatedAgent = await updateAgentAPI(agent);

        setAgents((prev) =>
          prev.map((item) =>
            item.id === updatedAgent.id ? updatedAgent : item
          )
        );

        toast("Agent updated successfully", "success");
      } catch (err) {
        toast(
          err instanceof Error ? err.message : "Agent could not be updated",
          "error"
        );

        throw err;
      }
    },
    [toast]
  );

  const deleteAgent = useCallback(
    async (id: string) => {
      try {
        await deleteAgentAPI(id);

        setAgents((prev) => prev.filter((agent) => agent.id !== id));

        toast("Agent deleted successfully", "success");
      } catch (err) {
        toast(
          err instanceof Error ? err.message : "Agent could not be deleted",
          "error"
        );

        throw err;
      }
    },
    [toast]
  );

  /* Login */

  const login = useCallback(
    async (email: string, password: string, remember: boolean) => {
      try {
        const response = await loginUser(email, password);

        const loggedInUser: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          password: "",
          joined: new Date().toISOString(),
        };

        localStorage.removeItem(K.session);
        sessionStorage.removeItem(K.session);
        localStorage.removeItem(K.token);
        sessionStorage.removeItem(K.token);

        const storage = remember ? localStorage : sessionStorage;

        storage.setItem(K.session, JSON.stringify(loggedInUser));
        storage.setItem(K.token, response.token);

        setUser(loggedInUser);

        return {
          ok: true,
          user: loggedInUser,
        };
      } catch (err) {
        return {
          ok: false,
          error:
            err instanceof Error
              ? err.message
              : "Login failed. Please try again.",
        };
      }
    },
    []
  );

  /* Register */

  const register = useCallback(
    async (name: string, email: string, phone: string, password: string) => {
      try {
        const response = await registerUser(
          name.trim(),
          email.trim(),
          phone.trim(),
          password
        );

        const newUser: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          phone: phone.trim() || undefined,
          password: "",
          role: response.user.role,
          joined: new Date().toISOString(),
        };

        localStorage.removeItem(K.session);
        sessionStorage.removeItem(K.session);
        localStorage.removeItem(K.token);
        sessionStorage.removeItem(K.token);

        localStorage.setItem(K.session, JSON.stringify(newUser));
        localStorage.setItem(K.token, response.token);

        setUser(newUser);

        return {
          ok: true,
          user: newUser,
        };
      } catch (err) {
        return {
          ok: false,
          error:
            err instanceof Error
              ? err.message
              : "Registration failed. Please try again.",
        };
      }
    },
    []
  );

  /* Update Profile */

  const updateProfile = useCallback(
    async (name: string, phone: string) => {
      try {
        if (!user) {
          throw new Error("Please login again.");
        }

        const token =
          localStorage.getItem(K.token) ||
          sessionStorage.getItem(K.token);

        if (!token) {
          throw new Error("Your session has expired. Please login again.");
        }

        const response = await updateProfileAPI(name.trim(), phone.trim(), token);

        const updatedUser: User = {
          ...user,
          id: response.user._id || response.user.id || user.id,
          name: response.user.name,
          phone: response.user.phone,
        };

        setUser(updatedUser);

        if (localStorage.getItem(K.session)) {
          localStorage.setItem(K.session, JSON.stringify(updatedUser));
        } else {
          sessionStorage.setItem(K.session, JSON.stringify(updatedUser));
        }

        toast("Profile updated successfully", "success");

        return {
          ok: true,
          user: updatedUser,
        };
      } catch (err) {
        return {
          ok: false,
          error:
            err instanceof Error
              ? err.message
              : "Profile update failed. Please try again.",
        };
      }
    },
    [user, toast]
  );

  /* Change Password */

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        if (!user) {
          throw new Error("Please login again.");
        }

        const token =
          localStorage.getItem(K.token) ||
          sessionStorage.getItem(K.token);

        if (!token) {
          throw new Error("Your session has expired. Please login again.");
        }

        await changePasswordAPI(currentPassword, newPassword, token);

        toast("Password changed successfully", "success");

        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          error:
            err instanceof Error
              ? err.message
              : "Password change failed. Please try again.",
        };
      }
    },
    [user, toast]
  );

  /* Logout */

  const logout = useCallback(() => {
    localStorage.removeItem(K.session);
    sessionStorage.removeItem(K.session);
    localStorage.removeItem(K.token);
    sessionStorage.removeItem(K.token);

    setUser(null);
    setFavorites([]);
    setEnquiries([]);

    toast("You have been signed out", "info");
  }, [toast]);

  /* Delete User */

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  /* Enquiries - MongoDB */

  const addEnquiry = useCallback(
    async (enquiry: Omit<Enquiry, "id" | "date" | "status">) => {
      try {
        const newEnquiry = await createEnquiryAPI(enquiry);

        setEnquiries((prev) => [
          {
            ...newEnquiry,
            ...enquiry,
            id: newEnquiry.id,
            date: newEnquiry.date,
            status: newEnquiry.status,
          },
          ...prev,
        ]);

        toast("Your enquiry has been submitted successfully", "success");
      } catch (err) {
        console.error("Create enquiry error:", err);

        toast(
          err instanceof Error
            ? err.message
            : "Enquiry could not be submitted.",
          "error"
        );
      }
    },
    [toast]
  );

  const setEnquiryStatus = useCallback(
    async (id: string, status: Enquiry["status"]) => {
      try {
        const backendStatus = status === "New" ? "New" : "Responded";

        await updateEnquiryStatusAPI(id, backendStatus);

        setEnquiries((prev) =>
          prev.map((enquiry) =>
            enquiry.id === id
              ? { ...enquiry, status }
              : enquiry
          )
        );

        toast("Enquiry status updated successfully", "success");
      } catch (err) {
        console.error("Update enquiry status error:", err);

        toast(
          err instanceof Error
            ? err.message
            : "Enquiry status could not be updated.",
          "error"
        );
      }
    },
    [toast]
  );

  const deleteEnquiry = useCallback(
    async (id: string) => {
      try {
        await deleteEnquiryAPI(id);

        setEnquiries((prev) =>
          prev.filter((enquiry) => enquiry.id !== id)
        );

        toast("Enquiry deleted successfully", "success");
      } catch (err) {
        console.error("Delete enquiry error:", err);

        toast(
          err instanceof Error
            ? err.message
            : "Enquiry could not be deleted.",
          "error"
        );
      }
    },
    [toast]
  );

  /* Messages - Local */

  const addMessage = useCallback(
    (m: Omit<ContactMessage, "id" | "date" | "read">) => {
      setMessages((prev) => [
        {
          ...m,
          id: uid("msg"),
          date: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    },
    []
  );

  const toggleMessageRead = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, read: !m.read } : m
      )
    );
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  /* Reports - Local */

  const addReport = useCallback(
    (r: Omit<PropertyReport, "id" | "date">) => {
      setReports((prev) => [
        {
          ...r,
          id: uid("rep"),
          date: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    []
  );

  const deleteReport = useCallback((id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  }, []);

  /* Reset Demo Data */

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(K.properties);

    setProperties(seedProperties);

    toast("Demo data reset to the original listings", "info");
  }, [toast]);

  /* Context Value */

  const value = useMemo<PropertyContextValue>(
    () => ({
      properties,
      loading,
      error,
      agents,
      agentsLoading,
      favorites,
      user,
      users,
      enquiries,
      messages,
      reports,
      toasts,

      agentOf,
      getProperty,

      toggleFavorite,
      isFavorite,

      addProperty,
      updateProperty,
      deleteProperty,

      addAgent,
      updateAgent,
      deleteAgent,

      login,
      register,
      updateProfile,
      changePassword,

      logout,
      deleteUser,

      addEnquiry,
      setEnquiryStatus,
      deleteEnquiry,

      addMessage,
      toggleMessageRead,
      deleteMessage,

      addReport,
      deleteReport,

      toast,
      resetDemoData,
    }),
    [
      properties,
      loading,
      error,
      agents,
      agentsLoading,
      favorites,
      user,
      users,
      enquiries,
      messages,
      reports,
      toasts,
      agentOf,
      getProperty,
      toggleFavorite,
      isFavorite,
      addProperty,
      updateProperty,
      deleteProperty,
      addAgent,
      updateAgent,
      deleteAgent,
      login,
      register,
      updateProfile,
      changePassword,
      logout,
      deleteUser,
      addEnquiry,
      setEnquiryStatus,
      deleteEnquiry,
      addMessage,
      toggleMessageRead,
      deleteMessage,
      addReport,
      deleteReport,
      toast,
      resetDemoData,
    ]
  );

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

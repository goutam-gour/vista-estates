
import MyBookings from "./pages/MyBookings";
import ManageVisits from "./pages/admin/ManageVisits";
import { useEffect } from "react";

import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";

import {
  PropertyProvider,
  useProperties,
} from "./context/PropertyContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toasts } from "./components/ui";

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ManageProperties from "./admin/ManageProperties";
import PropertyForm from "./admin/PropertyForm";
import ManageUsers from "./admin/ManageUsers";
import Enquiries from "./admin/Enquiries";
import ManageAgents from "./admin/ManageAgents";

/* Scroll to top */

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* Public Layout */

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

/* Admin Protected Route */

function AdminProtectedRoute() {
  const { user } = useProperties();

  // Login nahi hai
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Admin role nahi hai
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Sirf admin ko access
  return <Outlet />;
}

/* App */

export default function App() {
  return (
    <PropertyProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toasts />

        <Routes>
          {/* Public Pages */}

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route
              path="/properties/:id"
              element={<PropertyDetails />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>

          {/* Authentication */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Login */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* Protected Admin Routes */}

          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />

              <Route
                path="properties"
                element={<ManageProperties />}
              />

              <Route
                path="properties/new"
                element={<PropertyForm mode="add" />}
              />

              <Route
                path="properties/:id/edit"
                element={<PropertyForm mode="edit" />}
              />

              <Route
                path="visits"
                element={<ManageVisits />}
              />

              <Route
                path="users"
                element={<ManageUsers />}
              />

              <Route
                path="enquiries"
                element={<Enquiries />}
              />

              <Route
                path="agents"
                element={<ManageAgents />}
              />
            </Route>
          </Route>

          {/* 404 */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </PropertyProvider>
  );
}

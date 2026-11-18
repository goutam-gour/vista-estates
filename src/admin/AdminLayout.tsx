
import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import {
  Building2,
  CalendarClock,
  ExternalLink,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Users,
  UserSquare2,
  X,
} from "lucide-react";

import { useProperties } from "../context/PropertyContext";
import { cn } from "../utils/cn";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
  { to: "/admin/properties/new", label: "Add property", icon: PlusCircle },
  { to: "/admin/visits", label: "Manage Bookings", icon: CalendarClock },
  { to: "/admin/enquiries", label: "Enquiries & inbox", icon: Inbox },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/agents", label: "Agents", icon: UserSquare2 },
];

export default function AdminLayout() {
  const { user, logout, enquiries, messages, reports } = useProperties();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  if (!user) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  const newCount =
    enquiries.filter((e) => e.status === "New").length +
    messages.filter((m) => !m.read).length;

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2.5 px-6 py-6">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brass-500 text-white">
          <Home className="h-4.5 w-4.5" />
        </span>

        <span>
          <span className="display block text-base leading-none font-semibold text-white">
            Vista Estates
          </span>
          <span className="mt-1 block text-[10px] font-bold tracking-[0.2em] text-brass-300 uppercase">
            Admin console
          </span>
        </span>
      </Link>

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
        aria-label="Admin"
      >
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-brass-500/15 text-brass-200"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )
            }
          >
            <item.icon className="h-4.5 w-4.5" />

            {item.label}

            {item.to === "/admin/enquiries" && newCount > 0 && (
              <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-brass-500 px-1.5 text-[10px] font-bold text-white">
                {newCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        {reports.length > 0 && (
          <p className="mx-3 mb-3 rounded-xl bg-amber-400/10 px-3 py-2 text-[11px] font-medium text-amber-300">
            {reports.length} pending listing{" "}
            {reports.length === 1 ? "report" : "reports"} to review
          </p>
        )}

        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-4.5 w-4.5" />
          View public site
        </Link>

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
        >
          <LogOut className="h-4.5 w-4.5" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper lg:pl-68">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-68 bg-ink-950 lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-900/5 bg-paper/90 px-4 py-3.5 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open admin menu"
            className="grid h-10 w-10 place-items-center rounded-full text-ink-900 hover:bg-ink-900/5"
          >
            <Menu className="h-5 w-5" />
          </button>

          <span className="display text-base font-semibold text-ink-950">
            Admin console
          </span>
        </div>

        <span className="grid h-9 w-9 place-items-center rounded-full bg-brass-500 text-xs font-bold text-white">
          {user.name.charAt(0)}
        </span>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="fade-in absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />

          <aside className="modal-in absolute inset-y-0 left-0 w-72 bg-ink-950">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute top-5 right-4 grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Content */}
      <main className="p-4 sm:p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}

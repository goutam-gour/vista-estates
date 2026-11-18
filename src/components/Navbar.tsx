
import { useEffect, useState, type CSSProperties } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import {
  CalendarDays,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  User as UserIcon,
  X,
} from "lucide-react";

import { cn } from "../utils/cn";
import { useProperties } from "../context/PropertyContext";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const { user, logout, favorites } = useProperties();

  const location = useLocation();
  const isHome = location.pathname === "/";
  const solid = scrolled || !isHome || mobileOpen;

  // My Bookings is for customers, not admin accounts.
  const showMyBookings = Boolean(user && user.role !== "admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const linkCls = (isActive: boolean) =>
    cn(
      "relative text-sm font-medium transition-colors",
      solid
        ? isActive
          ? "text-ink-950"
          : "text-ink-500 hover:text-ink-950"
        : isActive
          ? "text-white"
          : "text-white/70 hover:text-white",
      isActive &&
        "after:absolute after:-bottom-1.5 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-brass-400"
    );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid
            ? "border-b border-ink-900/5 bg-paper/90 shadow-sm backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <div className="container-x flex h-18 items-center justify-between gap-4 sm:h-20">

          {/* Brand */}
          <Link
            to="/"
            className="group flex items-center gap-2.5"
            aria-label="Pride Properties home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brass-500 text-white shadow-lg shadow-brass-500/30 transition-transform duration-300 group-hover:-rotate-6">
              <Home className="h-4.5 w-4.5" />
            </span>

            <span
              className={cn(
                "display text-lg font-semibold tracking-tight",
                solid ? "text-ink-950" : "text-white"
              )}
            >
              Pride<span className="text-brass-400"> Properties</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-6 xl:gap-8 lg:flex"
            aria-label="Primary"
          >
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) => linkCls(isActive)}
              >
                {l.label}
              </NavLink>
            ))}

            {/* Customer My Bookings */}
            {showMyBookings && (
              <NavLink
                to="/my-bookings"
                className={({ isActive }) => linkCls(isActive)}
              >
                My Bookings
              </NavLink>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Favorites */}
            <Link
              to="/favorites"
              aria-label="Saved properties"
              className={cn(
                "relative grid h-10 w-10 place-items-center rounded-full transition",
                solid
                  ? "text-ink-700 hover:bg-ink-900/5"
                  : "text-white hover:bg-white/10"
              )}
            >
              <Heart className="h-5 w-5" />

              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-brass-500 px-1 text-[10px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Logged-in User */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenu((v) => !v)}
                  aria-expanded={userMenu}
                  aria-label="Open account menu"
                  className={cn(
                    "flex items-center gap-2 rounded-full py-1.5 pr-3 pl-1.5 text-sm font-semibold transition",
                    solid
                      ? "bg-ink-900/5 text-ink-900 hover:bg-ink-900/10"
                      : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-brass-500 text-xs text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>

                  <span className="hidden max-w-24 truncate sm:block">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {userMenu && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setUserMenu(false)}
                      aria-label="Close menu"
                    />

                    <div className="fade-in absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-ink-900/5 bg-white p-1.5 shadow-xl">

                      {/* User Details */}
                      <div className="border-b border-ink-900/5 px-3 py-2.5">
                        <p className="truncate text-sm font-semibold text-ink-950">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-ink-400">
                          {user.email}
                        </p>
                      </div>

                      {/* My Profile */}
                      <Link
                        to="/profile"
                        onClick={() => setUserMenu(false)}
                        className="mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-cream"
                      >
                        <UserIcon className="h-4 w-4" />
                        My Profile
                      </Link>

                      {/* My Bookings */}
                      {showMyBookings && (
                        <Link
                          to="/my-bookings"
                          onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-cream"
                        >
                          <CalendarDays className="h-4 w-4" />
                          My Bookings
                        </Link>
                      )}

                      {/* Saved Properties */}
                      <Link
                        to="/favorites"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-cream"
                      >
                        <Heart className="h-4 w-4" />
                        Saved Properties
                      </Link>

                      {/* Admin Dashboard */}
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-cream"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      )}

                      {/* Sign Out */}
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserMenu(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/login"
                  className={cn(
                    "btn btn-md",
                    solid
                      ? "btn-ghost"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <UserIcon className="h-4 w-4" />
                  Log in
                </Link>

                <Link to="/register" className="btn-brass btn-md">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full transition lg:hidden",
                solid
                  ? "text-ink-900 hover:bg-ink-900/5"
                  : "text-white hover:bg-white/10"
              )}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fade-in fixed inset-0 z-40 flex flex-col bg-ink-950/97 backdrop-blur-xl lg:hidden">
          <div className="container-x flex flex-1 flex-col justify-center gap-2 pt-20">

            {LINKS.map((l, i) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "hero-rise display border-b border-white/8 py-4 text-3xl font-medium transition-colors",
                    isActive
                      ? "text-brass-300"
                      : "text-white hover:text-brass-200"
                  )
                }
                style={
                  {
                    "--rise-delay": `${i * 60 + 100}ms`,
                  } as CSSProperties
                }
              >
                {l.label}
              </NavLink>
            ))}

            {/* Mobile My Bookings */}
            {showMyBookings && (
              <NavLink
                to="/my-bookings"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "hero-rise display flex items-center gap-3 border-b border-white/8 py-4 text-3xl font-medium transition-colors",
                    isActive
                      ? "text-brass-300"
                      : "text-white hover:text-brass-200"
                  )
                }
                style={
                  {
                    "--rise-delay": "400ms",
                  } as CSSProperties
                }
              >
                <CalendarDays className="h-7 w-7" />
                My Bookings
              </NavLink>
            )}

            <div
              className="hero-rise mt-8 flex flex-wrap gap-3"
              style={{ "--rise-delay": "450ms" } as CSSProperties}
            >
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="btn-outline-light btn-lg"
                  >
                    <UserIcon className="h-4 w-4" />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="btn-outline-light btn-lg"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-outline-light btn-lg"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="btn-brass btn-lg"
                  >
                    Register
                  </Link>
                </>
              )}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="btn-outline-light btn-lg"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { Link } from "react-router-dom";
import { ArrowRight, Home, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useProperties } from "../context/PropertyContext";
import { isEmail } from "../utils/helpers";

/* Brand icons (lucide-react no longer ships brand icons, so we inline them) */
function BrandIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      {children}
    </svg>
  );
}
const FacebookIcon = () => (
  <BrandIcon>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </BrandIcon>
);
const InstagramIcon = () => (
  <BrandIcon>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </BrandIcon>
);
const TwitterIcon = () => (
  <BrandIcon>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </BrandIcon>
);
const LinkedinIcon = () => (
  <BrandIcon>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </BrandIcon>
);

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "All properties" },
  { to: "/about", label: "About us" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
  { to: "/favorites", label: "Saved homes" },
];

const TYPE_LINKS = [
  { to: "/properties?type=House", label: "Houses" },
  { to: "/properties?type=Villa", label: "Villas" },
  { to: "/properties?type=Apartment", label: "Apartments" },
  { to: "/properties?type=Penthouse", label: "Penthouses" },
  { to: "/properties?purpose=rent", label: "Rentals" },
  { to: "/properties?type=Commercial", label: "Commercial" },
];

const SOCIALS = [
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
  { icon: TwitterIcon, label: "X (Twitter)", href: "https://x.com" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "https://linkedin.com" },
];

export default function Footer() {
  const { toast } = useProperties();
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      toast("Please enter a valid email address", "error");
      return;
    }
    setEmail("");
    toast("Subscribed — market updates arrive monthly");
  };

  return (
    <footer className="bg-ink-950 text-white">
      <div className="container-x grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brass-500 text-white">
              <Home className="h-4.5 w-4.5" />
            </span>
            <span className="display text-lg font-semibold">
              Vista<span className="text-brass-400"> Estates</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            Austin's boutique brokerage for verified homes, honest valuations and end-to-end support — from first tour
            to final signature.
          </p>
          <div className="mt-6 flex gap-2.5">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-brass-400 hover:bg-brass-500 hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="Footer">
          <h4 className="text-xs font-bold tracking-[0.2em] text-brass-300 uppercase">Company</h4>
          <ul className="mt-5 space-y-3">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-white/60 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Explore */}
        <nav aria-label="Property types">
          <h4 className="text-xs font-bold tracking-[0.2em] text-brass-300 uppercase">Explore</h4>
          <ul className="mt-5 space-y-3">
            {TYPE_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-white/60 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact + newsletter */}
        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] text-brass-300 uppercase">Visit us</h4>
          <ul className="mt-5 space-y-3.5 text-sm text-white/60">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass-400" />
              908 Congress Ave, Suite 400 
              <br />
            </li>
            <li className="-mt-1 pl-7 text-white/40">Austin, TX 78701 </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-brass-400" /> (512) 555-0192
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-brass-400" /> hello@vistaestates.com
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0 text-brass-400" /> Mon–Sat · 9:00 – 18:00
            </li>
          </ul>
          <form onSubmit={subscribe} className="mt-6 flex overflow-hidden rounded-full border border-white/15 bg-white/5 p-1 focus-within:border-brass-400">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email for market updates"
              aria-label="Email for newsletter"
              className="w-full bg-transparent px-4 text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
            <button className="btn-brass grid h-9 w-9 shrink-0 rounded-full p-0" aria-label="Subscribe">
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Vista Estates Realty Group. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Portfolio demo — listings are illustrative sample data, not live offers.
          </p>
        </div>
      </div>
    </footer>
  );
}

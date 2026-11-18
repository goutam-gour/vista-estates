import { Link } from "react-router-dom";
import { ArrowLeft, Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-950 px-4">
      <div className="max-w-lg py-24 text-center">
        <p className="eyebrow justify-center text-brass-300">Page not found</p>
        <p className="display mt-6 text-[7rem] leading-none font-semibold text-white/10 select-none sm:text-[10rem]">
          404
        </p>
        <h1 className="display -mt-8 text-3xl font-semibold text-balance text-white sm:-mt-12 sm:text-4xl">
          This address doesn't exist on our map
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/60">
          The page you're looking for was moved, renamed, or never listed with us. Let's get you back to solid ground.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-brass btn-lg">
            <Home className="h-4.5 w-4.5" /> Back home
          </Link>
          <Link to="/properties" className="btn-outline-light btn-lg">
            <Compass className="h-4.5 w-4.5" /> Browse properties
          </Link>
        </div>
        <Link to="/contact" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-white/50 transition hover:text-brass-300">
          <ArrowLeft className="h-3.5 w-3.5" /> Think this is a mistake? Tell us
        </Link>
      </div>
    </div>
  );
}

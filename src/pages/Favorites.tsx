import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import PropertyCard from "../components/PropertyCard";
import { EmptyState, PageLoader, Reveal } from "../components/ui";

export default function Favorites() {
  const { properties, favorites, loading } = useProperties();
  const saved = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen">
      <section className="bg-ink-950 pt-32 pb-14 sm:pt-36">
        <div className="container-x">
          <p className="eyebrow text-brass-300">Your shortlist</p>
          <h1 className="display mt-4 text-4xl font-semibold text-white sm:text-5xl">Saved properties</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Homes you've bookmarked while browsing. Tap the heart on any listing to add or remove it.
          </p>
        </div>
      </section>

      <div className="container-x py-12 sm:py-16">
        {loading ? (
          <PageLoader label="Loading your shortlist…" />
        ) : saved.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-7 w-7" />}
            title="No saved homes yet"
            message="When a property catches your eye, tap the heart on its card and it will wait for you here."
            action={
              <Link to="/properties" className="btn-primary btn-md mt-2">
                Browse properties <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        ) : (
          <>
            <p className="mb-6 text-sm font-medium text-ink-600">
              <span className="display text-2xl font-semibold text-ink-950">{saved.length}</span> saved{" "}
              {saved.length === 1 ? "home" : "homes"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {saved.map((p, i) => (
                <Reveal key={p.id} delay={Math.min(i, 5) * 70}>
                  <PropertyCard property={p} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

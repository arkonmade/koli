"use client";
// src/components/BrowseClient.tsx
import { useState, useMemo, useEffect } from "react";
import type { Influencer } from "@/types";
import InfluencerCard from "./InfluencerCard";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  "All",
  "Fashion",
  "Food",
  "Lifestyle",
  "Comedy",
  "Tech",
  "Fitness",
  "Beauty",
  "Travel",
  "Music",
  "Gaming",
  "Sports",
  "Education",
];

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const GridIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);
const ListIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

export default function BrowseClient({
  influencers,
  initialQ,
  initialCat,
}: {
  influencers: Influencer[];
  initialQ: string;
  initialCat: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilters(q: string, category: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (q) params.set("q", q);
    else params.delete("q");

    if (category && category !== "All") params.set("category", category);
    else params.delete("category");

    router.push(`/browse?${params.toString()}`);
  }

  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState(initialCat);
  const [view, setView] = useState<"grid" | "list">("grid");

  const results = useMemo(
    () =>
      influencers.filter((inf) => {
        const ql = q.toLowerCase();
        const mQ =
          !ql ||
          inf.name.toLowerCase().includes(ql) ||
          inf.bio.toLowerCase().includes(ql) ||
          inf.category.toLowerCase().includes(ql) ||
          (inf.tags || []).some((t) => t.toLowerCase().includes(ql));
        const mC =
          cat === "All" ||
          inf.category === cat ||
          (inf.tags || []).includes(cat);
        return mQ && mC;
      }),
    [q, cat, influencers],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (q) params.set("q", q);
      else params.delete("q");

      if (cat && cat !== "All") params.set("category", cat);
      else params.delete("category");

      router.replace(`/browse?${params.toString()}`, { scroll: false });
    }, 500); // debounce

    return () => clearTimeout(timeout);
  }, [q, cat, router, searchParams]);

  return (
    <div style={{ padding: "14px 16px 0" }}>
      <div className="browse-inner">
        <div className="search-bar">
          <SearchIcon />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, niche, keyword…"
          />
        </div>

        <div className="filter-row">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`filter-btn ${cat === c ? "on" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="results-bar">
          <span className="results-count">
            {results.length} creator{results.length !== 1 ? "s" : ""}
          </span>
          <div className="view-toggle">
            <button
              className={`view-btn ${view === "grid" ? "on" : ""}`}
              onClick={() => setView("grid")}
            >
              <GridIcon />
            </button>
            <button
              className={`view-btn ${view === "list" ? "on" : ""}`}
              onClick={() => setView("list")}
            >
              <ListIcon />
            </button>
          </div>
        </div>

        {results.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--gray)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 8,
                color: "var(--white)",
              }}
            >
              No creators found
            </div>
            <p>Try a different search or clear the filters.</p>
          </div>
        ) : view === "grid" ? (
          <div className="cards-grid">
            {results.map((inf) => (
              <InfluencerCard key={inf.id} inf={inf} />
            ))}
          </div>
        ) : (
          <div>
            {results.map((inf) => (
              <InfluencerCard key={inf.id} inf={inf} view="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

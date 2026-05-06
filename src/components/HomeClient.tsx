"use client";
// src/components/HomeClient.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Influencer } from "@/types";
import InfluencerCard from "./InfluencerCard";
import styles from "./home.module.css";

const CATS = [
  "Fashion",
  "Food",
  "Lifestyle",
  "Comedy",
  "Tech",
  "Fitness",
  "Beauty",
  "Travel",
];

export default function HomeClient({ featured }: { featured: Influencer[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const go = (query = "", cat = "") => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (cat) p.set("category", cat);
    router.push(`/browse?${p.toString()}`);
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="kicker">
          <span className="kicker-dot" />
          Rwanda's Creator Network
        </div>
        <h1>
          Find creators that
          <br />
          <span className="accent">move Rwanda</span>
        </h1>
        <p className="hero-sub">
          Discover & contact top influencers in Rwanda — directly, instantly, no
          middlemen.
        </p>

        {/* <div className="hero-search"> */}
        <div className={`${styles.searchBar} hero-search`}>
          <input
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="fashion, sports, food, tech, comedy…"
            onKeyDown={(e) => e.key === "Enter" && go(q)}
            className={styles.searchInput}
          />
          <button className={styles.searchBtn} onClick={() => go(q)}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="hidden xs:inline">Search</span>{" "}
          </button>
        </div>

        <div className="pills">
          {CATS.map((cat) => (
            <button key={cat} className="pill" onClick={() => go("", cat)}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <div className="section">
        <div className="section-inner">
          <div className="sec-hd">
            <h2 className="sec-title">Featured Creators</h2>
            <button className="see-all" onClick={() => go()}>
              See all →
            </button>
          </div>
          <div className="cards-grid">
            {featured.map((inf) => (
              <InfluencerCard key={inf.id} inf={inf} />
            ))}
          </div>
        </div>
      </div>

      {/* SEO block */}
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div
            style={{
              background: "var(--s1)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-lg)",
              padding: "18px 16px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 8,
                letterSpacing: "-.3px",
              }}
            >
              Rwanda's top influencer platform
            </h2>
            <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.7 }}>
              KOLI connects brands with content creators across Rwanda and East
              Africa. Search fashion influencers in Kigali, food reviewers,
              lifestyle creators, tech voices — then contact them directly on
              WhatsApp. No fees, no delays.
            </p>
            <div
              style={{
                display: "flex",
                gap: 7,
                flexWrap: "wrap",
                marginTop: 12,
              }}
            >
              {[
                "Kigali influencers",
                "Rwanda creators",
                "Brand deals Rwanda",
                "TikTok Rwanda",
                "Instagram Rwanda",
                "East Africa creators",
              ].map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    background: "var(--s2)",
                    color: "var(--gray)",
                    padding: "3px 10px",
                    borderRadius: 100,
                    border: "1px solid var(--border)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px 20px",
          textAlign: "center",
          color: "var(--gray)",
          fontSize: 12,
        }}
      >
        <div
          style={{
            marginBottom: 5,
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 15,
            color: "var(--white)",
          }}
        >
          KO<span style={{ color: "var(--lime)" }}>LI</span>
        </div>
        <div>Connecting brands with creators, fast. © 2025 KOLI Rwanda</div>
      </footer>
    </>
  );
}

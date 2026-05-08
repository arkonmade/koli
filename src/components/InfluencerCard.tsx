"use client";
// src/components/InfluencerCard.tsx
import Link from "next/link";
import type { Influencer } from "@/types";
import { getPlatform, fmtFollowers } from "@/lib/platforms";

export default function InfluencerCard({
  inf,
  view = "grid",
}: {
  inf: Influencer;
  view?: "grid" | "list";
}) {
  const top2 = (inf.socials ?? []).slice(0, 2);

  if (view === "list")
    return (
      <Link href={`/influencer/${inf.slug}`} style={{ textDecoration: "none" }}>
        <div className="list-row">
          <div
            className="avatar"
            style={{
              background: inf.color,
              width: 42,
              height: 42,
              fontSize: 12,
            }}
          >
            <img
              className="w-full h-full object-cover"
              loading="lazy"
              src={
                inf.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  inf.name,
                )}&background=D4AF37&color=fff`
              }
              alt={inf.name}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 14,
                marginBottom: 2,
              }}
            >
              {inf.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--gray)" }}>
              {inf.category} · {inf.location}
            </div>
          </div>
          {inf.is_featured && <span className="feat-badge">★</span>}
          <div
            style={{
              display: "flex",
              gap: 8,
              fontSize: 11,
              color: "var(--gray)",
              flexShrink: 0,
            }}
          >
            {top2.map((s) => (
              <span key={s.id}>
                {getPlatform(s.platform).icon} {fmtFollowers(s.followers)}
              </span>
            ))}
          </div>
        </div>
      </Link>
    );

  return (
    <Link href={`/influencer/${inf.slug}`} style={{ textDecoration: "none" }}>
      <div className="creator-card" style={{ "--c-accent": inf.color } as any}>
        <div className="card-top">
          <div
            className="avatar"
            style={{
              background: inf.color,
              width: 44,
              height: 44,
              fontSize: 13,
              overflow: "hidden",
            }}
          >
            <img
              className="w-full h-full object-cover"
              loading="lazy"
              src={
                inf.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  inf.name,
                )}&background=D4AF37&color=fff`
              }
              alt={inf.name}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="card-name">{inf.name}</div>
            <div className="card-meta">
              {inf.category} · {inf.location}
            </div>
          </div>
          {inf.is_featured && <span className="feat-badge">★</span>}
        </div>
        <p className="card-bio">{inf.bio}</p>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          {top2.map((s) => (
            <span
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              <span>{getPlatform(s.platform).icon}</span>
              {fmtFollowers(s.followers)}
            </span>
          ))}
        </div>
        <div className="card-cta">View Profile →</div>
      </div>
    </Link>
  );
}

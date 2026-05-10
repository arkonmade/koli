"use client";
// src/app/admin/page.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  adminGetInfluencers,
  adminUpsertInfluencer,
  adminDeleteInfluencer,
  adminToggleFeatured,
  adminGetRequests,
  adminUpdateRequestStatus,
  adminGetMessages,
  adminUpdateMessageStatus,
  adminGetProfiles,
  adminGetBlogs,
  adminGetBlogBySlug,
  adminUpsertBlog,
  adminDeleteBlog,
  adminToggleBlogFeatured,
  adminToggleBlogPublished,
} from "@/lib/supabase";
import { fmtFollowers, totalReach } from "@/lib/platforms";
import {
  type Influencer,
  type CollaborationRequest,
  type ContactMessage,
  type Profile,
  Blog,
} from "@/types";
import AdminForm from "@/components/AdminForm";
import Toast from "@/components/Toast";
import Nav from "@/components/Nav";
import MobileShell from "@/components/MobileShell";
import BlogForm from "@/components/BlogForm";

// ─── REQUEST TABLE ────────────────────────────────────────────────────────────
function RequestsTab() {
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetRequests()
      .then(setRequests)
      .catch(() => setError("Failed to load requests"))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await adminUpdateRequestStatus(id, status);
    setRequests((p) =>
      p.map((r) => (r.id === id ? { ...r, status: status as any } : r)),
    );
  };

  if (loading)
    return (
      <div
        style={{
          color: "var(--gray)",
          padding: 20,
          textAlign: "center",
          fontSize: 14,
        }}
      >
        Loading…
      </div>
    );

  return (
    <div>
      <div style={{ marginBottom: 14, fontSize: 13, color: "var(--gray)" }}>
        {requests.length} collaboration requests
      </div>
      {requests.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "var(--gray)",
          }}
        >
          No requests yet.
        </div>
      ) : (
        requests.map((r) => (
          <div
            key={r.id}
            className="admin-row"
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                  {r.brand_name} → {(r as any).influencer?.name ?? "—"}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--gray)",
                    marginBottom: 4,
                  }}
                >
                  {r.contact_name} · {r.contact_email} ·{" "}
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
                {r.message && (
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--gray)",
                      lineHeight: 1.5,
                    }}
                  >
                    {r.message}
                  </div>
                )}
              </div>
              <span className={`badge badge-${r.status}`}>{r.status}</span>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["pending", "seen", "accepted", "declined"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(r.id, s)}
                  style={{
                    background: r.status === s ? "var(--lime)" : "none",
                    border: `1px solid ${r.status === s ? "var(--lime)" : "var(--border)"}`,
                    color: r.status === s ? "var(--black)" : "var(--gray)",
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 100,
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── MESSAGES TABLE ───────────────────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetMessages()
      .then(setMessages)
      .catch(() => setError("Failed to load messages"))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await adminUpdateMessageStatus(id, status);
    setMessages((p) =>
      p.map((m) => (m.id === id ? { ...m, status: status as any } : m)),
    );
  };

  if (loading)
    return (
      <div
        style={{
          color: "var(--gray)",
          padding: 20,
          textAlign: "center",
          fontSize: 14,
        }}
      >
        Loading…
      </div>
    );

  const TYPE_LABELS: Record<string, string> = {
    general: "General",
    problem: "Problem",
    advice: "Advice",
    assistance: "Assistance",
    request: "Request",
    partnership: "Partnership",
  };

  return (
    <div>
      <div style={{ marginBottom: 14, fontSize: 13, color: "var(--gray)" }}>
        {messages.length} messages ·{" "}
        {messages.filter((m) => m.status === "unread").length} unread
      </div>
      {messages.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "var(--gray)",
          }}
        >
          No messages yet.
        </div>
      ) : (
        messages.map((m) => {
          const isOpen = expanded === m.id;
          const contactInfo =
            m.preferred_contact === "email"
              ? m.sender_email
              : m.preferred_contact === "phone"
                ? m.sender_phone
                : m.preferred_contact === "whatsapp"
                  ? m.sender_phone
                  : m.social_handle;
          return (
            <div
              key={m.id}
              className="admin-row"
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0,
                cursor: "pointer",
                padding: "14px 16px",
              }}
              onClick={() => {
                setExpanded(isOpen ? null : m.id);
                if (!isOpen && m.status === "unread")
                  updateStatus(m.id, "read");
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 14 }}>
                      {m.sender_name}
                    </span>
                    <span className={`badge badge-${m.status}`}>
                      {m.status}
                    </span>
                    <span
                      style={{
                        background: "var(--s2)",
                        color: "var(--gray)",
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 100,
                        fontWeight: 600,
                      }}
                    >
                      {TYPE_LABELS[m.type] ?? m.type}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--gray)" }}>
                    {m.subject || "No subject"} ·{" "}
                    {new Date(m.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span style={{ color: "var(--gray)", fontSize: 16 }}>
                  {isOpen ? "▾" : "▸"}
                </span>
              </div>

              {isOpen && (
                <div
                  style={{
                    marginTop: 14,
                    borderTop: "1px solid var(--border)",
                    paddingTop: 14,
                    width: "100%",
                  }}
                >
                  {/* Contact info for admin to reply */}
                  <div
                    style={{
                      background: "var(--s2)",
                      borderRadius: "var(--r-sm)",
                      padding: "10px 14px",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--gray)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: 8,
                      }}
                    >
                      Reply via: {m.preferred_contact}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {m.preferred_contact === "email" && m.sender_email && (
                        <a
                          href={`mailto:${m.sender_email}`}
                          style={{ color: "var(--lime)" }}
                        >
                          {m.sender_email}
                        </a>
                      )}
                      {m.preferred_contact === "phone" && m.sender_phone && (
                        <a
                          href={`tel:${m.sender_phone}`}
                          style={{ color: "var(--lime)" }}
                        >
                          {m.sender_phone}
                        </a>
                      )}
                      {m.preferred_contact === "whatsapp" && m.sender_phone && (
                        <a
                          href={`https://wa.me/${m.sender_phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#25D366" }}
                        >
                          WhatsApp {m.sender_phone}
                        </a>
                      )}
                      {m.preferred_contact === "social" && m.social_handle && (
                        <span style={{ color: "var(--lime)" }}>
                          DM: {m.social_handle}
                        </span>
                      )}
                      {!contactInfo && (
                        <span style={{ color: "var(--gray)" }}>
                          No contact info provided
                        </span>
                      )}
                    </div>
                    {m.sender_email && m.preferred_contact !== "email" && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--gray)",
                          marginTop: 4,
                        }}
                      >
                        Also:{" "}
                        <a
                          href={`mailto:${m.sender_email}`}
                          style={{ color: "var(--gray)" }}
                        >
                          {m.sender_email}
                        </a>
                      </div>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "var(--gray)",
                      marginBottom: 14,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.message}
                  </p>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["unread", "read", "replied", "closed"].map((s) => (
                      <button
                        key={s}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(m.id, s);
                        }}
                        style={{
                          background: m.status === s ? "var(--lime)" : "none",
                          border: `1px solid ${m.status === s ? "var(--lime)" : "var(--border)"}`,
                          color:
                            m.status === s ? "var(--black)" : "var(--gray)",
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: 100,
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── USERS TABLE ──────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetProfiles()
      .then(setUsers)
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div
        style={{
          color: "var(--gray)",
          padding: 20,
          textAlign: "center",
          fontSize: 14,
        }}
      >
        Loading…
      </div>
    );

  return (
    <div>
      <div style={{ marginBottom: 14, fontSize: 13, color: "var(--gray)" }}>
        {users.length} registered users
      </div>
      {users.map((u) => (
        <div key={u.id} className="admin-row">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--s3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            {(u.full_name || u.email || "?")[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>
              {u.full_name || "—"}
            </div>
            <div style={{ fontSize: 12, color: "var(--gray)" }}>
              {u.email} · {new Date(u.created_at).toLocaleDateString()}
            </div>
          </div>
          <span
            style={{
              background:
                u.role === "admin" ? "rgba(182,255,46,.15)" : "var(--s2)",
              color: u.role === "admin" ? "var(--lime)" : "var(--gray)",
              border: `1px solid ${u.role === "admin" ? "rgba(182,255,46,.3)" : "var(--border)"}`,
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 9px",
              borderRadius: 100,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {u.role}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── CREATORS TAB ─────────────────────────────────────────────────────────────
function CreatorsTab() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Influencer | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [delConfirm, setDelConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetInfluencers()
      .then(setInfluencers)
      .catch(() => setError("Failed to load influencers"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;

    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);
  const fire = (msg: string) => setToast(msg);

  const handleSave = async (data: any) => {
    try {
      await adminUpsertInfluencer(data);
      const fresh = await adminGetInfluencers();
      setInfluencers(fresh);
      fire(editing ? "Creator updated ✓" : "Creator added 🎉");
    } catch {
      fire("Save failed");
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeleteInfluencer(id);
      setInfluencers((p) => p.filter((i) => i.id !== id));
      fire("Creator removed");
    } catch {
      fire("Delete failed");
    }
    setDelConfirm(null);
  };

  const handleToggle = async (inf: Influencer) => {
    try {
      await adminToggleFeatured(inf.id, !inf.is_featured);
      setInfluencers((p) =>
        p.map((i) =>
          i.id === inf.id ? { ...i, is_featured: !i.is_featured } : i,
        ),
      );
      fire("Featured updated ✓");
    } catch {
      fire("Update failed");
    }
  };

  const stats = {
    total: influencers.length,
    featured: influencers.filter((i) => i.is_featured).length,
    reach: influencers.reduce((a, i) => a + totalReach(i.socials ?? []), 0),
    cats: new Set(influencers.map((i) => i.category)).size,
  };

  if (loading)
    return (
      <div
        style={{
          color: "var(--gray)",
          padding: 20,
          textAlign: "center",
          fontSize: 14,
        }}
      >
        Loading creators…
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {[
          { l: "Creators", v: stats.total, lime: true },
          { l: "Featured", v: stats.featured, lime: false },
          { l: "Total Reach", v: fmtFollowers(stats.reach), lime: false },
          { l: "Categories", v: stats.cats, lime: false },
        ].map((s) => (
          <div key={s.l} className="admin-stat">
            <div className="admin-stat-label">{s.l}</div>
            <div className={`admin-stat-val ${s.lime ? "lime" : ""}`}>
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setEditing(null);
          setShowForm(true);
        }}
        style={{
          width: "100%",
          background: "var(--lime)",
          border: "none",
          color: "var(--black)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 700,
          padding: "12px",
          borderRadius: "var(--r-sm)",
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        + Add Creator
      </button>

      {influencers.map((inf) => (
        <div key={inf.id} className="admin-row">
          <div
            className="overflow-hidden flex"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: inf.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 12,
              color: "#000",
              flexShrink: 0,
            }}
          >
            <img
              className="w-full h-full object-cover"
              src={inf?.avatar}
              alt={inf.name}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
              {inf.is_featured && (
                <span style={{ color: "var(--lime)", marginRight: 4 }}>★</span>
              )}
              {inf.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--gray)" }}>
              {inf.category} · {inf.location} · {(inf.socials ?? []).length}{" "}
              socials · {fmtFollowers(totalReach(inf.socials ?? []))} reach
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
            <button
              onClick={() => handleToggle(inf)}
              style={{
                background: "none",
                border: `1px solid ${inf.is_featured ? "rgba(182,255,46,.35)" : "var(--border)"}`,
                color: inf.is_featured ? "var(--lime)" : "var(--gray)",
                padding: "5px 9px",
                borderRadius: "var(--r-xs)",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {inf.is_featured ? "★" : "☆"}
            </button>
            <button
              onClick={() => {
                setEditing(inf);
                setShowForm(true);
              }}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                color: "var(--gray)",
                padding: "5px 9px",
                borderRadius: "var(--r-xs)",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "var(--font-body)",
              }}
            >
              Edit
            </button>
            {delConfirm === inf.id ? (
              <button
                onClick={() => handleDelete(inf.id)}
                style={{
                  background: "none",
                  border: "1px solid #F87171",
                  color: "#F4843A",
                  padding: "5px 9px",
                  borderRadius: "var(--r-xs)",
                  cursor: "pointer",
                  fontSize: 11,
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                }}
              >
                Sure?
              </button>
            ) : (
              <button
                onClick={() => setDelConfirm(inf.id)}
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  color: "var(--gray)",
                  padding: "5px 9px",
                  borderRadius: "var(--r-xs)",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ))}

      {showForm && (
        <AdminForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// ___________ BLOGS TAB _________________________________________________________
function BlogsTab() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editing, setEditing] = useState<Blog | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    adminGetBlogs()
      .then(setBlogs)
      .finally(() => setLoading(false));
  }, []);

  const refresh = async () => {
    const fresh = await adminGetBlogs();

    setBlogs(fresh);
  };

  const fire = (msg: string) => {
    setToast(msg);

    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (data: Partial<Blog>) => {
    try {
      await adminUpsertBlog(data);

      await refresh();

      fire(editing ? "Blog updated ✓" : "Blog created 🎉");
    } catch {
      fire("Failed to save blog");
    }

    setShowForm(false);

    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeleteBlog(id);

      setBlogs((p) => p.filter((b) => b.id !== id));

      fire("Blog deleted");
    } catch {
      fire("Delete failed");
    }
  };

  const toggleFeatured = async (blog: Blog) => {
    try {
      await adminToggleBlogFeatured(blog.id, !blog.featured);

      await refresh();
    } catch {
      fire("Update failed");
    }
  };

  const togglePublished = async (blog: Blog) => {
    try {
      await adminToggleBlogPublished(blog.id, !blog.is_published);

      await refresh();
    } catch {
      fire("Update failed");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: 20,
          color: "var(--gray)",
        }}
      >
        Loading blogs...
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => {
          setEditing(null);

          setShowForm(true);
        }}
        style={{
          width: "100%",
          background: "var(--lime)",
          border: "none",
          color: "black",
          padding: "12px",
          borderRadius: 12,
          fontWeight: 700,
          marginBottom: 18,
          cursor: "pointer",
        }}
      >
        + Add Blog
      </button>

      {blogs.length === 0 ? (
        <div
          style={{
            color: "var(--gray)",
            textAlign: "center",
            padding: "40px 20px",
          }}
        >
          No blogs yet.
        </div>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id} className="admin-row">
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                {blog.featured && (
                  <span
                    style={{
                      color: "var(--lime)",
                    }}
                  >
                    ★
                  </span>
                )}{" "}
                {blog.title}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "var(--gray)",
                }}
              >
                /{blog.slug}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 6,
                  flexWrap: "wrap",
                }}
              >
                <span
                  className={`badge ${
                    blog.is_published ? "badge-accepted" : "badge-pending"
                  }`}
                >
                  {blog.is_published ? "Published" : "Draft"}
                </span>

                {blog.tags?.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 10,
                      background: "var(--s2)",
                      padding: "3px 8px",
                      borderRadius: 100,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <button onClick={() => toggleFeatured(blog)}>
                {blog.featured ? "★" : "☆"}
              </button>

              <button
                onClick={() => togglePublished(blog)}
                style={{
                  background: "none",
                  border: "1px solid var(--lime-dim)",
                  padding: "5px 9px",
                  borderRadius: "var(--r-xs)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                }}
                className="text-[#F4843A] hover:text-[var(--lime-dk)] transition "
              >
                {blog.is_published ? "Unpublish" : "Publish"}
              </button>

              <button
                onClick={() => {
                  setEditing(blog);
                  setShowForm(true);
                }}
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  padding: "5px 9px",
                  borderRadius: "var(--r-xs)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                }}
                className="text-[var(--gray)] hover:text-[var(--lime-dk)] transition "
              >
                Edit
              </button>

              <button
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  padding: "5px 9px",
                  borderRadius: "var(--r-xs)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                }}
                className="text-[var(--lime-dim)] hover:text-[var(--lime-dk)] transition "
                onClick={() => handleDelete(blog.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {showForm && (
        <BlogForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);

            setEditing(null);
          }}
        />
      )}

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─── ADMIN PAGE ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<
    "creators" | "requests" | "messages" | "users" | "blogs"
  >("creators");

  useEffect(() => {
    if (!loading && !isAdmin) router.replace("/");
  }, [isAdmin, loading]);

  if (loading || !isAdmin)
    return (
      <>
        <Nav />
        <MobileShell>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              color: "var(--gray)",
              fontSize: 14,
            }}
          >
            {loading ? "Loading…" : "Access denied"}
          </div>
        </MobileShell>
      </>
    );

  const TABS = [
    { id: "creators", label: "Creators" },
    { id: "requests", label: "Requests" },
    { id: "messages", label: "Messages" },
    { id: "users", label: "Users" },
    { id: "blogs", label: "Blogs" },
  ] as const;

  return (
    <>
      <Nav />
      <MobileShell>
        <div className="admin-inner" style={{ padding: "24px 20px 100px" }}>
          <div style={{ marginBottom: 20 }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 3,
              }}
            >
              Admin Panel
            </h1>
            <div style={{ fontSize: 13, color: "var(--gray)" }}>
              Manage KOLI platform
            </div>
          </div>

          <div className="admin-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`admin-tab ${tab === t.id ? "on" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "creators" && <CreatorsTab />}
          {tab === "requests" && <RequestsTab />}
          {tab === "messages" && <MessagesTab />}
          {tab === "users" && <UsersTab />}
          {tab === "blogs" && <BlogsTab />}
        </div>
      </MobileShell>
    </>
  );
}

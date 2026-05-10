"use client";

import { useState } from "react";
import type { Blog } from "@/types";

type Props = {
  initial?: Blog | null;
  onSave: (data: Partial<Blog>) => Promise<void> | void;
  onCancel: () => void;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

export default function BlogForm({
  initial,
  onSave,
  onCancel,
}: Props) {
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImage, setCoverImage] = useState(
    initial?.cover_image ?? "",
  );

  const [featured, setFeatured] = useState(
    initial?.featured ?? false,
  );

  const [published, setPublished] = useState(
    initial?.is_published ?? true,
  );

  const [tags, setTags] = useState(
    initial?.tags?.join(", ") ?? "",
  );

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    setTitle(value);

    // auto-generate slug only for new posts
    if (!initial?.slug) {
      setSlug(slugify(value));
    }
  };

  const submit = async () => {
    if (!title.trim()) {
      alert("Title required");
      return;
    }

    if (!slug.trim()) {
      alert("Slug required");
      return;
    }

    try {
      setSaving(true);

      await onSave({
        ...initial,
        title,
        slug: slugify(slug),
        excerpt,
        content,
        cover_image: coverImage,
        featured,
        is_published: published,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.72)",
        zIndex: 1000,
        overflowY: "auto",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 760,
          margin: "40px auto",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-lg)",
          padding: 20,
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 4,
            }}
          >
            {initial ? "Edit Blog" : "New Blog"}
          </h2>

          <div
            style={{
              fontSize: 13,
              color: "var(--gray)",
            }}
          >
            Manage blog content
          </div>
        </div>

        {/* TITLE */}
        <div style={{ marginBottom: 16 }}>
          <label className="admin-label">
            Title
          </label>

          <input
            value={title}
            onChange={handleTitleChange}
            placeholder="Blog title"
            style={inputStyle}
          />
        </div>

        {/* SLUG */}
        <div style={{ marginBottom: 16 }}>
          <label className="admin-label">
            Slug
          </label>

          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="blog-slug"
            style={inputStyle}
          />
        </div>

        {/* COVER IMAGE */}
        <div style={{ marginBottom: 16 }}>
          <label className="admin-label">
            Cover Image
          </label>

          <input
            value={coverImage}
            onChange={(e) =>
              setCoverImage(e.target.value)
            }
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

        {/* EXCERPT */}
        <div style={{ marginBottom: 16 }}>
          <label className="admin-label">
            Excerpt
          </label>

          <textarea
            value={excerpt}
            onChange={(e) =>
              setExcerpt(e.target.value)
            }
            placeholder="Short summary..."
            rows={4}
            style={textareaStyle}
          />
        </div>

        {/* CONTENT */}
        <div style={{ marginBottom: 16 }}>
          <label className="admin-label">
            Content
          </label>

          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder="Write markdown or blog content..."
            rows={14}
            style={textareaStyle}
          />
        </div>

        {/* TAGS */}
        <div style={{ marginBottom: 16 }}>
          <label className="admin-label">
            Tags
          </label>

          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="marketing, creators, tiktok"
            style={inputStyle}
          />

          <div
            style={{
              fontSize: 11,
              color: "var(--gray)",
              marginTop: 4,
            }}
          >
            Separate tags with commas
          </div>
        </div>

        {/* TOGGLES */}
        <div
          style={{
            display: "flex",
            gap: 18,
            marginBottom: 22,
            flexWrap: "wrap",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
            }}
          >
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) =>
                setFeatured(e.target.checked)
              }
            />

            Featured
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
            }}
          >
            <input
              type="checkbox"
              checked={published}
              onChange={(e) =>
                setPublished(e.target.checked)
              }
            />

            Published
          </label>
        </div>

        {/* ACTIONS */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onCancel}
            disabled={saving}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--gray)",
              padding: "10px 16px",
              borderRadius: "var(--r-sm)",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={saving}
            style={{
              background: "var(--lime)",
              border: "none",
              color: "var(--black)",
              padding: "10px 18px",
              borderRadius: "var(--r-sm)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {saving ? "Saving..." : "Save Blog"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--s2)",
  border: "1px solid var(--border)",
  color: "white",
  padding: "12px 14px",
  borderRadius: "var(--r-sm)",
  fontSize: 14,
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 120,
};
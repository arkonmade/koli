import { getBlogBySlug, getBlogs } from "@/lib/supabase";
import Nav from "@/components/Nav";
import MobileShell from "@/components/MobileShell";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 300;

const socials = [
  {
    url: "https://x.com/koliapp",
    icon: "https://img.icons8.com/?size=100&id=yoQabS8l0qpr&format=png&color=000000",
  },
  {
    url: "https://pinterest.com/koliapp",
    icon: "https://img.icons8.com/?size=100&id=yoQabS8l0qpr&format=png&color=000000",
  },
  {
    url: "https://wa.me/koliapp",
    icon: "https://img.icons8.com/?size=100&id=yoQabS8l0qpr&format=png&color=000000",
  },
  {
    url: "https://youtube.com/@koliapp",
    icon: "https://img.icons8.com/?size=100&id=9a46bTk3awwI&format=png&color=000000",
  },
];

// 🔥 SEO: static params for blog indexing
export async function generateStaticParams() {
  try {
    const blogs = await getBlogs();
    return blogs.map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

// 🔥 SEO metadata per blog
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const blog = await getBlogBySlug(params.slug);

    return {
      title: `${blog.title} | KOLI Blog`,
      description: blog.excerpt,
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        images: [blog.cover_image],
        type: "article",
      },
    };
  } catch {
    return {
      title: "Blog | KOLI",
    };
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let blog: any;

  try {
    blog = await getBlogBySlug(params.slug);
  } catch {
    notFound();
  }

  return (
    <>
      <Nav />

      <MobileShell>
        <article className="w-[90%]  mx-auto py-12 text-white">
          <div className="max-w-[860px] mx-auto">
            <Link
              className="p-[1rem] inline-flex mb-3 bg-[var(--lime-dim)] rounded-3xl text-[var(--white)] font-[500] text-[1rem] transition hover:bg-[var(--lime-dk)] hover:text-[var(--black)]"
              href={"/blog"}
            >
              Back to Blogs
            </Link>

            <h1 className="text-3xl font-bold mb-1">{blog.title}</h1>
            <p className="text-[20px] font-geist mb-4 text-gray-200">
              {blog.excerpt}
            </p>

            {/* meta */}
            <p className="text-sm text-gray-400 mb-6">
              {new Date(blog.created_at).toDateString()}
            </p>
          </div>

          <div className="max-w-[1220px] flex mx-auto h-[460px] overflow-hidden mb-8 bg-[#8fd420]">
            <img
              src={blog.cover_image}
              className="w-full object-contain"
              alt={blog.title}
            />
          </div>

          <div className="max-w-[720px] relative mx-auto pl-[9rem]">
            <div className="flex flex-col absolute -gap-1 top-0 left-0">
              {socials.map((s, i) => {
                const rotation =
                  i % 2 === 0 ? "rotate-[5deg]" : "-rotate-[5deg]";
                return (
                  <Link
                    key={i}
                    href={s.url}
                    className={`w-[40px] h-[40px] relative bg-[#0b0b0f] p-1 rounded-2xl overflow-hidden border-[1px] border-[#27272a] ${rotation}`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={s.icon}
                      alt="Social Media"
                    />
                  </Link>
                );
              })}
            </div>
            <div className="prose prose-invert max-w-none">{blog.content}</div>

            <div className="flex gap-1 flex-wrap">
              {blog.tags.length > 0 &&
                blog.tags.map((tag: any, i: number) => (
                  <span key={i}>{tag}</span>
                ))}
            </div>
          </div>
        </article>
      </MobileShell>
    </>
  );
}

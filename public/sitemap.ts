import { getInfluencers, adminGetBlogs } from "@/lib/supabase";

// sitemap.ts
export default async function sitemap() {
  const influencers = await getInfluencers();
  const blogs = await adminGetBlogs();

  return [
    {
      url: "https://koli.netlify.app",
      lastModified: new Date(),
    },

    {
      url: "https://koli.netlify.app/browse",
      lastModified: new Date(),
    },

    ...influencers.map((inf) => ({
      url: `https://koli.netlify.app/influencer/${inf.slug}`,
      lastModified: new Date(),
    })),

    ...blogs.map((blog) => ({
      url: `https://koli.netlify.app/blog/${blog.slug}`,
      lastModified: new Date(),
    })),
  ];
}

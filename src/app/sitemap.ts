import { getInfluencers, adminGetBlogs } from '@/lib/supabase'

export default async function sitemap() {
  const influencers = await getInfluencers()
  const blogs = await adminGetBlogs()

  return [
    {
      url: 'https://koli.rw',
      lastModified: new Date(),
    },
    {
      url: 'https://koli.rw/browse',
      lastModified: new Date(),
    },

    ...influencers.map((inf) => ({
      url: `https://koli.rw/influencer/${inf.slug}`,
      lastModified: new Date(),
    })),

    ...blogs.map((blog) => ({
      url: `https://koli.rw/blog/${blog.slug}`,
      lastModified: new Date(),
    })),
  ]
}
// app/blog/page.tsx

import Footer from "@/components/Footer";
import MobileShell from "@/components/MobileShell";
import Nav from "@/components/Nav";
import { adminGetBlogs } from "@/lib/supabase";
import Link from "next/link";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  created_at: string;
  featured: boolean;
};

const FeaturedBlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-[#0b0b0f] hover:bg-[#111117] transition border border-[#1c1c22]">
      <div className="md:w-2/5 w-full">
        <img
          src={blog.cover_image}
          alt={blog.title}
          className="w-full h-[180px] md:h-full object-cover rounded-lg"
        />
      </div>

      {/* content */}
      <div className="md:w-3/5 flex flex-col gap-2">
        <p className="text-xs text-[#a1a1aa]">
          {new Date(blog.created_at)
            .toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })
            .replace(",", " -")}
        </p>

        <Link href={`/blog/${blog.slug}`}>
          <h2 className="text-xl font-bold text-white hover:text-[#8fd420] transition">
            {blog.title}
          </h2>
        </Link>
        <p className="text-sm text-[#a1a1aa] line-clamp-3">{blog.excerpt}</p>

        <p className="text-xs text-[var(--gray-mid)]">
          Author: <span className="text-[#4F73B7] ">arkonmade</span>
        </p>
      </div>
    </div>
  );
};
const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="block bg-[#0b0b0f] border border-[#1c1c22] rounded-xl overflow-hidden hover:scale-[1.01] transition"
    >
      <img src={blog.cover_image} className="w-full h-[180px] object-cover" />

      <div className="p-4 flex flex-col gap-2">
        <p className="text-xs text-[#a1a1aa]">
          {new Date(blog.created_at)
            .toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })
            .replace(",", " -")}
        </p>

        <h3 className="font-semibold text-white">{blog.title}</h3>

        <p className="text-sm text-[#a1a1aa] line-clamp-2">{blog.excerpt}</p>
        <p className="text-xs text-[var(--gray-mid)]">
          Author: <span className="text-[#4F73B7] ">arkonmade</span>
        </p>
      </div>
    </Link>
  );
};

export default async function BlogPage() {
  const blogs: Blog[] = await adminGetBlogs();

  const featuredBlogs = blogs.filter((b) => b.featured);
  const allBlogs = blogs.filter((b) => !b.featured);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://arkonmade.netlify.app/#organization",

                name: "arkon",

                alternateName: [
                  "arkonmade",
                  "Arkos Studio",
                  "Arkon Rwanda",
                  "Arkon Musanze",
                  "Arkon Academy",
                  "Arkon Software",
                ],

                url: "https://arkonmade.netlify.app",

                logo: {
                  "@type": "ImageObject",
                  url: "https://i.pinimg.com/280x280_RS/48/ce/65/48ce65ecdb18b6df36ffbd0eadbffe0a.jpg",
                },

                sameAs: [
                  "https://github.com/arkonmade",
                  "https://www.pinterest.com/arkonmade",
                  "https://www.behance.net/arkonmade",
                  "https://www.dribbble.com/arkonmade",
                  "https://linkedin.com/company/arkonmade",
                  "https://instagram.com/arkonmade",
                  "https://maps.app.goo.gl/sFPiyTp5WLExSSen6",
                ],

                description:
                  "Arkon is a frontier AI product studio building modern digital products, AI-powered platforms, software systems, and digital experiences.",

                foundingLocation: {
                  "@type": "Place",
                  name: "Musanze, Rwanda",
                },

                areaServed: {
                  "@type": "Country",
                  name: "Rwanda",
                },

                knowsAbout: [
                  "Artificial Intelligence",
                  "Software Engineering",
                  "Product Design",
                  "Web Applications",
                  "Influencer Technology",
                  "Analytics Platforms",
                  "Startup Technology",
                ],

                keywords: [
                  "arkonmade",
                  "arkos studio",
                  "arkon rwanda",
                  "arkon musanze",
                  "arkon academy",
                  "arkon software",
                ],
              },

              {
                "@type": "SoftwareApplication",
                "@id": "https://koliapp.netlify.app/#koli",

                name: "Koli",

                applicationCategory: "BusinessApplication",

                operatingSystem: "Web",

                url: "https://koliapp.netlify.app",

                logo: {
                  "@type": "ImageObject",
                  url: "https://koliapp.netlify.app/favicon.svg",
                },

                creator: {
                  "@id": "https://arkonmade.netlify.app/#organization",
                },

                publisher: {
                  "@id": "https://arkonmade.netlify.app/#organization",
                },

                description:
                  "Koli is an influencer intelligence and analytics platform helping brands and businesses discover, evaluate, and connect with top Rwandan influencers using creator metrics, audience insights, and campaign intelligence.",

                areaServed: {
                  "@type": "Country",
                  name: "Rwanda",
                },

                audience: {
                  "@type": "Audience",
                  audienceType: [
                    "Brands",
                    "Businesses",
                    "Marketing Teams",
                    "Agencies",
                  ],
                },

                featureList: [
                  "Influencer Discovery",
                  "Audience Analytics",
                  "Creator Metrics",
                  "Campaign Intelligence",
                  "Brand Matching",
                  "Influencer Insights",
                ],

                knowsAbout: [
                  "Influencer Marketing",
                  "Creator Economy",
                  "Social Media Analytics",
                  "Campaign Strategy",
                ],
              },

              {
                "@type": "Blog",
                "@id": "https://koliapp.netlify.app/blog/#blog",

                name: "Koli Insights",

                url: "https://koliapp.netlify.app/blog",

                description:
                  "Insights, analytics, and strategies around influencer partnerships, creator marketing, social media campaigns, influencer analytics, and digital brand growth.",

                publisher: {
                  "@id": "https://koliapp.netlify.app/#koli",
                },

                author: {
                  "@id": "https://arkonmade.netlify.app/#organization",
                },

                inLanguage: "en",

                about: [
                  "Influencer Marketing",
                  "Creator Analytics",
                  "Brand Partnerships",
                  "Social Media Strategy",
                  "Digital Campaigns",
                  "Influencer Intelligence",
                ],
              },
            ],
          }),
        }}
      />

      <Nav />

      <MobileShell>
        <section className="relative min-h-[420px] h-full flex items-center justify-center bg-[url('/blog_hero.jpg')] bg-cover bg-center bg-fixed">
          <div className="absolute inset-0 bg-gradient-to-b from-[#060608] via-[#060608de] to-[#060608] pointer-events-none" />

          <div className="relative w-[90%]">
            <div className="max-w-[420px] items-center m-auto">
              <div className="flex -space-x-1">
                <div className="w-[45px] h-[45px] rounded-xl p-2 cursor-pointer transition bg-[#2c2c38] border-[1px] border-[#52525b] hover:bg-[var(--s4)] hover:border-[#a1a1aa] rotate-[5deg] hover:rotate-[-5deg]">
                  <img
                    className="w-[28px] h-[28px]"
                    src="https://framerusercontent.com/images/UGOf15HarMoiVLKyFn2iNYEjkb4.png"
                  />
                </div>
                <div className="w-[45px] h-[45px] rounded-xl p-2 cursor-pointer transition bg-[#2c2c38] border-[1px] border-[#52525b] hover:bg-[var(--s4)] hover:border-[#a1a1aa] rotate-[-5deg] hover:rotate-[5deg]">
                  <img
                    className="w-[28px] h-[28px]"
                    src="https://framerusercontent.com/images/v7gFR5d5z6MrutqqeIWoho5HNg.png"
                    alt=""
                  />
                </div>
                <div className="w-[45px] h-[45px] rounded-xl p-2 cursor-pointer transition bg-[#2c2c38] border-[1px] border-[#52525b] hover:bg-[var(--s4)] hover:border-[#a1a1aa] rotate-[5deg] hover:rotate-[-5deg]">
                  <img
                    className="w-[28px] h-[28px]"
                    src="https://framerusercontent.com/images/lYygx5A6nEE09awFrvQv8c7ELnA.png"
                  />
                </div>
              </div>
              <div className="w-full pt-[1rem]">
                <h1 className="font-[700] text-[2.4rem] font-geist">
                  Koli Insights
                </h1>
                <p className="text-[20px] font-geist font-[500] text-[#a1a1aa] ">
                  Everything you need to understand and improve influencer
                  partnerships.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
              <h1></h1>
              <Link
                href={"https://chat.whatsapp.com/BE3d0mmh2Kf5PwIxtOXXTC"}
                target="_blank"
                className="bg-[#b6ff2e] text-[#060608] px-6 py-3 rounded-full font-semibold hover:bg-[#8fd420] transition"
              >
                Join Community
              </Link>

              {/* avatars */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex -space-x-2">
                  <img
                    className="w-8 h-8 rounded-full cursor-pointer transition hover:border-[#8fd420] border-2 border-white"
                    src="https://i.pravatar.cc/40?img=1"
                  />
                  <img
                    className="w-8 h-8 rounded-full cursor-pointer transition hover:border-[#8fd420] border-2 border-white"
                    src="https://i.pravatar.cc/40?img=2"
                  />
                  <img
                    className="w-8 h-8 rounded-full cursor-pointer transition hover:border-[#8fd420] border-2 border-white"
                    src="https://i.pravatar.cc/40?img=3"
                  />
                </div>
                <span>Join other 3,000+ users</span>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-[#060608]">
          <div className="w-[90%] max-w-[1200px] mx-auto py-12 flex flex-col gap-10">
            {/* featured  */}
            {featuredBlogs.length > 0 && (
              <>
                <div className="flex flex-col gap-6">
                  <h2 className="text-white text-xl font-semibold">Featured</h2>

                  <div className="flex flex-col gap-6">
                    {featuredBlogs.map((blog) => (
                      <FeaturedBlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col gap-6">
              <h2 className="text-white text-xl font-semibold">Latest Posts</h2>
              <div className="grid grid-cols-1 justify-between md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </MobileShell>
      <Footer />
    </>
  );
}

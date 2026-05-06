import MobileShell from "@/components/MobileShell";
import Nav from "@/components/Nav";
import { getBlogs } from "@/lib/supabase";
import Link from "next/link";

const FeaturedBlogCard = ({ blog }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-[#0b0b0f] hover:bg-[#111117] transition border border-[#1c1c22]">
      {/* image */}
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

        <p className="text-xs text-[#777]">By Author</p>
      </div>
    </div>
  );
};
const BlogCard = ({ blog }) => {
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
      </div>
    </Link>
  );
};

export default async function BlogPage() {
  const blogs = await getBlogs();

  const featuredBlogs = blogs.filter((b) => b.featured);
  const allBlogs = blogs.filter((b) => !b.featured);

  return (
    <>
      <Nav />

      <MobileShell>
        <h1>Blog</h1>
        <section className="relative min-h-[420px] h-full flex items-center justify-center bg-[url('/blog_hero.jpg')] bg-cover bg-center bg-fixed">
          <div className="absolute inset-0 bg-gradient-to-b from-[#060608] via-[#060608de] to-[#060608] pointer-events-none" />

          <div className="relative w-[90%]">
            <div className="max-w-[420px] items-center m-auto">
              <div className="flex -space-x-1">
                <div className="w-[45px] h-[45px] rounded-xl p-2 cursor-pointer transition bg-[#2c2c38] border-[1px] border-[#52525b] hover:bg-[#B6FF2E1F] hover:border-[#a1a1aa] rotate-[5deg]">
                  <img
                    className="w-[28px] h-[28px]"
                    src="https://framerusercontent.com/images/UGOf15HarMoiVLKyFn2iNYEjkb4.png"
                  />
                </div>
                <div className="w-[45px] h-[45px] rounded-xl p-2 cursor-pointer transition bg-[#2c2c38] border-[1px] border-[#52525b] hover:bg-[#B6FF2E1F] hover:border-[#a1a1aa] rotate-[-5deg]">
                  <img
                    className="w-[28px] h-[28px]"
                    src="https://framerusercontent.com/images/v7gFR5d5z6MrutqqeIWoho5HNg.png"
                    alt=""
                  />
                </div>
                <div className="w-[45px] h-[45px] rounded-xl p-2 cursor-pointer transition bg-[#2c2c38] border-[1px] border-[#52525b] hover:bg-[#B6FF2E1F] hover:border-[#a1a1aa] rotate-[5deg]">
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
              <button className="bg-[#b6ff2e] text-[#060608] px-6 py-3 rounded-full font-semibold hover:bg-[#8fd420] transition">
                Join Community
              </button>

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

        {blogs.map((blog) => (
          <div key={blog.id}>
            <Link href={`/blog/${blog.slug}`}>
              <h2>{blog.title}</h2>
            </Link>
            <p>{blog.excerpt}</p>
          </div>
        ))}
      </MobileShell>
    </>
  );
}

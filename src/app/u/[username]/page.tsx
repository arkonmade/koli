import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import MobileShell from "@/components/MobileShell";
import { useAuth } from "@/hooks/useAuth";
import { getProfileByUsername } from "@/lib/supabase";


export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  if (!username) return notFound();


  return (
    <>
      <Nav />

      <MobileShell>
        <div className="min-h-[70vh] flex items-center justify-center text-white">
          <div className="text-center max-w-md">

            
            {/* avatar placeholder */}
            <div className="w-20 h-20 mx-auto rounded-full bg-[var(--s2)] mb-5 animate-pulse" />

            <h1 className="text-3xl font-bold mb-2">
              @{username}
            </h1>

            <p className="text-gray-400 mb-6">
              This profile page is coming soon.
            </p>

            <div className="px-4 py-2 inline-block rounded-full bg-[#111117] border border-[#1c1c22] text-sm text-gray-400">
              🚧 Under Development
            </div>
          </div>
        </div>
      </MobileShell>
    </>
  );
}
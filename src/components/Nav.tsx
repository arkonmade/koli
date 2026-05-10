"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/supabase";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LogOut, User, UserRound } from "lucide";

export default function Nav() {
  const path = usePathname();
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user, profile, isAdmin, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse" },
    {href: "/blog", label:"Articles"},
    // ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    ...(user
      ? [
          {
            href: "/contact",
            label: "Talk to Us",
          },
        ]
      : []),
  ];

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="desk-nav">
      <Link href="/" className="logo">
        KO<em>LI</em>
      </Link>

      <div className="desk-links">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`dnav ${l.href === "/contact" ? "px-3 py-2 bg-lime-500 text-white rounded" : ""} ${
              path === l.href || path.startsWith(l.href + "/") ? "act" : ""
            }`}
          >
            {l.label}
          </Link>
        ))}

        {!loading &&
          (user ? (
            <>
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setOpenMenu((prev) => !prev)}
                  className="rounded-[16px] w-[38px] h-[38px] overflow-hidden bg-[var(--lime-dk)] flex items-center justify-center"
                >
                  <img
                    src={
                      profile?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        profile?.full_name || "User",
                      )}&background=random`
                    }
                    alt={profile?.full_name || "User avatar"}
                    className="rounded-[14px] object-cover w-[35px] h-[35px] "
                  />
                </button>

                <div
                  className={`absolute right-0 mt-4 w-[240px] border border-[var(--gray-dark)] origin-top-right rounded-[1rem] bg-[var(--s1)] shadow-[0_20px_50px_var(--lime-dim)] transition-all duration-200 ${
                    openMenu
                      ? "translate-y-0 scale-100 opacity-100"
                      : "pointer-events-none -translate-y-2 scale-95 opacity-0"
                  }`}
                >
                  <div className="p-2 pb-0">
                    <div className="space-y-2">
                      <div className="flex mb-[1rem] p-[.6rem] bg-[var(--gray-dark)] gap-2 items-center flex-nowrap justify-between rounded-[.6rem] ">
                        <div className="">
                          <h3 className="font-[600] text-[1rem] font-geist text-[var(--white)] ">
                            {profile?.full_name}
                          </h3>
                          <p className="cursor-pointer text-[12px] text-[var(--gray)] truncate w-full font-[200] ">
                            {profile?.email}
                          </p>
                        </div>
                        <div className="min-w-[3rem] h-[3rem] relative flex overflow-hidden rounded-[1.3rem] ">
                          <img
                            src={
                              profile?.avatar_url ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                profile?.full_name || "User",
                              )}&background=random`
                            }
                            alt={profile?.full_name || "User avatar"}
                          />
                        </div>
                      </div>
                      <>
                        <button className="flex w-full items-center justify-between rounded-[9px] px-4 py-2 transition active:bg-[var(--gray-dark)] hover:bg-[var(--gray-mid)]">
                          <div className="flex items-center gap-2">
                            <span>
                              <svg
                                // xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                            </span>

                            <span className="text-[14px] font-normal text-[var(--gray)]">
                              Profile
                            </span>
                          </div>
                        </button>
                        <Link
                          href={"/admin"}
                          className="flex w-full items-center justify-between rounded-[9px] px-4 py-2 transition active:bg-[var(--gray-dark)] hover:bg-[var(--gray-mid)]"
                        >
                          <div className="flex items-center gap-2">
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1"
                              >
                                <rect width="7" height="9" x="3" y="3" rx="1" />
                                <rect
                                  width="7"
                                  height="5"
                                  x="14"
                                  y="3"
                                  rx="1"
                                />
                                <rect
                                  width="7"
                                  height="9"
                                  x="14"
                                  y="12"
                                  rx="1"
                                />
                                <rect
                                  width="7"
                                  height="5"
                                  x="3"
                                  y="16"
                                  rx="1"
                                />
                              </svg>
                            </span>

                            <span className="text-[14px] font-normal text-[var(--gray)]">
                              Dashboard
                            </span>
                          </div>
                        </Link>
                      </>
                    </div>

                    {/* DIVIDER */}
                    <div className="my-5 border-t border-[var(--gray-mid)]" />

                    {/* BOTTOM ITEMS */}
                    <div className="space-y-2 pb-2">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-[9px] px-6 py-2 transition bg-[var(--s2)] hover:bg-[var(--gray-mid)]"
                      >
                        <span>
                          <svg
                            width="21"
                            height="21"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1"
                          >
                            <path d="m16 17 5-5-5-5" />
                            <path d="M21 12H9" />
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          </svg>
                        </span>

                        <span className="text-[16px] font-medium text-[var(--gray)]">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="dnav">
                Login
              </Link>

              <Link href="/auth/signup" className="dnav cta">
                Sign Up
              </Link>
            </>
          ))}
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, FormEvent, Suspense } from "react";
import {
  Search, Download, LogOut, Settings, ChevronDown,
  Menu, X, Gamepad2, Smartphone, Monitor, Globe,
  Zap, TrendingUp, Star, Shield,
} from "lucide-react";

const NAV = [
  { label: "Android", href: "/apps?platform=android", icon: Smartphone },
  { label: "Windows", href: "/apps?platform=windows", icon: Monitor },
  { label: "Mac", href: "/apps?platform=mac", icon: Globe },
  { label: "Games", href: "/apps?category=games", icon: Gamepad2 },
  { label: "Top Apps", href: "/apps", icon: TrendingUp },
  { label: "New", href: "/apps?sort=new", icon: Zap },
];

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [focused, setFocused] = useState(false);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/apps?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
      <div className={`relative flex items-center transition-all duration-200 ${focused ? "scale-[1.01]" : ""}`}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search apps, games, software..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:bg-white/15 focus:border-blue-400 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-400 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar - dark */}
      <div className="bg-[#0d1117] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white hidden sm:block tracking-tight">
                APK<span className="text-blue-400">Hub</span>
              </span>
            </Link>

            {/* Search */}
            <Suspense fallback={<div className="flex-1 max-w-2xl h-10 bg-white/10 rounded-xl animate-pulse" />}>
              <SearchBar />
            </Suspense>

            {/* User actions */}
            <div className="flex items-center gap-2 shrink-0">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {session.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-200 hidden md:block">{session.user?.name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a2035] border border-white/10 rounded-2xl shadow-2xl py-2 z-20">
                        <div className="px-4 py-2 border-b border-white/5 mb-1">
                          <p className="text-xs font-medium text-gray-300">{session.user?.name}</p>
                          <p className="text-xs text-gray-500">{session.user?.email}</p>
                        </div>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <Settings className="w-4 h-4 text-blue-400" />
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => { signOut(); setUserMenuOpen(false); }}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 w-full text-left transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login" className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-colors hidden sm:block">
                    Login
                  </Link>
                  <Link href="/auth/register" className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-colors shadow-sm">
                    Sign up
                  </Link>
                </div>
              )}

              <button className="md:hidden p-2 rounded-xl hover:bg-white/10 text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div className="bg-[#161b27] border-b border-white/5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-1 h-11 overflow-x-auto scrollbar-hide">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || (href.includes("?") && pathname === "/apps");
              return (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
            <div className="ml-auto flex items-center gap-3 text-xs text-gray-500 pl-4 border-l border-white/5">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-500" /> Safe & Verified</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" /> User Rated</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1a2035] border-b border-white/10 px-4 py-3 flex flex-col gap-1">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          {!session && (
            <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

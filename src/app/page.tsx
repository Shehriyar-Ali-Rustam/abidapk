import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AppCard } from "@/components/AppCard";
import { AppWithCategory } from "@/types";
import { formatDownloads } from "@/lib/utils";
import {
  Download, TrendingUp, Star, Shield, Zap, Search,
  ChevronRight, Flame, Sparkles, Gamepad2,
  Smartphone, Monitor, Globe, ArrowRight,
} from "lucide-react";

async function getData() {
  const [featuredApps, recentApps, topApps, categories, stats] = await Promise.all([
    prisma.app.findMany({
      where: { status: "active", featured: true },
      include: { category: true, _count: { select: { reviews: true } } },
      orderBy: { downloads: "desc" },
      take: 4,
    }),
    prisma.app.findMany({
      where: { status: "active" },
      include: { category: true, _count: { select: { reviews: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.app.findMany({
      where: { status: "active" },
      include: { category: true, _count: { select: { reviews: true } } },
      orderBy: { downloads: "desc" },
      take: 8,
    }),
    prisma.category.findMany({
      include: { _count: { select: { apps: { where: { status: "active" } } } } },
      orderBy: { name: "asc" },
    }),
    prisma.app.aggregate({
      where: { status: "active" },
      _sum: { downloads: true },
      _count: true,
    }),
  ]);
  return { featuredApps, recentApps, topApps, categories, stats };
}

/* ─── platform config ─── */
const PLATFORM_CONF: Record<string, { gradient: string; shadow: string; label: string }> = {
  android: { gradient: "from-green-500 to-emerald-700",  shadow: "shadow-green-500/30",  label: "🤖 Android" },
  windows: { gradient: "from-blue-500 to-blue-800",      shadow: "shadow-blue-500/30",   label: "🪟 Windows" },
  mac:     { gradient: "from-gray-500 to-gray-800",      shadow: "shadow-gray-500/30",   label: "🍎 Mac" },
  ios:     { gradient: "from-purple-500 to-purple-800",  shadow: "shadow-purple-500/30", label: "📱 iOS" },
  linux:   { gradient: "from-orange-500 to-orange-700",  shadow: "shadow-orange-500/30", label: "🐧 Linux" },
  web:     { gradient: "from-cyan-500 to-cyan-700",      shadow: "shadow-cyan-500/30",   label: "🌐 Web" },
};

export default async function HomePage() {
  const { featuredApps, recentApps, topApps, categories, stats } = await getData();

  return (
    <div>

      {/* ════════════════════════════════════════
          HERO  — dark, full-width, game images
          ════════════════════════════════════════ */}
      <section className="relative bg-[#080e1a] overflow-hidden min-h-[600px] flex items-center">

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#080e1a] via-[#0d1f3c] to-[#080e1a]" />

        {/* Subtle grid lines */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: text content ── */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-300 text-sm mb-6 animate-fade-in-up">
              <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              Free · Safe · Verified Downloads
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-white leading-[1.1] mb-5 animate-fade-in-up delay-100">
              Download Apps,<br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                Games & Software
              </span><br />
              <span className="text-3xl md:text-4xl xl:text-5xl font-bold text-white/70">for Every Platform</span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg animate-fade-in-up delay-200">
              Millions of apps for Android, Windows, Mac, iOS and more.
              Direct downloads with real user ratings.
            </p>

            {/* Search bar */}
            <form action="/apps" method="GET" className="flex gap-2 mb-8 animate-fade-in-up delay-300">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="search"
                  placeholder="Search apps, games, software…"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/15 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all text-sm"
                />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 rounded-xl transition-colors text-sm shrink-0">
                Search
              </button>
            </form>

            {/* Quick platform links */}
            <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up delay-400">
              {[
                { label: "Android", href: "/apps?platform=android", icon: Smartphone, color: "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20" },
                { label: "Windows", href: "/apps?platform=windows", icon: Monitor,    color: "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20" },
                { label: "Mac",     href: "/apps?platform=mac",     icon: Globe,      color: "bg-gray-500/10 border-gray-500/20 text-gray-400 hover:bg-gray-500/20" },
                { label: "Games",   href: "/apps?category=games",   icon: Gamepad2,   color: "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20" },
              ].map(({ label, href, icon: Icon, color }) => (
                <Link key={label} href={href}
                  className={`inline-flex items-center gap-1.5 border text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${color}`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-6 border-t border-white/10 animate-fade-in-up delay-500">
              {[
                { label: "Apps", value: `${stats._count}+` },
                { label: "Downloads", value: `${formatDownloads(stats._sum.downloads || 0)}+` },
                { label: "Categories", value: `${categories.length}+` },
                { label: "Platforms", value: "6" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-white">{value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: animated game image mosaic ── */}
          <div className="hidden lg:block relative h-[460px] animate-fade-in-right delay-300">

            {/* Card 1 — top left, largest */}
            <div className="absolute top-0 left-0 w-52 h-36 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 animate-float">
              <Image src="/game1.jpg" alt="Game" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 text-white text-xs font-bold">🎮 Action Games</div>
            </div>

            {/* Card 2 — top right */}
            <div className="absolute top-4 right-0 w-44 h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 animate-float2">
              <Image src="/game2.jpg" alt="Game" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 text-white text-xs font-bold">🏆 Strategy</div>
            </div>

            {/* Card 3 — middle center, big */}
            <div className="absolute top-44 left-16 w-60 h-40 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 animate-float3">
              <Image src="/game3.jpg" alt="Game" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 text-white text-xs font-bold">⚔️ RPG & Adventure</div>
            </div>

            {/* Card 4 — bottom right */}
            <div className="absolute bottom-10 right-4 w-48 h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 animate-float delay-700">
              <Image src="/game4.jpg" alt="Game" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 text-white text-xs font-bold">🎯 Shooting Games</div>
            </div>

            {/* Floating pill badges */}
            <div className="absolute top-40 right-8 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-float delay-200 flex items-center gap-1.5">
              <Download className="w-3 h-3" /> 1.5M Downloads
            </div>
            <div className="absolute bottom-4 left-0 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-float2 delay-500 flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" /> Top Rated Apps
            </div>

            {/* Glow behind cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f1f5f9] to-transparent z-20" />
      </section>


      {/* ════════════════════════════════════════
          CATEGORIES  — white bg, dark text
          ════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="bg-white py-10 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Browse by Category
              </h2>
              <Link href="/apps" className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {categories.map((cat, i) => (
                <Link key={cat.id} href={`/apps?category=${cat.slug}`}
                  className={`shrink-0 group flex flex-col items-center gap-2 bg-gray-50 hover:bg-blue-600 border border-gray-200 hover:border-blue-600 rounded-2xl p-4 w-[88px] transition-all duration-200 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-white text-center leading-tight transition-colors">{cat.name}</span>
                  <span className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors">
                    {(cat as { _count?: { apps: number } })._count?.apps || 0}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ════════════════════════════════════════
          FEATURED  — dark section, white text
          ════════════════════════════════════════ */}
      {featuredApps.length > 0 && (
        <section className="bg-[#0f172a] py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                Featured Apps
              </h2>
              <Link href="/apps?featured=true" className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                See all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredApps.map((app, i) => (
                <FeaturedCard key={app.id} app={app as AppWithCategory} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ════════════════════════════════════════
          TOP DOWNLOADS  — white bg
          ════════════════════════════════════════ */}
      {topApps.length > 0 && (
        <section className="bg-white py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Top Downloads
              </h2>
              <Link href="/apps" className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                Browse all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topApps.map((app, i) => (
                <AppCard key={app.id} app={app as AppWithCategory} rank={i + 1} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ════════════════════════════════════════
          PLATFORM BAND  — blue bg, white text
          ════════════════════════════════════════ */}
      <section className="bg-blue-600 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Every Platform. One Place.</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Android", sub: "APK Files",   icon: "🤖", href: "/apps?platform=android", bg: "bg-green-500" },
              { label: "Windows", sub: "EXE & MSI",   icon: "🪟", href: "/apps?platform=windows", bg: "bg-sky-500" },
              { label: "Mac",     sub: "DMG Files",   icon: "🍎", href: "/apps?platform=mac",     bg: "bg-gray-500" },
              { label: "iOS",     sub: "App Store",   icon: "📱", href: "/apps?platform=ios",     bg: "bg-violet-500" },
              { label: "Linux",   sub: "DEB & RPM",   icon: "🐧", href: "/apps?platform=linux",   bg: "bg-orange-500" },
              { label: "Web",     sub: "Online Apps", icon: "🌐", href: "/apps?platform=web",     bg: "bg-cyan-500" },
            ].map(({ label, sub, icon, href, bg }) => (
              <Link key={label} href={href}
                className="group flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 rounded-2xl p-4 text-center transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>{icon}</div>
                <div className="text-white font-bold text-sm">{label}</div>
                <div className="text-blue-200 text-xs">{sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════
          NEW RELEASES  — light gray bg
          ════════════════════════════════════════ */}
      {recentApps.length > 0 && (
        <section className="bg-gray-50 py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">
                <Zap className="w-5 h-5 text-purple-500" />
                New Releases
              </h2>
              <Link href="/apps?sort=new" className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentApps.map((app, i) => (
                <AppCard key={app.id} app={app as AppWithCategory} rank={i + 1} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ════════════════════════════════════════
          TRUST  — white bg, icon + dark text
          ════════════════════════════════════════ */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-10">
            Why Millions Trust <span className="text-blue-600">APKHub</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield,   color: "bg-green-500",  title: "100% Safe Downloads",    desc: "Every file is scanned before publishing. Clean, malware-free, and verified by our team." },
              { icon: Download, color: "bg-blue-600",   title: "Fast Direct Downloads",  desc: "No redirects, no ads, no download managers. Just click and download at full speed." },
              { icon: Star,     color: "bg-amber-500",  title: "Real User Reviews",      desc: "Ratings and comments from verified users. Make informed decisions before downloading." },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="flex gap-4 items-start p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all group">
                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-10 text-center text-white">
            <h3 className="text-2xl font-black mb-2">Ready to explore?</h3>
            <p className="text-blue-100 mb-6 text-sm">Browse thousands of apps across all platforms</p>
            <Link href="/apps" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-7 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
              Browse All Apps <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ─────────────────────────────────────────
   FeaturedCard — dark section card
   Solid gradient top + white info strip
───────────────────────────────────────── */
function FeaturedCard({ app, index }: { app: AppWithCategory; index: number }) {
  const conf = PLATFORM_CONF[app.platform] ?? PLATFORM_CONF.windows;

  return (
    <Link href={`/apps/${app.slug}`}
      className={`group block rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 animate-fade-in-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient top panel */}
      <div className={`relative bg-gradient-to-br ${conf.gradient} p-5 pb-10`}>
        {/* Featured badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1 bg-black/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" /> Featured
          </span>
          <span className="text-white/60 text-xs">v{app.version}</span>
        </div>

        {/* App icon */}
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl ${conf.shadow} shrink-0`}>
            {app.icon
              ? <Image src={app.icon} alt={app.name} width={56} height={56} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center bg-white/20 text-2xl">
                  {app.platform === "android" ? "🤖" : app.platform === "windows" ? "🪟" : app.platform === "mac" ? "🍎" : "💾"}
                </div>
            }
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white truncate leading-tight text-sm group-hover:text-white/90">{app.name}</h3>
            <p className="text-white/60 text-xs truncate mt-0.5">{app.developer}</p>
          </div>
        </div>

        {/* Overlap fade */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* White info strip */}
      <div className="bg-white px-4 py-3">
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{app.shortDesc}</p>
        <div className="flex items-center justify-between">
          <span className={`platform-${app.platform} text-xs px-2.5 py-1 rounded-full font-semibold inline-flex items-center gap-1`}>
            {app.platform === "android" ? "🤖" : app.platform === "windows" ? "🪟" : "💾"} {app.platform}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Download className="w-3 h-3" /> {formatDownloads(app.downloads)}
          </span>
        </div>
      </div>
    </Link>
  );
}

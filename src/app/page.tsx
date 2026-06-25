import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { AppCard } from "@/components/AppCard";
import { AppWithCategory } from "@/types";
import { formatDownloads, getPlatformIcon } from "@/lib/utils";
import {
  Download, TrendingUp, Star, Shield, Zap, Search,
  ChevronRight, Flame, Sparkles, Gamepad2,
  Smartphone, Monitor, Globe,
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

const PLATFORMS = [
  { label: "Android", value: "android", icon: Smartphone, gradient: "from-green-500 to-emerald-600", desc: "APK Files" },
  { label: "Windows", value: "windows", icon: Monitor, gradient: "from-blue-500 to-blue-700", desc: "EXE & MSI" },
  { label: "Mac", value: "mac", icon: Globe, gradient: "from-gray-500 to-gray-700", desc: "DMG Files" },
  { label: "Games", value: "games", icon: Gamepad2, gradient: "from-purple-500 to-purple-700", desc: "All Platforms", isCategory: true },
];

export default async function HomePage() {
  const { featuredApps, recentApps, topApps, categories, stats } = await getData();

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-[580px] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.jpg"
            alt="Hero background"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          <div className="absolute inset-0 hero-overlay" />
          {/* Extra top/bottom gradients to blend */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0d1117]/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f0f2f5] to-transparent" />
        </div>

        {/* Floating decorative cards */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 right-[8%] animate-float opacity-80">
            <div className="glass rounded-2xl p-3 flex items-center gap-2.5 w-44">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xl shadow-lg">🤖</div>
              <div>
                <div className="text-white text-xs font-semibold">Android Apps</div>
                <div className="text-green-300 text-xs">Free Downloads</div>
              </div>
            </div>
          </div>
          <div className="absolute top-32 right-[22%] animate-float2 opacity-70">
            <div className="glass rounded-2xl p-3 flex items-center gap-2.5 w-44">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center text-xl shadow-lg">🎮</div>
              <div>
                <div className="text-white text-xs font-semibold">PC Games</div>
                <div className="text-purple-300 text-xs">Latest Updates</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-32 right-[12%] animate-float3 opacity-75">
            <div className="glass rounded-2xl p-3 flex items-center gap-2.5 w-44">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-xl shadow-lg">🪟</div>
              <div>
                <div className="text-white text-xs font-semibold">Windows</div>
                <div className="text-blue-300 text-xs">Trusted Software</div>
              </div>
            </div>
          </div>
          <div className="absolute top-20 left-[5%] animate-float2 opacity-60 hidden lg:block">
            <div className="glass rounded-2xl p-3 flex items-center gap-2.5 w-40">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-lg shadow-lg">⭐</div>
              <div>
                <div className="text-white text-xs font-semibold">Top Rated</div>
                <div className="text-yellow-300 text-xs">User Reviews</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-28 left-[8%] animate-float opacity-60 hidden lg:block">
            <div className="glass rounded-2xl p-3 flex items-center gap-2.5 w-40">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-lg shadow-lg">🍎</div>
              <div>
                <div className="text-white text-xs font-semibold">Mac Apps</div>
                <div className="text-pink-300 text-xs">Safe & Verified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-blue-300 mb-6 animate-fade-in-up">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>Free downloads · No registration required · Safe & verified</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5 animate-fade-in-up delay-100">
              Download Apps,<br />
              <span className="text-gradient">Games & Software</span><br />
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white/80">for Every Platform</span>
            </h1>

            <p className="text-gray-300 text-lg mb-8 max-w-xl leading-relaxed animate-fade-in-up delay-200">
              Browse thousands of verified apps for Android, Windows, Mac, iOS and more.
              Fast downloads, real user reviews.
            </p>

            {/* Hero search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in-up delay-300">
              <Link
                href="/apps"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Search className="w-4 h-4" />
                Browse All Apps
              </Link>
              <Link
                href="/apps?featured=true"
                className="flex items-center justify-center gap-2 glass text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:bg-white/15"
              >
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                Featured Apps
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 animate-fade-in-up delay-400">
              {[
                { label: "Apps Available", value: `${stats._count}+` },
                { label: "Total Downloads", value: `${formatDownloads(stats._sum.downloads || 0)}+` },
                { label: "Categories", value: `${categories.length}+` },
                { label: "Platforms", value: "6+" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM QUICK LINKS ── */}
      <section className="bg-[#0d1117] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLATFORMS.map(({ label, value, icon: Icon, gradient, desc, isCategory }) => (
              <Link
                key={value}
                href={isCategory ? `/apps?category=${value}` : `/apps?platform=${value}`}
                className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 rounded-xl px-4 py-3 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">

        {/* ── CATEGORIES ── */}
        {categories.length > 0 && (
          <section className="py-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Browse Categories
              </h2>
              <Link href="/apps" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/apps?category=${cat.slug}`}
                  className="shrink-0 group flex flex-col items-center gap-2 bg-white hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-2xl p-4 w-24 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700 text-center leading-tight">{cat.name}</span>
                  <span className="text-xs text-gray-400">{(cat as { _count?: { apps: number } })._count?.apps || 0}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── FEATURED ── */}
        {featuredApps.length > 0 && (
          <section className="py-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">
                <Flame className="w-5 h-5 text-orange-500" />
                Featured Apps
              </h2>
              <Link href="/apps?featured=true" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                See all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredApps.map((app, i) => (
                <FeaturedAppCard key={app.id} app={app as AppWithCategory} large={i === 0} />
              ))}
            </div>
          </section>
        )}

        {/* ── TOP DOWNLOADS ── */}
        {topApps.length > 0 && (
          <section className="py-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Top Downloads
              </h2>
              <Link href="/apps" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Browse all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topApps.map((app) => (
                <AppCard key={app.id} app={app as AppWithCategory} />
              ))}
            </div>
          </section>
        )}

        {/* ── NEW RELEASES ── */}
        {recentApps.length > 0 && (
          <section className="py-4 pb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">
                <Zap className="w-5 h-5 text-purple-500" />
                Recently Added
              </h2>
              <Link href="/apps" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentApps.map((app) => (
                <AppCard key={app.id} app={app as AppWithCategory} />
              ))}
            </div>
          </section>
        )}

        {/* ── TRUST SECTION ── */}
        <section className="py-10 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Shield,
                title: "100% Safe & Verified",
                desc: "Every file is scanned and verified before publishing. We guarantee clean, malware-free downloads.",
                color: "from-green-500 to-emerald-600",
                bg: "bg-green-50",
              },
              {
                icon: Download,
                title: "Fast Direct Downloads",
                desc: "No ads, no redirects. Direct download links with maximum speed and no download managers.",
                color: "from-blue-500 to-blue-700",
                bg: "bg-blue-50",
              },
              {
                icon: Star,
                title: "Real User Reviews",
                desc: "Ratings and reviews from verified users. Make informed decisions before downloading.",
                color: "from-yellow-400 to-orange-500",
                bg: "bg-yellow-50",
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className={`card p-6 flex gap-4 items-start hover:-translate-y-1`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

/* ── Featured App Card (big horizontal card) ── */
function FeaturedAppCard({ app, large }: { app: AppWithCategory; large?: boolean }) {
  const icon = getPlatformIcon(app.platform);

  return (
    <Link
      href={`/apps/${app.slug}`}
      className={`group card overflow-hidden hover:-translate-y-1 ${large ? "md:row-span-2" : ""}`}
    >
      {/* Top gradient band */}
      <div className={`h-28 relative overflow-hidden ${large ? "md:h-44" : ""}`}
        style={{ background: `linear-gradient(135deg, #1e3a5f, #0f2040)` }}
      >
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 70% 50%, rgba(59,130,246,0.5) 0%, transparent 60%)"
        }} />
        <div className="absolute top-4 right-6 text-5xl opacity-30 select-none">{icon}</div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="glass text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Featured
          </span>
        </div>
      </div>

      <div className="p-4 flex gap-3 items-start -mt-6 relative">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border-2 border-white shadow-lg shrink-0">
          {app.icon ? (
            <Image src={app.icon} alt={app.name} width={56} height={56} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-blue-50 to-blue-100">{icon}</div>
          )}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{app.name}</h3>
          <p className="text-xs text-gray-500 truncate">{app.developer}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`platform-${app.platform} text-xs px-2.5 py-0.5 rounded-full font-medium`}>
              {icon} {app.platform}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-0.5">
              <Download className="w-3 h-3" />
              {formatDownloads(app.downloads)}
            </span>
            <span className="text-xs text-gray-400">v{app.version}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{app.shortDesc}</p>
        </div>
      </div>
    </Link>
  );
}

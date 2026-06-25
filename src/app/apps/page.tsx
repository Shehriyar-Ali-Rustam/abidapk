import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AppCard } from "@/components/AppCard";
import { AppWithCategory } from "@/types";
import { getPlatformIcon } from "@/lib/utils";
import { Filter, Search, Smartphone, Monitor, Globe, Zap, Grid3X3, List } from "lucide-react";

interface PageProps {
  searchParams: {
    search?: string;
    category?: string;
    platform?: string;
    featured?: string;
    page?: string;
    sort?: string;
  };
}

const PLATFORMS = [
  { label: "All", value: "" },
  { label: "Android", value: "android", icon: Smartphone, color: "text-green-600" },
  { label: "Windows", value: "windows", icon: Monitor, color: "text-blue-600" },
  { label: "Mac", value: "mac", icon: Globe, color: "text-gray-600" },
  { label: "iOS", value: "ios", icon: Smartphone, color: "text-purple-600" },
  { label: "Linux", value: "linux", icon: Zap, color: "text-orange-600" },
  { label: "Web", value: "web", icon: Grid3X3, color: "text-cyan-600" },
];

async function getData(params: PageProps["searchParams"]) {
  const page = parseInt(params.page || "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const orderBy =
    params.sort === "new"
      ? { createdAt: "desc" as const }
      : params.sort === "rating"
      ? { downloads: "desc" as const }
      : { downloads: "desc" as const };

  const where = {
    status: "active" as const,
    ...(params.search && {
      OR: [
        { name: { contains: params.search } },
        { developer: { contains: params.search } },
        { shortDesc: { contains: params.search } },
      ],
    }),
    ...(params.category && { category: { slug: params.category } }),
    ...(params.platform && { platform: params.platform }),
    ...(params.featured === "true" && { featured: true }),
  };

  const [apps, total, categories] = await Promise.all([
    prisma.app.findMany({
      where,
      include: { category: true, _count: { select: { reviews: true } } },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.app.count({ where }),
    prisma.category.findMany({
      include: { _count: { select: { apps: { where: { status: "active" } } } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return { apps, total, categories, page, pages: Math.ceil(total / limit) };
}

export default async function AppsPage({ searchParams }: PageProps) {
  const { apps, total, categories, page, pages } = await getData(searchParams);

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = { ...searchParams, ...overrides, page: undefined };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `/apps?${params.toString()}`;
  }

  const activeCategory = searchParams.category || "";
  const activePlatform = searchParams.platform || "";

  const pageTitle = searchParams.search
    ? `Results for "${searchParams.search}"`
    : searchParams.featured === "true"
    ? "⭐ Featured Apps"
    : searchParams.category
    ? categories.find((c) => c.slug === searchParams.category)?.name || "Apps"
    : searchParams.platform
    ? `${getPlatformIcon(searchParams.platform)} ${searchParams.platform.charAt(0).toUpperCase() + searchParams.platform.slice(1)} Apps`
    : "All Apps";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Sidebar ── */}
        <aside className="lg:w-60 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-28">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Filter className="w-4 h-4 text-blue-500" />
              Filters
            </h3>

            {/* Platform */}
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Platform</p>
              <div className="flex flex-col gap-0.5">
                {PLATFORMS.map((p) => (
                  <Link
                    key={p.value}
                    href={buildUrl({ platform: p.value || undefined })}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                      activePlatform === p.value
                        ? "bg-blue-600 text-white font-semibold shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {p.value ? (
                      <>
                        <span>{getPlatformIcon(p.value)}</span>
                        <span>{p.label}</span>
                      </>
                    ) : (
                      <>
                        <Grid3X3 className="w-3.5 h-3.5" />
                        <span>All Platforms</span>
                      </>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</p>
              <div className="flex flex-col gap-0.5">
                <Link
                  href={buildUrl({ category: undefined })}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                    !activeCategory ? "bg-blue-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="flex items-center gap-2"><List className="w-3.5 h-3.5" /> All</span>
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={buildUrl({ category: cat.slug })}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                      activeCategory === cat.slug
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>{cat.icon} {cat.name}</span>
                    <span className={`text-xs rounded-full px-1.5 py-0.5 ${
                      activeCategory === cat.slug ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      {(cat as { _count?: { apps: number } })._count?.apps || 0}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0">
          {/* Header bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{total.toLocaleString()} apps found</p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort:</span>
              {[
                { label: "Top Downloads", value: "top" },
                { label: "Newest", value: "new" },
              ].map((s) => (
                <Link
                  key={s.value}
                  href={buildUrl({ sort: s.value })}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    (searchParams.sort || "top") === s.value
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {apps.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Search className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No apps found</h3>
              <p className="text-gray-400 text-sm mb-6">Try different keywords or explore all apps</p>
              <Link href="/apps" className="btn-primary inline-flex">
                Browse All Apps
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {apps.map((app, i) => (
                  <AppCard key={app.id} app={app as AppWithCategory} rank={i + 1 + (page - 1) * 20} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {page > 1 && (
                    <Link href={buildUrl({ page: String(page - 1) })} className="btn-secondary text-sm">
                      ← Previous
                    </Link>
                  )}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                      const n = i + 1;
                      return (
                        <Link
                          key={n}
                          href={buildUrl({ page: String(n) })}
                          className={`w-9 h-9 rounded-xl text-sm font-medium flex items-center justify-center transition-colors ${
                            n === page
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                          }`}
                        >
                          {n}
                        </Link>
                      );
                    })}
                  </div>
                  {page < pages && (
                    <Link href={buildUrl({ page: String(page + 1) })} className="btn-secondary text-sm">
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

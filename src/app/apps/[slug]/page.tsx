import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDownloads, getPlatformIcon } from "@/lib/utils";
import { StarRating } from "@/components/StarRating";
import { ReviewForm } from "@/components/ReviewForm";
import { DownloadButton } from "@/components/DownloadButton";
import {
  Download, Star, Calendar, HardDrive, Code2,
  Globe, Tag, ChevronRight, Shield, Users,
} from "lucide-react";

interface PageProps { params: { slug: string } }

async function getApp(slug: string) {
  return prisma.app.findFirst({
    where: { OR: [{ slug }, { id: slug }], status: "active" },
    include: {
      category: true,
      files: { orderBy: { uploadedAt: "desc" } },
      reviews: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { reviews: true } },
    },
  });
}

function avgRating(reviews: { rating: number }[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

export async function generateMetadata({ params }: PageProps) {
  const app = await getApp(params.slug);
  if (!app) return { title: "Not Found" };
  return { title: `${app.name} - Download | APKHub`, description: app.shortDesc };
}

export default async function AppDetailPage({ params }: PageProps) {
  const app = await getApp(params.slug);
  if (!app) notFound();

  const screenshots: string[] = JSON.parse(app.screenshots || "[]");
  const tags: string[] = JSON.parse(app.tags || "[]");
  const rating = avgRating(app.reviews);
  const icon = getPlatformIcon(app.platform);
  const ratingDist = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: app.reviews.filter((r) => r.rating === n).length,
  }));

  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      {/* Page header band */}
      <div className="bg-[#0d1117] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-1 text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/apps" className="hover:text-gray-300 transition-colors">Apps</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/apps?category=${app.category.slug}`} className="hover:text-gray-300 transition-colors">{app.category.name}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-400 truncate max-w-xs">{app.name}</span>
          </nav>
        </div>
      </div>

      {/* App hero band */}
      <div className="bg-gradient-to-b from-[#0d1117] to-[#f0f2f5]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 shrink-0">
              {app.icon ? (
                <Image src={app.icon} alt={app.name} width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-blue-900 to-blue-700">
                  {icon}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`platform-${app.platform} text-xs px-3 py-1 rounded-full font-semibold`}>
                  {icon} {app.platform}
                </span>
                <span className="glass text-gray-300 text-xs px-3 py-1 rounded-full">
                  {app.category.icon} {app.category.name}
                </span>
                <span className="glass text-gray-300 text-xs px-3 py-1 rounded-full">{app.license}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-1">{app.name}</h1>
              <p className="text-gray-400 text-sm">{app.developer}</p>
              <div className="flex flex-wrap items-center gap-5 mt-3">
                {rating > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating value={Math.round(rating)} readonly size="sm" />
                    <span className="text-white font-bold">{rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-xs">({app._count.reviews} reviews)</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <Download className="w-4 h-4" />
                  <span className="text-white font-semibold">{formatDownloads(app.downloads)}</span> downloads
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <Code2 className="w-4 h-4" />
                  v{app.version}
                </div>
              </div>
            </div>

            {/* Download button in hero */}
            <div className="shrink-0">
              <DownloadButton appId={app.id} appName={app.name} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <div className="card p-5">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  📸 Screenshots
                </h2>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                  {screenshots.map((src, i) => (
                    <div key={i} className="shrink-0 w-52 h-36 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                      <Image src={src} alt={`Screenshot ${i + 1}`} width={208} height={144} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-4 text-lg">About {app.name}</h2>
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {app.description}
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-50">
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/apps?search=${encodeURIComponent(tag)}`}
                      className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors border border-blue-100"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-lg">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                User Reviews
                <span className="text-sm font-normal text-gray-400">({app._count.reviews})</span>
              </h2>

              {app.reviews.length > 0 && (
                <div className="flex gap-8 items-start p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-6">
                  <div className="text-center">
                    <div className="text-5xl font-black text-gray-900">{rating.toFixed(1)}</div>
                    <StarRating value={Math.round(rating)} readonly size="md" />
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1 justify-center">
                      <Users className="w-3 h-3" />
                      {app._count.reviews} ratings
                    </div>
                  </div>
                  <div className="flex-1">
                    {ratingDist.map(({ n, count }) => (
                      <div key={n} className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-gray-500 w-2 font-medium">{n}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all"
                            style={{ width: app._count.reviews ? `${(count / app._count.reviews) * 100}%` : "0%" }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ReviewForm appId={app.id} />

              <div className="mt-6 flex flex-col divide-y divide-gray-50">
                {app.reviews.map((review) => (
                  <div key={review.id} className="py-4 first:pt-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                          {review.user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">{review.user.name}</div>
                          <div className="text-xs text-gray-400">{formatDate(review.createdAt)}</div>
                        </div>
                      </div>
                      <StarRating value={review.rating} readonly size="sm" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pl-11">{review.comment}</p>
                  </div>
                ))}
                {app.reviews.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Star className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p className="text-sm font-medium">No reviews yet</p>
                    <p className="text-xs mt-1">Be the first to review {app.name}!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="flex flex-col gap-4">
            {/* Download card */}
            <div className="card p-5">
              <DownloadButton appId={app.id} appName={app.name} />

              <div className="mt-4 space-y-2.5 border-t border-gray-50 pt-4">
                {[
                  { icon: Code2, label: "Version", value: app.version },
                  { icon: Calendar, label: "Updated", value: formatDate(app.updatedAt) },
                  { icon: HardDrive, label: "Size", value: app.size || "Unknown" },
                  { icon: Globe, label: "Platform", value: app.platform },
                  { icon: Tag, label: "Category", value: app.category.name },
                  ...(app.minOs ? [{ icon: Shield, label: "Requires", value: app.minOs }] : []),
                  ...(app.packageName ? [{ icon: Code2, label: "Package", value: app.packageName }] : []),
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-3 py-1.5 border-b border-gray-50 last:border-0">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </span>
                    <span className="text-xs font-semibold text-gray-700 text-right truncate max-w-[160px]">{value}</span>
                  </div>
                ))}
              </div>

              {app.website && (
                <a
                  href={app.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-1.5 text-xs text-blue-600 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Official Website
                </a>
              )}
            </div>

            {/* Safety badge */}
            <div className="card p-4 flex items-start gap-3">
              <Shield className="w-8 h-8 text-green-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm text-gray-900 mb-1">Safe Download</div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  This file has been scanned and verified. No malware, spyware, or adware.
                </p>
              </div>
            </div>

            {/* Version history */}
            {app.files.length > 0 && (
              <div className="card p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Version History</h3>
                <div className="flex flex-col gap-2">
                  {app.files.slice(0, 5).map((file) => (
                    <div key={file.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-semibold text-gray-800 text-xs">v{file.version}</div>
                        <div className="text-xs text-gray-400">{file.filesize}</div>
                      </div>
                      <a
                        href={file.filepath}
                        download={file.filename}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

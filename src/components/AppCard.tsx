import Link from "next/link";
import Image from "next/image";
import { Download, Star } from "lucide-react";
import { AppWithCategory } from "@/types";
import { formatDownloads, getPlatformIcon } from "@/lib/utils";

interface Props {
  app: AppWithCategory;
  avgRating?: number;
  rank?: number;
}

export function AppCard({ app, avgRating, rank }: Props) {
  const icon = getPlatformIcon(app.platform);

  return (
    <Link
      href={`/apps/${app.slug}`}
      className="group card p-4 flex flex-col gap-3 hover:-translate-y-1"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="relative shrink-0">
          {rank && (
            <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center z-10 shadow">
              {rank}
            </span>
          )}
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md border border-gray-100">
            {app.icon ? (
              <Image
                src={app.icon}
                alt={app.name}
                width={56}
                height={56}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                {icon}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate text-sm leading-tight">
            {app.name}
          </h3>
          <p className="text-xs text-gray-400 truncate mt-0.5">{app.developer}</p>

          {/* Platform badge */}
          <span className={`inline-flex items-center gap-1 mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium platform-${app.platform}`}>
            {icon} {app.platform}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
        {app.shortDesc}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Download className="w-3 h-3" />
            {formatDownloads(app.downloads)}
          </span>
          {avgRating !== undefined && avgRating > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-gray-400">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {avgRating.toFixed(1)}
            </span>
          )}
        </div>
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg">
          v{app.version}
        </span>
      </div>
    </Link>
  );
}

/* Compact horizontal card for list view */
export function AppListCard({ app, rank }: { app: AppWithCategory; rank?: number }) {
  const icon = getPlatformIcon(app.platform);
  return (
    <Link
      href={`/apps/${app.slug}`}
      className="group flex items-center gap-4 p-4 bg-white hover:bg-blue-50/40 border border-gray-100 hover:border-blue-200 rounded-2xl transition-all"
    >
      {rank && (
        <span className="text-lg font-bold text-gray-200 w-6 text-center shrink-0">{rank}</span>
      )}
      <div className="w-12 h-12 rounded-xl overflow-hidden shadow border border-gray-100 shrink-0">
        {app.icon ? (
          <Image src={app.icon} alt={app.name} width={48} height={48} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl bg-gray-50">{icon}</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate text-sm">{app.name}</h3>
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium platform-${app.platform}`}>{icon} {app.platform}</span>
        </div>
        <p className="text-xs text-gray-400 truncate">{app.developer} · v{app.version}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{app.shortDesc}</p>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-xs text-gray-400">{formatDownloads(app.downloads)}</div>
        <div className="text-xs text-gray-300 mt-0.5">DLs</div>
      </div>
    </Link>
  );
}

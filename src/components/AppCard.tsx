import Link from "next/link";
import Image from "next/image";
import { Download, Star } from "lucide-react";
import { AppWithCategory } from "@/types";
import { formatDownloads } from "@/lib/utils";

const PLATFORM_ICON: Record<string, string> = {
  android: "🤖", windows: "🪟", mac: "🍎",
  ios: "📱", linux: "🐧", web: "🌐",
};

interface Props {
  app: AppWithCategory;
  avgRating?: number;
  rank?: number;
}

export function AppCard({ app, avgRating, rank }: Props) {
  const icon = PLATFORM_ICON[app.platform] ?? "💾";

  return (
    <Link
      href={`/apps/${app.slug}`}
      className="group bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-3
                 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1
                 transition-all duration-200"
    >
      {/* Top row: icon + name */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          {rank && rank <= 10 && (
            <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-blue-600 text-white
                             text-[10px] font-black rounded-full flex items-center justify-center z-10 shadow-sm">
              {rank}
            </span>
          )}
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {app.icon
              ? <Image src={app.icon} alt={app.name} width={56} height={56}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              : <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                  {icon}
                </div>
            }
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors
                         text-sm truncate leading-tight">
            {app.name}
          </h3>
          <p className="text-xs text-gray-400 truncate mt-0.5">{app.developer}</p>

          {/* Platform badge */}
          <span className={`platform-${app.platform} inline-flex items-center gap-1
                            text-[11px] px-2 py-0.5 rounded-full font-semibold mt-1.5`}>
            {icon} {app.platform}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
        {app.shortDesc}
      </p>

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Download className="w-3 h-3 text-blue-400" />
            {formatDownloads(app.downloads)}
          </span>
          {avgRating !== undefined && avgRating > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-gray-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {avgRating.toFixed(1)}
            </span>
          )}
        </div>
        <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
          v{app.version}
        </span>
      </div>
    </Link>
  );
}

export function AppListCard({ app, rank }: { app: AppWithCategory; rank?: number }) {
  const icon = PLATFORM_ICON[app.platform] ?? "💾";
  return (
    <Link href={`/apps/${app.slug}`}
      className="group flex items-center gap-4 p-4 bg-white hover:bg-blue-50
                 border border-gray-100 hover:border-blue-200 rounded-2xl transition-all">
      {rank && <span className="text-lg font-black text-gray-200 w-6 text-center shrink-0">{rank}</span>}
      <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-sm">
        {app.icon
          ? <Image src={app.icon} alt={app.name} width={48} height={48} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-xl bg-gray-50">{icon}</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate text-sm">
            {app.name}
          </h3>
          <span className={`platform-${app.platform} shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold`}>
            {icon} {app.platform}
          </span>
        </div>
        <p className="text-xs text-gray-400 truncate">{app.developer} · v{app.version}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{app.shortDesc}</p>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-xs font-semibold text-gray-600">{formatDownloads(app.downloads)}</div>
        <div className="text-xs text-gray-300 mt-0.5">downloads</div>
      </div>
    </Link>
  );
}

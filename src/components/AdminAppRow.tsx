"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Eye } from "lucide-react";
import { formatDownloads, getPlatformIcon } from "@/lib/utils";

interface App {
  id: string;
  name: string;
  icon: string | null;
  platform: string;
  version: string;
  downloads: number;
  status: string;
  featured: boolean;
  category: { name: string; icon: string };
}

export function AdminAppRow({ app }: { app: App }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${app.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/apps/${app.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
            {app.icon ? (
              <Image src={app.icon} alt={app.name} width={36} height={36} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg">{getPlatformIcon(app.platform)}</div>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">{app.name}</div>
            <div className="text-xs text-gray-400">v{app.version}</div>
          </div>
          {app.featured && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Featured</span>
          )}
        </div>
      </td>
      <td className="px-5 py-3 text-gray-600">
        {getPlatformIcon(app.platform)} {app.platform}
      </td>
      <td className="px-5 py-3 text-gray-600">
        {app.category.icon} {app.category.name}
      </td>
      <td className="px-5 py-3 text-gray-600">{formatDownloads(app.downloads)}</td>
      <td className="px-5 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          app.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
        }`}>
          {app.status}
        </span>
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/apps/${app.id}`}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            href={`/admin/apps/${app.id}`}
            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AdminAppRow } from "@/components/AdminAppRow";
import { formatDownloads } from "@/lib/utils";
import { Plus, Package, Download, Star, Layers } from "lucide-react";

async function getAdminData() {
  const [apps, stats, categories] = await Promise.all([
    prisma.app.findMany({
      include: { category: true, _count: { select: { reviews: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.app.aggregate({
      _sum: { downloads: true },
      _count: true,
    }),
    prisma.category.findMany({
      include: { _count: { select: { apps: true } } },
      orderBy: { name: "asc" },
    }),
  ]);
  return { apps, stats, categories };
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    redirect("/auth/login");
  }

  const { apps, stats, categories } = await getAdminData();
  const activeApps = apps.filter((a) => a.status === "active").length;
  const totalDownloads = stats._sum.downloads || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your apps, categories, and content</p>
        </div>
        <Link
          href="/admin/apps/new"
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add New App
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Apps", value: stats._count, icon: Package, color: "bg-blue-50 text-blue-600" },
          { label: "Active Apps", value: activeApps, icon: Layers, color: "bg-green-50 text-green-600" },
          { label: "Total Downloads", value: formatDownloads(totalDownloads), icon: Download, color: "bg-purple-50 text-purple-600" },
          { label: "Categories", value: categories.length, icon: Star, color: "bg-yellow-50 text-yellow-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Categories section */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Categories</h2>
          <AdminCategoryForm />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span key={cat.id} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
              {cat.icon} {cat.name}
              <span className="text-xs text-gray-400 ml-1">({(cat as { _count?: { apps: number } })._count?.apps || 0})</span>
            </span>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-gray-400">No categories yet. Add one to get started.</p>
          )}
        </div>
      </div>

      {/* Apps table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">All Apps ({apps.length})</h2>
        </div>

        {apps.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-200" />
            <p className="font-medium text-gray-500">No apps yet</p>
            <p className="text-sm mt-1">Click &quot;Add New App&quot; to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">App</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Platform</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Downloads</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {apps.map((app) => (
                  <AdminAppRow key={app.id} app={app} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminCategoryForm() {
  return (
    <Link
      href="/admin/categories"
      className="text-xs text-blue-600 hover:underline font-medium"
    >
      Manage categories →
    </Link>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AppForm } from "@/components/AppForm";
import { ChevronRight } from "lucide-react";

export default async function EditAppPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    redirect("/auth/login");
  }

  const [app, categories] = await Promise.all([
    prisma.app.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!app) notFound();

  const initialData = {
    ...app,
    packageName: app.packageName ?? undefined,
    size: app.size ?? undefined,
    icon: app.icon ?? undefined,
    downloadUrl: app.downloadUrl ?? undefined,
    externalLink: app.externalLink ?? undefined,
    minOs: app.minOs ?? undefined,
    website: app.website ?? undefined,
    screenshots: JSON.parse(app.screenshots || "[]") as string[],
    tags: (JSON.parse(app.tags || "[]") as string[]).join(", "),
    id: app.id,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/admin" className="hover:text-blue-600">Admin</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Edit: {app.name}</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit App: {app.name}</h1>
      <AppForm categories={categories} initialData={initialData} mode="edit" />
    </div>
  );
}

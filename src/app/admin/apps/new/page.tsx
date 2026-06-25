import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AppForm } from "@/components/AppForm";
import { ChevronRight } from "lucide-react";

export default async function NewAppPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    redirect("/auth/login");
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/admin" className="hover:text-blue-600">Admin</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Add New App</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New App</h1>
      <AppForm categories={categories} mode="create" />
    </div>
  );
}

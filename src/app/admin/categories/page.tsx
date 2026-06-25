"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  _count?: { apps: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📱");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadCategories() {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  }

  useEffect(() => { loadCategories(); }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), icon }),
    });

    setLoading(false);
    if (res.ok) {
      setName("");
      setIcon("📱");
      loadCategories();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add category");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/admin" className="hover:text-blue-600">Admin</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Categories</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Categories</h1>

      {/* Add form */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Add Category</h2>
        <form onSubmit={handleAdd} className="flex items-end gap-3">
          <div className="w-16">
            <label className="block text-xs font-medium text-gray-500 mb-1">Icon</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              maxLength={2}
              className="w-full text-center text-xl px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Social Media"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </form>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Icon</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Slug</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Apps</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-xl">{cat.icon}</td>
                <td className="px-5 py-3 font-medium text-gray-900">{cat.name}</td>
                <td className="px-5 py-3 text-gray-400 font-mono text-xs">{cat.slug}</td>
                <td className="px-5 py-3 text-gray-500">{cat._count?.apps || 0}</td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">
                  No categories yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

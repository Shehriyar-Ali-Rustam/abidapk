"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface AppFormData {
  name: string;
  developer: string;
  description: string;
  shortDesc: string;
  version: string;
  packageName: string;
  platform: string;
  size: string;
  icon: string;
  screenshots: string[];
  categoryId: string;
  featured: boolean;
  status: string;
  downloadUrl: string;
  externalLink: string;
  tags: string;
  minOs: string;
  license: string;
  website: string;
}

interface Props {
  categories: Category[];
  initialData?: Partial<AppFormData> & { id?: string };
  mode: "create" | "edit";
}

const PLATFORMS = ["android", "windows", "mac", "ios", "linux", "web"];
const LICENSES = ["Free", "Freemium", "Paid", "Open Source", "Trial"];

export function AppForm({ categories, initialData, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [form, setForm] = useState<AppFormData>({
    name: initialData?.name || "",
    developer: initialData?.developer || "",
    description: initialData?.description || "",
    shortDesc: initialData?.shortDesc || "",
    version: initialData?.version || "1.0.0",
    packageName: initialData?.packageName || "",
    platform: initialData?.platform || "android",
    size: initialData?.size || "",
    icon: initialData?.icon || "",
    screenshots: initialData?.screenshots || [],
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    featured: initialData?.featured || false,
    status: initialData?.status || "active",
    downloadUrl: initialData?.downloadUrl || "",
    externalLink: initialData?.externalLink || "",
    tags: Array.isArray(initialData?.tags)
      ? (initialData.tags as string[]).join(", ")
      : initialData?.tags || "",
    minOs: initialData?.minOs || "",
    license: initialData?.license || "Free",
    website: initialData?.website || "",
  });

  function update(field: keyof AppFormData, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function uploadFile(file: File, type: "icon" | "screenshot" | "file") {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
  }

  async function handleIconUpload(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    setUploadingIcon(true);
    try {
      const { url } = await uploadFile(e.target.files[0], "icon");
      update("icon", url);
    } catch {
      setError("Icon upload failed");
    } finally {
      setUploadingIcon(false);
    }
  }

  async function handleScreenshotUpload(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    setUploadingScreenshot(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(e.target.files)) {
        const { url } = await uploadFile(file, "screenshot");
        urls.push(url);
      }
      update("screenshots", [...form.screenshots, ...urls]);
    } catch {
      setError("Screenshot upload failed");
    } finally {
      setUploadingScreenshot(false);
    }
  }

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    setUploadingFile(true);
    try {
      const { url } = await uploadFile(e.target.files[0], "file");
      update("downloadUrl", url);
    } catch {
      setError("File upload failed");
    } finally {
      setUploadingFile(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.developer || !form.description || !form.shortDesc) {
      return setError("Please fill in all required fields");
    }
    if (!form.categoryId) return setError("Please select a category");

    setLoading(true);

    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      screenshots: form.screenshots,
    };

    try {
      const url = mode === "create" ? "/api/apps" : `/api/apps/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: main fields */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">App Name *</label>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="e.g. WhatsApp" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Developer *</label>
              <input type="text" value={form.developer} onChange={(e) => update("developer", e.target.value)} required placeholder="e.g. Meta Platforms" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Version *</label>
              <input type="text" value={form.version} onChange={(e) => update("version", e.target.value)} required placeholder="e.g. 2.24.1" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
              <input type="text" value={form.packageName} onChange={(e) => update("packageName", e.target.value)} placeholder="com.example.app" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
              <input type="text" value={form.size} onChange={(e) => update("size", e.target.value)} placeholder="e.g. 45 MB" className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
              <input type="text" value={form.shortDesc} onChange={(e) => update("shortDesc", e.target.value)} required maxLength={160} placeholder="One-line description (max 160 chars)" className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} required rows={6} placeholder="Detailed description of the app..." className="input resize-none" />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Media</h3>

          {/* Icon */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">App Icon</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                {form.icon ? (
                  <Image src={form.icon} alt="icon" width={64} height={64} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">📱</span>
                )}
              </div>
              <label className="cursor-pointer flex items-center gap-2 text-sm bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                {uploadingIcon ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload Icon
                <input type="file" accept="image/*" onChange={handleIconUpload} className="hidden" />
              </label>
              {form.icon && (
                <button type="button" onClick={() => update("icon", "")} className="text-red-400 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Screenshots */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Screenshots</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {form.screenshots.map((src, i) => (
                <div key={i} className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <Image src={src} alt={`screenshot ${i}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => update("screenshots", form.screenshots.filter((_, j) => j !== i))}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="cursor-pointer w-24 h-16 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-blue-300 transition-colors">
                {uploadingScreenshot ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : <Plus className="w-4 h-4 text-gray-400" />}
                <span className="text-xs text-gray-400">Add</span>
                <input type="file" accept="image/*" multiple onChange={handleScreenshotUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Download */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Download Source</h3>
          <p className="text-xs text-gray-400 mb-3">Choose one: upload a file, enter a direct URL, or paste an external link (e.g. Play Store)</p>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
              <label className="cursor-pointer inline-flex items-center gap-2 text-sm bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {form.downloadUrl && form.downloadUrl.startsWith("/uploads/files/") ? "✓ File uploaded" : "Choose file"}
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Or Direct Download URL</label>
              <input type="url" value={form.downloadUrl} onChange={(e) => update("downloadUrl", e.target.value)} placeholder="https://..." className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Or External Link (Play Store, App Store, etc.)</label>
              <input type="url" value={form.externalLink} onChange={(e) => update("externalLink", e.target.value)} placeholder="https://play.google.com/..." className="input" />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Tags & Extra Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input type="text" value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="messaging, social, communication" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min OS Version</label>
              <input type="text" value={form.minOs} onChange={(e) => update("minOs", e.target.value)} placeholder="Android 8.0+" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="url" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://example.com" className="input" />
            </div>
          </div>
        </div>
      </div>

      {/* Right: sidebar settings */}
      <div className="flex flex-col gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
          <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform *</label>
              <select value={form.platform} onChange={(e) => update("platform", e.target.value)} className="input">
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="input">
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License</label>
              <select value={form.license} onChange={(e) => update("license", e.target.value)} className="input">
                {LICENSES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className="input">
                <option value="active">Active (published)</option>
                <option value="draft">Draft (hidden)</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Featured app</span>
            </label>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm px-3 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2 mt-5">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "create" ? "Publish App" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="w-full bg-gray-100 text-gray-700 font-medium py-2 rounded-xl hover:bg-gray-200 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

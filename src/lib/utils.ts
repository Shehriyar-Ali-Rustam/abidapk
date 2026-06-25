export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function formatDownloads(count: number): string {
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(1) + "K";
  return count.toString();
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    android: "🤖",
    windows: "🪟",
    mac: "🍎",
    ios: "📱",
    web: "🌐",
    linux: "🐧",
  };
  return icons[platform.toLowerCase()] || "💾";
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    android: "bg-green-100 text-green-700",
    windows: "bg-blue-100 text-blue-700",
    mac: "bg-gray-100 text-gray-700",
    ios: "bg-purple-100 text-purple-700",
    web: "bg-cyan-100 text-cyan-700",
    linux: "bg-orange-100 text-orange-700",
  };
  return colors[platform.toLowerCase()] || "bg-gray-100 text-gray-700";
}

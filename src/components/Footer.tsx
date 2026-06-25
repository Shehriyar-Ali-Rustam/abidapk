import Link from "next/link";
import { Download, Shield, Star, Zap, ExternalLink, Globe, Mail } from "lucide-react";

const LINKS = {
  Platform: [
    { label: "Android Apps", href: "/apps?platform=android" },
    { label: "Windows Software", href: "/apps?platform=windows" },
    { label: "Mac Apps", href: "/apps?platform=mac" },
    { label: "iOS Apps", href: "/apps?platform=ios" },
    { label: "Linux Software", href: "/apps?platform=linux" },
    { label: "Web Apps", href: "/apps?platform=web" },
  ],
  Browse: [
    { label: "All Apps", href: "/apps" },
    { label: "Featured Apps", href: "/apps?featured=true" },
    { label: "Top Downloads", href: "/apps" },
    { label: "New Releases", href: "/apps?sort=new" },
    { label: "Games", href: "/apps?category=games" },
    { label: "Productivity", href: "/apps?category=productivity" },
  ],
  Account: [
    { label: "Login", href: "/auth/login" },
    { label: "Register", href: "/auth/register" },
    { label: "Admin Panel", href: "/admin" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0d1117] text-gray-400 mt-0">
      {/* Trust bar */}
      <div className="border-b border-white/5 bg-[#161b27]">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { icon: Shield, text: "Safe & Virus-Free Downloads", color: "text-green-400" },
              { icon: Zap, text: "Fast Direct Downloads", color: "text-blue-400" },
              { icon: Star, text: "Real User Reviews", color: "text-yellow-400" },
              { icon: Download, text: "Free to Download", color: "text-purple-400" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-2 text-sm">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-gray-300 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                APK<span className="text-blue-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-5">
              Your trusted source for downloading apps, games, and software across all platforms. Safe, fast, and always up to date.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: ExternalLink, href: "#" },
                { icon: Globe, href: "#" },
                { icon: Mail, href: "#" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-white font-semibold text-sm mb-4">{section}</h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} APKHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-green-500" />
              All downloads are scanned and verified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

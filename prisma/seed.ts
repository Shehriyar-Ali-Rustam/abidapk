import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashedPw = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@apkhub.com" },
    update: {},
    create: {
      email: "admin@apkhub.com",
      name: "Admin",
      password: hashedPw,
      role: "admin",
    },
  });
  console.log("Admin created:", admin.email);

  // Demo user
  const userPw = await bcrypt.hash("user123", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Demo User",
      password: userPw,
      role: "user",
    },
  });

  // Categories
  const cats = await Promise.all([
    prisma.category.upsert({ where: { slug: "social" }, update: {}, create: { name: "Social Media", slug: "social", icon: "💬" } }),
    prisma.category.upsert({ where: { slug: "games" }, update: {}, create: { name: "Games", slug: "games", icon: "🎮" } }),
    prisma.category.upsert({ where: { slug: "productivity" }, update: {}, create: { name: "Productivity", slug: "productivity", icon: "⚡" } }),
    prisma.category.upsert({ where: { slug: "tools" }, update: {}, create: { name: "Tools & Utilities", slug: "tools", icon: "🔧" } }),
    prisma.category.upsert({ where: { slug: "entertainment" }, update: {}, create: { name: "Entertainment", slug: "entertainment", icon: "🎬" } }),
    prisma.category.upsert({ where: { slug: "education" }, update: {}, create: { name: "Education", slug: "education", icon: "📚" } }),
    prisma.category.upsert({ where: { slug: "music" }, update: {}, create: { name: "Music & Audio", slug: "music", icon: "🎵" } }),
    prisma.category.upsert({ where: { slug: "photography" }, update: {}, create: { name: "Photography", slug: "photography", icon: "📷" } }),
  ]);

  const catMap: Record<string, string> = {};
  cats.forEach((c) => { catMap[c.slug] = c.id; });

  // Sample apps
  const apps = [
    {
      slug: "whatsapp",
      name: "WhatsApp Messenger",
      developer: "Meta Platforms",
      shortDesc: "Simple, reliable, private messaging and calling for free.",
      description: `WhatsApp is a fast, simple and secure messaging app. It's used by over 2B people in more than 180 countries. WhatsApp is free and offers simple, secure, reliable messaging and calling, available on phones all over the world.\n\nFeatures:\n• Send messages, photos, videos, documents, and voice messages\n• Make voice and video calls\n• Share your status updates\n• Group chat with up to 1024 participants\n• End-to-end encryption by default`,
      version: "2.24.10.78",
      packageName: "com.whatsapp",
      platform: "android",
      size: "70 MB",
      categoryId: catMap["social"],
      featured: true,
      status: "active",
      downloads: 1500000,
      license: "Free",
      minOs: "Android 5.0+",
      tags: JSON.stringify(["messaging", "chat", "calls", "social"]),
      screenshots: JSON.stringify([]),
      externalLink: "https://play.google.com/store/apps/details?id=com.whatsapp",
    },
    {
      slug: "vlc-media-player",
      name: "VLC Media Player",
      developer: "VideoLAN",
      shortDesc: "The best video and music player. Fast and easy!",
      description: `VLC for Android plays most local video and audio files, as well as network streams.\n\nVLC for Android supports multi-track audio and subtitles, speed control, aspect ratio, zoom, picture-in-picture and gestures to control playback.\n\nFeatures:\n• Plays most video and audio formats\n• Subtitle support\n• Audio player with full media library\n• Network streams\n• No ads, no tracking`,
      version: "3.6.0",
      packageName: "org.videolan.vlc",
      platform: "android",
      size: "34 MB",
      categoryId: catMap["entertainment"],
      featured: true,
      status: "active",
      downloads: 800000,
      license: "Open Source",
      minOs: "Android 6.0+",
      tags: JSON.stringify(["video", "player", "media", "music"]),
      screenshots: JSON.stringify([]),
      externalLink: "https://play.google.com/store/apps/details?id=org.videolan.vlc",
    },
    {
      slug: "notepad-plus",
      name: "Notepad++",
      developer: "Don Ho",
      shortDesc: "Free source code editor and Notepad replacement for Windows.",
      description: `Notepad++ is a free source code editor and Notepad replacement that supports several languages.\n\nFeatures:\n• Syntax Highlighting and Syntax Folding\n• PCRE (Perl Compatible Regular Expression) Search/Replace\n• Multi-Document and Multi-View\n• Auto-completion: Word completion, Function completion and Function parameters hint\n• Multi-Language environment supported\n• Macro recording and playback`,
      version: "8.6.4",
      platform: "windows",
      size: "5 MB",
      categoryId: catMap["productivity"],
      featured: true,
      status: "active",
      downloads: 950000,
      license: "Open Source",
      minOs: "Windows 7+",
      tags: JSON.stringify(["editor", "text", "code", "developer"]),
      screenshots: JSON.stringify([]),
      externalLink: "https://notepad-plus-plus.org/",
    },
    {
      slug: "spotify-music",
      name: "Spotify: Music and Podcasts",
      developer: "Spotify AB",
      shortDesc: "Listen to songs and podcasts. Music for everyone.",
      description: `With Spotify, you can listen to music and play millions of songs and podcasts for free. Stream music and podcasts, and listen to content from creators all over the world.\n\nFeatures:\n• Play any artist, album, or playlist\n• Browse a huge library of music and podcasts\n• Download music to listen offline\n• Discover new music with personalized recommendations`,
      version: "8.9.14",
      packageName: "com.spotify.music",
      platform: "android",
      size: "45 MB",
      categoryId: catMap["music"],
      featured: false,
      status: "active",
      downloads: 650000,
      license: "Freemium",
      minOs: "Android 6.0+",
      tags: JSON.stringify(["music", "streaming", "podcast", "audio"]),
      screenshots: JSON.stringify([]),
      externalLink: "https://play.google.com/store/apps/details?id=com.spotify.music",
    },
    {
      slug: "7-zip",
      name: "7-Zip",
      developer: "Igor Pavlov",
      shortDesc: "Free and open-source file archiver for Windows.",
      description: `7-Zip is a file archiver with a high compression ratio.\n\n7-Zip works for Windows 10 / 8 / 7 / Vista / XP. There is a port of the command line version to Linux/Unix.\n\nFeatures:\n• High compression ratio in 7z format\n• Supported formats: 7z, XZ, BZIP2, GZIP, TAR, ZIP, WIM, AR, ARJ, CAB, CHM, CPIO, CramFS, DMG, EXT, FAT, GPT, HFS, IHEX, ISO, LZH, LZMA, MBR, MSI, NSIS, NTFS, OOXML, RAR, RPM, SquashFS, UDF, UEFI, VDI, VHD, VHDX, VMDK, WIM, XAR and Z`,
      version: "24.06",
      platform: "windows",
      size: "2 MB",
      categoryId: catMap["tools"],
      featured: false,
      status: "active",
      downloads: 420000,
      license: "Open Source",
      minOs: "Windows 7+",
      tags: JSON.stringify(["zip", "archive", "compress", "extract"]),
      screenshots: JSON.stringify([]),
      externalLink: "https://www.7-zip.org/",
    },
    {
      slug: "duolingo",
      name: "Duolingo: Language Lessons",
      developer: "Duolingo",
      shortDesc: "Learn Spanish, French, German, English and more.",
      description: `The most popular language learning app in the world! Learn Spanish, French, German, Italian, Russian, Portuguese, Turkish, Dutch, Irish, Danish, Swedish, Ukrainian, Esperanto, Polish, Greek, Hungarian, Norwegian, Hebrew, Welsh, and English.\n\nFeatures:\n• Bite-sized lessons that work\n• Practice speaking, reading, listening, and writing\n• Get personalized learning path\n• Fun and game-like interface`,
      version: "5.160.1",
      packageName: "com.duolingo",
      platform: "android",
      size: "52 MB",
      categoryId: catMap["education"],
      featured: false,
      status: "active",
      downloads: 380000,
      license: "Freemium",
      minOs: "Android 7.0+",
      tags: JSON.stringify(["language", "learning", "education", "spanish"]),
      screenshots: JSON.stringify([]),
      externalLink: "https://play.google.com/store/apps/details?id=com.duolingo",
    },
    {
      slug: "obs-studio",
      name: "OBS Studio",
      developer: "OBS Project",
      shortDesc: "Free and open source software for video recording and live streaming.",
      description: `Open Broadcaster Software is free and open source software for video recording and live streaming. Stream to Twitch, YouTube and many other providers or record your own videos with high quality.\n\nFeatures:\n• High performance real time video/audio capturing and mixing\n• Unlimited scenes you can switch between seamlessly\n• Filters for video sources including image masking, color correction, chroma/color keying\n• Powerful and easy to use configuration options`,
      version: "30.2.0",
      platform: "windows",
      size: "320 MB",
      categoryId: catMap["tools"],
      featured: true,
      status: "active",
      downloads: 290000,
      license: "Open Source",
      minOs: "Windows 10+",
      tags: JSON.stringify(["streaming", "recording", "video", "obs"]),
      screenshots: JSON.stringify([]),
      externalLink: "https://obsproject.com/",
    },
    {
      slug: "snapseed",
      name: "Snapseed",
      developer: "Google LLC",
      shortDesc: "Complete professional photo editor developed by Google.",
      description: `Snapseed is a complete and professional photo editor developed by Google.\n\nFeatures:\n• Open RAW files\n• 29 Tools and Filters including Healing, Brush, Structure, HDR, Perspective\n• Save your personal looks and apply them to photos with one tap\n• Selective filter brush\n• All styles and filters can be tweaked with fine, precise control`,
      version: "2.21.0",
      packageName: "com.niksoftware.snapseed",
      platform: "android",
      size: "38 MB",
      categoryId: catMap["photography"],
      featured: false,
      status: "active",
      downloads: 210000,
      license: "Free",
      minOs: "Android 6.0+",
      tags: JSON.stringify(["photo", "editor", "filter", "google"]),
      screenshots: JSON.stringify([]),
      externalLink: "https://play.google.com/store/apps/details?id=com.niksoftware.snapseed",
    },
  ];

  for (const app of apps) {
    await prisma.app.upsert({
      where: { slug: app.slug },
      update: {},
      create: app,
    });
    console.log("Created app:", app.name);
  }

  // Add some reviews
  const allApps = await prisma.app.findMany({ take: 3 });
  for (const app of allApps) {
    await prisma.review.upsert({
      where: { appId_userId: { appId: app.id, userId: demoUser.id } },
      update: {},
      create: {
        appId: app.id,
        userId: demoUser.id,
        rating: 5,
        comment: "Excellent app! Works perfectly and the interface is very clean.",
      },
    });
  }

  console.log("Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

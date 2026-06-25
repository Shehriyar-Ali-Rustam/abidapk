import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const platform = searchParams.get("platform") || "";
  const featured = searchParams.get("featured") === "true";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const skip = (page - 1) * limit;

  const where = {
    status: "active" as const,
    ...(search && {
      OR: [
        { name: { contains: search } },
        { developer: { contains: search } },
        { shortDesc: { contains: search } },
      ],
    }),
    ...(category && { category: { slug: category } }),
    ...(platform && { platform }),
    ...(featured && { featured: true }),
  };

  const [apps, total] = await Promise.all([
    prisma.app.findMany({
      where,
      include: {
        category: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { downloads: "desc" },
      skip,
      take: limit,
    }),
    prisma.app.count({ where }),
  ]);

  return NextResponse.json({ apps, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const slug = data.slug || slugify(data.name);

    const app = await prisma.app.create({
      data: {
        ...data,
        slug,
        screenshots: JSON.stringify(data.screenshots || []),
        tags: JSON.stringify(data.tags || []),
      },
      include: { category: true },
    });

    return NextResponse.json(app, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create app" }, { status: 500 });
  }
}

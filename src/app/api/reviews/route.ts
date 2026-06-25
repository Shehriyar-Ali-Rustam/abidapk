import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { appId, rating, comment } = await req.json();
  const userId = (session.user as { id?: string }).id!;

  if (!appId || !rating || !comment) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  try {
    const review = await prisma.review.upsert({
      where: { appId_userId: { appId, userId } },
      update: { rating, comment },
      create: { appId, userId, rating, comment },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const userId = (session.user as { id?: string }).id!;
  const role = (session.user as { role?: string }).role;

  const review = await prisma.review.findUnique({ where: { id: id! } });
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (review.userId !== userId && role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await prisma.review.delete({ where: { id: id! } });
  return NextResponse.json({ success: true });
}

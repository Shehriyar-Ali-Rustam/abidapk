import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const app = await prisma.app.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }], status: "active" },
    include: { files: { orderBy: { uploadedAt: "desc" }, take: 1 } },
  });

  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.app.update({
    where: { id: app.id },
    data: { downloads: { increment: 1 } },
  });

  // if external link, redirect there
  if (app.externalLink) {
    return NextResponse.redirect(app.externalLink);
  }

  // if file uploaded
  if (app.files.length > 0) {
    const file = app.files[0];
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}${file.filepath}`);
  }

  // if direct downloadUrl
  if (app.downloadUrl) {
    return NextResponse.redirect(app.downloadUrl);
  }

  return NextResponse.json({ error: "No download available" }, { status: 404 });
}

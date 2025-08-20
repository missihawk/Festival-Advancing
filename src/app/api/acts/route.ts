// src/app/api/acts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  // haal acts op met anchor-stage (optioneel)
  const acts = await prisma.act.findMany({
    orderBy: { show_time: "asc" },
    include: { stage: true },
  });
  return NextResponse.json(acts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { name: string, show_time?: string, stageId?: number }
    const { name } = body;
    if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

    const act = await prisma.act.create({
      data: {
        name,
        show_time: body.show_time ? new Date(body.show_time) : null,
        stageId: body.stageId ? Number(body.stageId) : null,
      },
    });

    return NextResponse.json(act, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "failed to create act" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "bad id" }, { status: 400 });
  }

  const act = await prisma.act.findUnique({
    where: { id },
    include: { stage: true },
  });

  if (!act) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(act);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "bad id" }, { status: 400 });
  }

  const b = await req.json();

  const act = await prisma.act.update({
    where: { id },
    data: {
      name: b.name ?? undefined,
      show_time: b.show_time ? new Date(b.show_time) : undefined,
      stageId: b.stageId != null ? Number(b.stageId) : undefined,
    },
  });

  return NextResponse.json(act);
}

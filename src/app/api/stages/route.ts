import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const stages = await prisma.stage.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
  return NextResponse.json(stages);
}

export async function POST(req: Request) {
  const body = await req.json();
  const stage = await prisma.stage.create({
    data: {
      name: String(body.name),
      order: body.order != null ? Number(body.order) : 100,
      color: body.color ? String(body.color) : null,
    },
  });
  return NextResponse.json(stage, { status: 201 });
}

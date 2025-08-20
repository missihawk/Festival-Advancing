import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const acts = await prisma.act.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(acts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const act = await prisma.act.create({
    data: {
      name: String(body.name),
      date: new Date(body.date),
    },
  });
  return NextResponse.json(act, { status: 201 });
}

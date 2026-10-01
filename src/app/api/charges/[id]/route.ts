import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.charge.findFirst({ where: { id, syndicId: user.id } });
    if (!existing) {
      return NextResponse.json({ error: "Charge not found" }, { status: 404 });
    }

    await prisma.charge.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

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

    const depense = await prisma.depense.findFirst({ where: { id, syndicId: user.id } });
    if (!depense) {
      return NextResponse.json({ error: "Dépense not found" }, { status: 404 });
    }

    await prisma.depense.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

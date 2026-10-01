import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { statut, montantReel } = await req.json();

    if (statut && !["impayé", "payé"].includes(statut)) {
      return NextResponse.json(
        { error: "Statut must be 'impayé' or 'payé'" },
        { status: 400 }
      );
    }

    const existing = await prisma.paiement.findFirst({
      where: { id, bureau: { syndicId: user.id } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Paiement not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (statut) data.statut = statut;
    if (montantReel !== undefined) data.montantReel = montantReel;

    const paiement = await prisma.paiement.update({
      where: { id },
      data,
    });

    return NextResponse.json({ paiement });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

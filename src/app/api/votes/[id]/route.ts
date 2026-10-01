import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    const existingVote = await prisma.vote.findFirst({
      where: { id, syndicId: user.id },
    });

    if (!existingVote) {
      return NextResponse.json({ error: "Vote introuvable" }, { status: 404 });
    }

    const updatedVote = await prisma.vote.update({
      where: { id },
      data: {
        actif: typeof body.actif === "boolean" ? body.actif : false,
      },
    });

    return NextResponse.json({ vote: updatedVote });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

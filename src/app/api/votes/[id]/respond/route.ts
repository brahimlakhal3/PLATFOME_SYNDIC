import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, getPropertyId } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await authenticate();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const pid = getPropertyId(user);

  try {
    const vote = await prisma.vote.findFirst({ where: { id, syndicId: pid } });
    if (!vote) {
      return NextResponse.json({ error: "Vote introuvable" }, { status: 404 });
    }
    if (!vote.actif) {
      return NextResponse.json({ error: "Ce vote est clôturé" }, { status: 400 });
    }

    const { choix } = await req.json();
    if (!["pour", "contre", "neutre"].includes(choix)) {
      return NextResponse.json({ error: "Choix invalide" }, { status: 400 });
    }

    const existing = await prisma.voteResponse.findUnique({
      where: { voteId_userId: { voteId: id, userId: user.id } },
    });
    if (existing) {
      return NextResponse.json({ error: "Vous avez déjà voté" }, { status: 400 });
    }

    const response = await prisma.voteResponse.create({
      data: { voteId: id, userId: user.id, choix },
    });

    return NextResponse.json({ response }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

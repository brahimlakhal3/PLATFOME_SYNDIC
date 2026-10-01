import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

export async function GET() {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const depenses = await prisma.depense.findMany({
    where: { syndicId: user.id },
    orderBy: [{ annee: "desc" }, { moisDepart: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ depenses });
}

export async function POST(req: Request) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const libelle = body.libelle?.trim();
    const montant = Number(body.montant);
    const annee = Number(body.annee);
    const moisDepart = Number(body.mois);
    const imageUrl = body.imageUrl ?? null;

    if (!libelle || isNaN(montant) || isNaN(moisDepart) || isNaN(annee)) {
      return NextResponse.json(
        { error: "Libellé, montant, mois et année sont requis" },
        { status: 400 }
      );
    }

    if (moisDepart < 1 || moisDepart > 12) {
      return NextResponse.json(
        { error: "Le mois doit être entre 1 et 12" },
        { status: 400 }
      );
    }

    const depense = await prisma.depense.create({
      data: { libelle, montant, moisDepart, annee, imageUrl: imageUrl || null, syndicId: user.id },
    });

    return NextResponse.json({ depense }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await authenticate();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const annee = searchParams.get("annee");

    const where: Record<string, unknown> = {};
    if (annee) where.annee = parseInt(annee);

    if (user.role === "coproprietaire") {
      const mesBureaux = await prisma.bureau.findMany({
        where: { userId: user.id },
        select: { id: true },
      });
      where.bureauId = { in: mesBureaux.map((b) => b.id) };
    } else {
      where.bureau = { syndicId: user.id };
    }

    const paiements = await prisma.paiement.findMany({
      where,
      orderBy: [{ annee: "desc" }, { mois: "asc" }],
      include: {
        bureau: {
          select: { nom: true, quotePartPrivee: true, quotePartCommunes: true, user: { select: { nom: true, prenom: true } } },
        },
      },
    });

    return NextResponse.json({ paiements });
  } catch {
    return NextResponse.json({ paiements: [] });
  }
}

export async function POST(req: Request) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const { annee } = await req.json();

    if (!annee) {
      return NextResponse.json({ error: "Année is required" }, { status: 400 });
    }

    const charges = await prisma.charge.findMany({
      where: { annee: parseInt(annee), syndicId: user.id },
    });

    if (charges.length === 0) {
      return NextResponse.json(
        { error: "Aucune charge trouvée pour cette année" },
        { status: 400 }
      );
    }

    const totalCharges = charges.reduce((sum, c) => sum + (c.montantAnnuel ?? (c.montantMensuel ?? 0) * 12), 0);
    const bureaux = await prisma.bureau.findMany({ where: { syndicId: user.id } });

    if (bureaux.length === 0) {
      return NextResponse.json(
        { error: "Aucun bureau trouvé" },
        { status: 400 }
      );
    }

    const totalQuotePart = bureaux.reduce(
      (sum, b) => sum + b.quotePartPrivee + (b.quotePartCommunes ?? 0) * 0.5,
      0
    );

    if (totalQuotePart === 0) {
      return NextResponse.json(
        { error: "La quote-part totale des bureaux est de 0. Impossible de calculer les parts." },
        { status: 400 }
      );
    }

    const monthlyTotal = totalCharges / 12;

    const existingCount = await prisma.paiement.count({
      where: { annee: parseInt(annee), bureau: { syndicId: user.id } },
    });
    if (existingCount > 0) {
      return NextResponse.json(
        { error: "Des paiements existent déjà pour cette année. Supprimez-les d'abord." },
        { status: 409 }
      );
    }

    const paiementsData = [];
    for (const bureau of bureaux) {
      const effectiveQuote = bureau.quotePartPrivee + (bureau.quotePartCommunes ?? 0) * 0.5;
      const part = effectiveQuote / totalQuotePart;
      const monthlyBureau = monthlyTotal * part;
      for (let mois = 1; mois <= 12; mois++) {
        paiementsData.push({
          mois,
          annee: parseInt(annee),
          montant: Math.round(monthlyBureau * 100) / 100,
          statut: "impayé",
          bureauId: bureau.id,
        });
      }
    }

    await prisma.paiement.createMany({ data: paiementsData });

    const paiements = await prisma.paiement.findMany({
      where: { annee: parseInt(annee), bureau: { syndicId: user.id } },
      orderBy: [{ bureauId: "asc" }, { mois: "asc" }],
      include: {
        bureau: {
          select: { nom: true, quotePartPrivee: true, quotePartCommunes: true, user: { select: { nom: true, prenom: true } } },
        },
      },
    });

    return NextResponse.json({ paiements, total: totalCharges.toFixed(2) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

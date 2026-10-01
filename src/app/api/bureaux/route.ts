import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, getPropertyId } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await authenticate();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const disponible = searchParams.get("disponible") === "true";
  const pid = getPropertyId(user);

  const where: Record<string, unknown> = {};
  if (user.role === "coproprietaire") {
    where.userId = user.id;
  } else if (disponible) {
    where.userId = null;
  }

  if (user.role === "syndic") {
    where.syndicId = pid;
  }

  const bureaux = await prisma.bureau.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { nom: true, prenom: true } } },
  });

  return NextResponse.json({ bureaux });
}

export async function POST(req: Request) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const nom = body.nom?.trim();
    const { etage, titreFoncier, quotePartPrivee, quotePartCommunes } = body;
    const coproprietaireId = body.userId ?? null;

    if (!nom) {
      return NextResponse.json(
        { error: "Nom est requis" },
        { status: 400 }
      );
    }

    if (quotePartPrivee === undefined || quotePartPrivee === null || quotePartPrivee === "") {
      return NextResponse.json(
        { error: "Quote-part privée est requise" },
        { status: 400 }
      );
    }

    if (coproprietaireId) {
      const copro = await prisma.user.findUnique({
        where: { id: coproprietaireId },
      });
      if (!copro || copro.role !== "coproprietaire" || copro.syndicId !== user.id) {
        return NextResponse.json(
          { error: "Copropriétaire not found" },
          { status: 404 }
        );
      }
    }

    const bureau = await prisma.bureau.create({
      data: {
        nom,
        etage: etage ? parseInt(etage, 10) : null,
        titreFoncier: titreFoncier?.trim() || null,
        quotePartPrivee: parseFloat(quotePartPrivee),
        quotePartCommunes: quotePartCommunes ? parseFloat(quotePartCommunes) : null,
        userId: coproprietaireId || null,
        syndicId: user.id,
      },
      include: { user: { select: { nom: true, prenom: true } } },
    });

    return NextResponse.json({ bureau }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { id } = await params;
  const bureau = await prisma.bureau.findFirst({
    where: { id, syndicId: user.id },
    include: { user: true },
  });

  if (!bureau) {
    return NextResponse.json({ error: "Bureau not found" }, { status: 404 });
  }

  return NextResponse.json({ bureau });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
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

    const existing = await prisma.bureau.findFirst({ where: { id, syndicId: user.id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Bureau not found" },
        { status: 404 }
      );
    }

    if (coproprietaireId) {
      const copro = await prisma.user.findFirst({
        where: { id: coproprietaireId, role: "coproprietaire", syndicId: user.id },
      });
      if (!copro) {
        return NextResponse.json(
          { error: "Copropriétaire not found" },
          { status: 404 }
        );
      }
    }

    const bureau = await prisma.bureau.update({
      where: { id },
      data: {
        nom,
        etage: etage ? parseInt(etage, 10) : null,
        titreFoncier: titreFoncier?.trim() || null,
        quotePartPrivee: parseFloat(quotePartPrivee),
        quotePartCommunes: quotePartCommunes ? parseFloat(quotePartCommunes) : null,
        userId: coproprietaireId || null,
      },
      include: { user: { select: { nom: true, prenom: true } } },
    });

    return NextResponse.json({ bureau });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

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
    const existing = await prisma.bureau.findFirst({ where: { id, syndicId: user.id } });
    if (!existing) {
      return NextResponse.json({ error: "Bureau not found" }, { status: 404 });
    }

    await prisma.bureau.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

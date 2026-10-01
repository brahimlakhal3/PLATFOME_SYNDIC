import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

export async function GET() {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const charges = await prisma.charge.findMany({
    where: { syndicId: user.id },
    orderBy: [{ annee: "desc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ charges });
}

export async function POST(req: Request) {
  const user = await authenticate();
  if (!user || user.role !== "syndic") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const { libelle, description, montantAnnuel, montantMensuel, typeFixe, annee, imageUrl } = await req.json();

    if (!libelle || libelle.trim() === "") {
      return NextResponse.json(
        { error: "Le libellé est requis" },
        { status: 400 }
      );
    }

    const anneeNumber = Number(annee);
    if (isNaN(anneeNumber)) {
      return NextResponse.json(
        { error: "L'année est requise et doit être valide" },
        { status: 400 }
      );
    }

    let montantAnnuelNumber = montantAnnuel ? Number(montantAnnuel) : null;
    let montantMensuelNumber = montantMensuel ? Number(montantMensuel) : null;

    if (!montantAnnuelNumber && !montantMensuelNumber) {
      return NextResponse.json(
        { error: "Le montant annuel ou mensuel doit être renseigné" },
        { status: 400 }
      );
    }

    if (montantAnnuelNumber && !montantMensuelNumber) {
      montantMensuelNumber = montantAnnuelNumber / 12;
    } else if (montantMensuelNumber && !montantAnnuelNumber) {
      montantAnnuelNumber = montantMensuelNumber * 12;
    }

    const charge = await prisma.charge.create({
      data: {
        libelle: libelle.trim(),
        description: description || null,
        montantAnnuel: montantAnnuelNumber,
        montantMensuel: montantMensuelNumber,
        typeFixe: typeFixe === true || typeFixe === "true",
        imageUrl: imageUrl || null,
        annee: anneeNumber,
        syndicId: user.id,
      },
    });

    return NextResponse.json({ charge }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
